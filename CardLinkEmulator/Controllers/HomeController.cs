using System;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using CardLinkEmulator.DAL.Entities;
using CardLinkEmulator.Helpers;
using CardLinkEmulator.Models;
using CardLinkEmulator.Repositories;

namespace CardLinkEmulator.Controllers
{
    public class HomeController : Controller
    {
        #region Fields

        private readonly IPaymentRepository _paymentRepository;

        #endregion

        #region Ctor

        public HomeController (IPaymentRepository paymentRepository) {
            _paymentRepository = paymentRepository;
        }

        #endregion

        #region Methods

        public ActionResult Index() {
            return View();
        }

        public ActionResult About() {
            var payments = _paymentRepository.Payments.OrderByDescending(x => x.DateInserted).ToList();

            return View(payments);
        }

        public ActionResult Contact() {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Pay() {
            var model = new PaymentModel();
            return View(model);
        }

        [HttpPost]
        public ActionResult Pay (PaymentModel pmt) {
            var isDigestValid = CheckDigest(pmt);
            pmt.isDigestValid = isDigestValid;

            if (isDigestValid) {
                var payment = InsertPayment(pmt);
                pmt.Id = payment.Id;
                return View(pmt);
            }

            return View(pmt);
        }

        public async Task<ActionResult> ProcessPaymentAsync (PaymentModel pmt) {
            var secret = ConfigurationManager.AppSettings["secret"];
            var status = Status.CAPTURED.ToString();
            var riskScore = "0";
            var txId = CommonHelper.UniqueRandomNumbersInRange(11);
            var paymentRef = CommonHelper.UniqueRandomNumbersInRange(6);
            var message = "";
            var redirectionUrl = pmt.confirmUrl;
            var concatStr = "";
            var payMethod = status.ToLowerInvariant() == Status.CAPTURED.ToString().ToLowerInvariant() ? CommonHelper.FindCreditCardType(pmt.cardNum).ToString() : "";

            Payment payment = _paymentRepository.GetById(pmt.Id);

            if (ModelState.IsValid) {
                switch (pmt.status) {
                    case "canceled":
                        status = Status.CANCELED.ToString();
                        riskScore = "";
                        payMethod = "";
                        paymentRef = "";
                        redirectionUrl = pmt.cancelUrl;
                        break;
                    case "refused":
                        status = Status.REFUSED.ToString();
                        riskScore = "";
                        payMethod = "";
                        paymentRef = "";
                        redirectionUrl = pmt.cancelUrl;
                        break;
                    case "error":
                        status = Status.ERROR.ToString();
                        riskScore = "";
                        payMethod = "";
                        paymentRef = "";
                        redirectionUrl = pmt.cancelUrl;
                        break;
                }

                payment.cardNum = pmt.cardNum;
                payment.riskScore = riskScore;
                payment.status = status;
                payment.payMethod = payMethod;
                payment.txId = txId;
                payment.paymentRef = paymentRef;
                payment.message = message;

                concatStr = GetConcatenatedString(pmt, status, message, riskScore, payMethod, txId, paymentRef, secret);

                payment.digest = CommonHelper.HashCode(concatStr);

                _paymentRepository.SavePayment(payment);
            }

            var response = System.Web.HttpContext.Current.Response;
            response.Clear();

            var s = new StringBuilder();
            s.Append("<html>");
            s.AppendFormat("<body onload='document.forms[\"form\"].submit()'>");
            s.AppendFormat("<form name='form' action='{0}' method='post'>", redirectionUrl);

            var data = new NameValueCollection();
            data.Add("mid", pmt.mid);
            data.Add("orderid", pmt.orderid);
            data.Add("status", status);
            data.Add("orderAmount", pmt.orderAmount.ToString().Replace(",", "."));
            data.Add("currency", pmt.currency);
            data.Add("paymentTotal", pmt.orderAmount.ToString().Replace(",", "."));
            data.Add("message", message);
            data.Add("riskScore", riskScore);
            data.Add("payMethod", payMethod);
            data.Add("txId", txId);
            data.Add("paymentRef", paymentRef);
            data.Add("digest", CommonHelper.HashCode(concatStr));

            foreach (string key in data) {
                s.AppendFormat("<input type='hidden' name='{0}' value='{1}' />", key, data[key]);
            }

            s.Append("</form></body></html>");

            await Task.Delay(20000);

            response.Write(s.ToString());
            response.End();

            return Content("Redirected");
        }

        public ActionResult BackConfirmation (int paymentId) {
            // Get and Update Payment
            var p = _paymentRepository.GetById(paymentId);
            p.DateReposted = DateTime.Now;
            _paymentRepository.SavePayment(p);

            string data = "mid" + "=" + p.mid + "&" +
                          "orderid" + "=" + p.orderid + "&" +
                          "status" + "=" + Server.UrlEncode(p.status) + "&" +
                          "orderAmount" + "=" + p.orderAmount + "&" +
                          "currency" + "=" + p.currency + "&" +
                          "paymentTotal" + "=" + p.orderAmount + "&" +
                          "message" + "=" + p.message + "&" +
                          "riskScore" + "=" + p.riskScore + "&" +
                          "payMethod" + "=" + p.payMethod + "&" +
                          "txId" + "=" + p.txId + "&" +
                          "paymentRef" + "=" + p.paymentRef + "&" +
                          "digest" + "=" + Server.UrlEncode(p.digest);

            var redirectionUrl = p.status == "CAPTURED" ? p.confirmUrl : p.cancelUrl;

            try {
                // Create a request using a URL that can receive a post.
                //WebRequest request = WebRequest.Create(redirectionUrl);
                HttpWebRequest request = (HttpWebRequest) WebRequest.Create(redirectionUrl);

                request.UserAgent = "Modirum VPOS";

                // Set the Method property of the request to POST.
                request.Method = "POST";

                // Create POST data and convert it to a byte array.
                string postData = data; // "This is a test that posts this string to a Web server.";

                byte[] byteArray = Encoding.UTF8.GetBytes(postData);

                // Set the ContentType property of the WebRequest.
                request.ContentType = "application/x-www-form-urlencoded";

                // Set the ContentLength property of the WebRequest.
                request.ContentLength = byteArray.Length;

                // Get the request stream.
                Stream dataStream = request.GetRequestStream();

                // Write the data to the request stream.
                dataStream.Write(byteArray, 0, byteArray.Length);

                // Close the Stream object.
                dataStream.Close();

                // Get the response.
                WebResponse response = request.GetResponse();

                var responseStatus = ((HttpWebResponse) response).StatusDescription;

                response.Close();
            }
            catch (Exception) {
                //do nothing
            }

            return View();
        }

        #endregion

        #region Privates

        private bool CheckDigest (PaymentModel pmt) {
            var extInstallmentoffset = string.IsNullOrWhiteSpace(pmt.extInstallmentoffset) ? "" : pmt.extInstallmentoffset;
            var extInstallmentperiod = string.IsNullOrWhiteSpace(pmt.extInstallmentperiod) ? "" : pmt.extInstallmentperiod;
            var secret = ConfigurationManager.AppSettings["secret"];
            var version = string.IsNullOrWhiteSpace(pmt.Version) ? "" : pmt.Version;

            var concatenatedFields =
                version
                + pmt.mid
                + pmt.lang
                + pmt.orderid
                + pmt.orderDesc
                + pmt.orderAmount.ToString().Replace(",", ".")
                + pmt.currency
                + pmt.payerEmail
                + pmt.billCountry
                + pmt.billZip
                + pmt.billCity
                + pmt.billAddress
                + extInstallmentoffset
                + extInstallmentperiod
                + pmt.confirmUrl
                + pmt.cancelUrl
                + secret;

            var computedDigest = CommonHelper.HashCode(concatenatedFields);
            pmt.calculatedDigest = computedDigest;

            return computedDigest == pmt.digest;
        }

        private static string GetConcatenatedString (
            PaymentModel pmt,
            string status,
            string message,
            string riskScore,
            string payMethod,
            string txId,
            string paymentRef,
            string secret
        ) {
            var concatStr = string.Concat(
                "2",
                pmt.mid,
                pmt.orderid,
                status,
                pmt.orderAmount.ToString().Replace(",", "."),
                pmt.currency,
                pmt.orderAmount.ToString().Replace(",", "."),
                message,
                riskScore,
                payMethod,
                txId,
                paymentRef,
                secret
            );
            return concatStr;
        }

        private Payment InsertPayment (PaymentModel pmt) {
            var payment = new Payment();
            PaymentToEntity(pmt, payment);
            payment.DateInserted = DateTime.Now;
            _paymentRepository.SavePayment(payment);
            return payment;
        }

        private void PaymentToEntity (PaymentModel model, Payment payment) {
            payment.mid = model.mid;
            payment.lang = model.lang;
            payment.orderid = model.orderid;
            payment.orderDesc = model.orderDesc;
            payment.orderAmount = model.orderAmount;
            payment.currency = model.currency;
            payment.payerEmail = model.payerEmail;
            payment.billCountry = model.billCountry;
            payment.billState = model.billState;
            payment.billZip = model.billZip;
            payment.billCity = model.billCity;
            payment.billAddress = model.billAddress;
            payment.extInstallmentoffset = model.extInstallmentoffset;
            payment.extInstallmentperiod = model.extInstallmentperiod;
            payment.confirmUrl = model.confirmUrl;
            payment.cancelUrl = model.cancelUrl;
            payment.digest = model.digest;
            payment.cardNum = model.cardNum;
        }

        private PaymentModel PaymentToModel (Payment payment) {
            return new PaymentModel {
                Id = payment.Id,
                mid = payment.mid,
                lang = payment.lang,
                orderid = payment.orderid,
                orderDesc = payment.orderDesc,
                orderAmount = payment.orderAmount,
                currency = payment.currency,
                payerEmail = payment.payerEmail,
                billCountry = payment.billCountry,
                billState = payment.billState,
                billZip = payment.billZip,
                billCity = payment.billCity,
                billAddress = payment.billAddress,
                extInstallmentoffset = payment.extInstallmentoffset,
                extInstallmentperiod = payment.extInstallmentperiod,
                confirmUrl = payment.confirmUrl,
                cancelUrl = payment.cancelUrl,
                digest = payment.digest,
                cardNum = payment.cardNum
            };
        }

        #endregion
    }
}