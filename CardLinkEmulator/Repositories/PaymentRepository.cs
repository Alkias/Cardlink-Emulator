using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CardLinkEmulator.DAL;
using CardLinkEmulator.DAL.Entities;

namespace CardLinkEmulator.Repositories
{
    public class PaymentRepository: IPaymentRepository
    {
        private EmulatorContext context = new EmulatorContext();

        #region Implementation of IPaymentRepository

        public IEnumerable<Payment> Payments {
            get { return context.Payment; }
        }

        public Payment GetById (int id) {
            return context.Payment.Find(id);
        }

        public void SavePayment (Payment payment) {
            if (payment.Id == 0) {
                context.Payment.Add(payment);
            }
            context.SaveChanges();
        }

        #endregion
    }
}