using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CardLinkEmulator.DAL.Entities;

namespace CardLinkEmulator.Repositories
{
    public interface IPaymentRepository
    {
        IEnumerable<Payment> Payments { get; }

        void SavePayment(Payment payment);
        Payment GetById (int id);
    }
}