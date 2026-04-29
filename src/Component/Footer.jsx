import React, { useState } from "react";
import logo from "../assets/ComLogo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  return (
    <>
      <footer className="bg-[#212639] text-white py-10 px-6">
        <div className="w-full justify-center flex items-start flex-col md:flex-row gap-8 md:gap-30 ">
        {/* Logo Section */}
        <Link to="/">
          <div className="space-y-2 col-span-1">
            <img src={logo} alt="Logo" className="h-20 object-contain" />
          </div>
        </Link>


        <div className="flex items-start flex-col md:flex-row gap-8 md:gap-48">

          {/* Links */}
          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">Community</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/events" className="hover:underline">Events & Workshops</a></li>
              <li><a href="/refer-now" className="hover:underline">Refer and Earn</a></li>
              {/* <li><a href="/blogs" className="hover:underline">Blogs</a></li> */}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">Information</h4>
            <ul className="space-y-3 text-sm">
              {/* <li><a href="#" className="hover:underline">Offers</a></li>
              <li><a href="/projects" className="hover:underline">Projects</a></li> */}
              <li><a href="/promotions" className="hover:underline">Redemption</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm text-gray-400">About</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  className="hover:underline"
                  onClick={() => setShowPolicyModal(true)}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:underline"
                  onClick={() => setShowPolicyModal(true)}
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="space-y-2">
          <h4 className="text-sm text-gray-400">Subscribe to our newsletter</h4>
          <div className="flex w-full max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your E-mail"
              className="flex-grow px-4 py-2 text-black bg-white outline-none placeholder:text-sm rounded-l max-sm:w-[60%]"
            />
            <button className="bg-[#F9461C] text-white px-5 py-2 rounded-r max-sm:w-[40%]">
              Subscribe
            </button>
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
          © 2025 Kee Club Piramal. A part of Piramal Realty. All Rights Reserved.
        </div>
      </footer>

      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Terms & Conditions for Referral Encashment
              </h3>
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                aria-label="Close Terms and Conditions"
              >
                &times;
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto max-h-[70vh] text-sm text-gray-700 space-y-4">
              <p>
                This document outlines the terms and conditions governing the encashment of
                referral benefits provided to customers ("Referrer") for successful referral of a
                purchaser ("Referred Customer") for purchase of a residential unit ("Flat") in
                the project developed by [Company Name] ("Company").
              </p>

              <div>
                <p className="font-semibold">1. Eligibility</p>
                <p>1.1 The referral benefit shall be applicable only when:</p>
                <ul className="list-disc pl-5">
                  <li>The Referrer has registered the referral through official channels defined by the Company.</li>
                  <li>The Referred Customer completes booking of a flat with payment of booking amount and the flat is registered as per the MahaRERA Act.</li>
                  <li>The referral is validated and approved by the Company.</li>
                </ul>
                <p className="mt-2">
                  1.2 Self-referrals or duplicate referrals (same customer referred by multiple parties)
                  shall not be eligible. The first recorded valid referral shall be considered.
                </p>
              </div>

              <div>
                <p className="font-semibold">2. Referral Benefit</p>
                <p>2.1 The referral benefit amount shall be as per the Company’s prevailing referral scheme at the time of booking.</p>
                <p>2.2 The benefit shall be communicated in writing/email at the time of referral approval.</p>
                <p>2.3 The Company reserves the right to modify or withdraw referral schemes without prior notice.</p>
              </div>

              <div>
                <p className="font-semibold">3. Payment Conditions</p>
                <p>3.1 Referral encashment shall be processed only upon fulfilment of the following:</p>
                <ul className="list-disc pl-5">
                  <li>Execution of Agreement for Sale between Company and Referred Customer.</li>
                  <li>Receipt of minimum 10% of the total flat value from the Referred Customer.</li>
                </ul>
                <p className="mt-2">
                  3.2 In case the booking is cancelled, transferred, or refunded at any stage prior to
                  fulfilment of conditions or payout date, the referral benefit shall stand cancelled.
                </p>
              </div>

              <div>
                <p className="font-semibold">4. Payment Timeline</p>
                <p>4.1 The referral payment shall be processed within 90 days from the date of fulfilment of all eligibility and payment conditions.</p>
                <p>4.2 Payment shall be made via bank transfer/NEFT/RTGS/Cheque to the Referrer’s registered bank account only.</p>
                <p>4.3 The Referrer must submit valid KYC documents, including:</p>
                <ul className="list-disc pl-5">
                  <li>PAN Card</li>
                  <li>Aadhar Card</li>
                  <li>Cancelled Cheque</li>
                </ul>
                <p className="mt-2">Delay in submission of documents may result in delay in payment processing.</p>
              </div>

              <div>
                <p className="font-semibold">5. Tax Deduction</p>
                <p>5.1 Applicable taxes, including TDS as per prevailing laws, shall be deducted before payout.</p>
                <p>5.2 The Referrer shall be responsible for reporting such income in their tax filings.</p>
              </div>

              <div>
                <p className="font-semibold">6. Dispute & Verification</p>
                <p>6.1 The Company reserves the sole right to verify the authenticity of the referral.</p>
                <p>6.2 Any dispute regarding referral eligibility or benefit amount shall be subject to final decision of the Company.</p>
              </div>

              <div>
                <p className="font-semibold">7. Non-Transferability</p>
                <p>7.1 Referral benefits are non-transferable and cannot be assigned to any third party.</p>
              </div>

              <div>
                <p className="font-semibold">8. Compliance & Fraud</p>
                <p>8.1 Any fraudulent activity, misrepresentation, or misuse of the referral program shall result in disqualification and forfeiture of benefits.</p>
              </div>

              <div>
                <p className="font-semibold">9. Governing Law</p>
                <p>9.1 These terms shall be governed by and construed in accordance with the laws of India.</p>
                <p>9.2 Any disputes shall be subject to the jurisdiction of courts in [City].</p>
              </div>

              <div>
                <p className="font-semibold">10. Acceptance</p>
                <p>
                  By opting for referral encashment, the Referrer confirms that they have read,
                  understood, and agreed to these terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
