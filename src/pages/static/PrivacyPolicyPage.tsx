import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div id="privacy-policy-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Privacy Policy</h1>
      <p className="text-stone-500">Effective Date: January 1, 2026</p>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
        <h2 className="font-bold text-stone-900 text-base">1. Customer Data Collection</h2>
        <p>
          We respect your privacy. When you place a Cash on Delivery order with Noor & Co., we only collect essential shipping details including your full name, Pakistani mobile number, WhatsApp contact, city, and delivery street address to fulfill parcel courier delivery.
        </p>

        <h2 className="font-bold text-stone-900 text-base">2. No Payment Card Storage</h2>
        <p>
          Because our Phase 1 storefront relies on Cash on Delivery (COD) and direct WhatsApp orders, we never request, process, or store credit card or debit card numbers on our servers.
        </p>

        <h2 className="font-bold text-stone-900 text-base">3. Courier Sharing</h2>
        <p>
          Your shipping address and mobile contact number are securely shared with authorized Pakistani domestic courier partners (such as TCS, Leopards, Call Courier) strictly for delivering your parcel and SMS delivery updates.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div id="terms-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Terms of Service</h1>
      <p className="text-stone-500">Effective Date: January 1, 2026</p>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
        <h2 className="font-bold text-stone-900 text-base">1. Storefront Agreement</h2>
        <p>
          By placing an order via our online checkout or through our verified WhatsApp ordering channel, you agree to these Terms and conditions.
        </p>

        <h2 className="font-bold text-stone-900 text-base">2. Cash on Delivery Obligation</h2>
        <p>
          Orders confirmed for Cash on Delivery represent a binding booking. Customers are requested to ensure the accurate cash amount is ready when the courier rider arrives. Repeated refused parcels may lead to restrictions on future COD bookings.
        </p>

        <h2 className="font-bold text-stone-900 text-base">3. Color Reproduction Disclaimer</h2>
        <p>
          We make every optical effort to display the colors and textures of our luxury lawn, silk, and chiffon garments accurately. However, slight variations may occur due to device screen calibration and studio flash lighting.
        </p>
      </div>
    </div>
  );
};
