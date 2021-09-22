using System.Configuration;
using CardLinkEmulator.Helpers;
using Microsoft.Ajax.Utilities;

namespace CardLinkEmulator.Models
{
    public class PaymentModel
    {
        //private readonly string _secret = ConfigurationManager.AppSettings["secret"];

        public int Id { get; set; }
        public string mid { get; set; }

        public string Version { get; set; }

        public string lang { get; set; }
        public string orderid { get; set; }
        public string orderDesc { get; set; }

        public decimal orderAmount { get; set; }

        public string currency { get; set; }
        public string payerEmail { get; set; }
        public string billCountry { get; set; }
        public string billState { get; set; }
        public string billZip { get; set; }
        public string billCity { get; set; }
        public string billAddress { get; set; }
        public string extInstallmentoffset { get; set; }
        public string extInstallmentperiod { get; set; }
        public string confirmUrl { get; set; }
        public string cancelUrl { get; set; }
        public string digest { get; set; }
        public string calculatedDigest { get; set; }

        public string cardNum { get; set; }

        public string status { get; set; }

        public bool isDigestValid { get; set; }

        //public string concatenedFields =>
        //    mid
        //    + lang
        //    + orderid
        //    + orderDesc
        //    + orderAmount
        //    + currency
        //    + payerEmail
        //    + billCountry
        //    + (billState.IsNullOrWhiteSpace() ? "" : billState)
        //    + billZip
        //    + billCity
        //    + billAddress
        //    + (extInstallmentoffset.IsNullOrWhiteSpace() ? "" : extInstallmentoffset)
        //    + (extInstallmentperiod.IsNullOrWhiteSpace() ? "" : extInstallmentperiod)
        //    + confirmUrl
        //    + cancelUrl
        //    + _secret;

        //public string ComputedDigest => CommonHelper.HashCode(concatenedFields);

        //public bool isValid => ComputedDigest == digest;
    }
}