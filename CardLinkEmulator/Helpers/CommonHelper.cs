using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using CardLinkEmulator.Models;

namespace CardLinkEmulator.Helpers
{
    public static class CommonHelper
    {
        private static Random random = new Random();

        /// <summary>
        /// Generates a SHA1 hash string
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string HashCode (string str) {
            var returnedHash = "";
            try {
                SHA256 sHA = SHA256.Create();
                byte[] bytes = new UTF8Encoding().GetBytes(str);
                sHA.ComputeHash(bytes);
                returnedHash = Convert.ToBase64String(sHA.Hash);
                return returnedHash;

                //var hash = SHA1.Create();
                //var encoder = new UTF8Encoding();
                //var combined = encoder.GetBytes(str);
                //hash.ComputeHash(combined);
                //returnedHash = Convert.ToBase64String(hash.Hash);
            }
            catch (Exception ex) {
                var exMessage = "Error in HashCode : " + ex.Message;
                return returnedHash;
            }
        }

           

        /// <summary>
        /// Returns the type of credit card based on its number
        /// See: https://www.regular-expressions.info/creditcard.html
        /// </summary>
        /// <param name="cardNumber">Card Number</param>
        /// <returns></returns>
        public static CardType FindCreditCardType (string cardNumber) {


            if (Regex.Match(cardNumber, @"^4[0-9]{12}(?:[0-9]{3})?$").Success) {
                return CardType.Visa;
            }

            if (Regex.Match(cardNumber, @"^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$").Success) {
                return CardType.MasterCard;
            }

            if (Regex.Match(cardNumber, @"^3[47][0-9]{13}$").Success) {
                return CardType.AmericanExpress;
            }

            if (Regex.Match(cardNumber, @"^6(?:011|5[0-9]{2})[0-9]{12}$").Success) {
                return CardType.Discover;
            }

            if (Regex.Match(cardNumber, @"^(?:2131|1800|35\d{3})\d{11}$").Success) {
                return CardType.JCB;
            }

            throw new Exception("Unknown card.");
        }

        /// <summary>
        /// Produces a random number with the required number of numbers
        /// </summary>
        /// <param name="howMatch">The requested number of numbers</param>
        /// <returns></returns>
        public static string UniqueRandomNumbersInRange (int howMatch) {

            List<int> uniqueInts = new List<int>(10000);
            List<int> randomNumbers = new List<int>(500);

            for (int i = 1; i < 10000; i++) {
                uniqueInts.Add(i);
            }

            for (int i = 1; i < 500; i++) {
                int index = random.Next(uniqueInts.Count);
                randomNumbers.Add(uniqueInts[index]);
                uniqueInts.RemoveAt(index);
            }

            var uniqueNumberList = uniqueInts.ToList().OrderBy(x => random.Next()).Take(howMatch);

            var uniqueNumbers = "";
            foreach (var n in uniqueNumberList) {
                uniqueNumbers += n.ToString().Substring(0, 1);
            }

            return uniqueNumbers;
        }
    }
}