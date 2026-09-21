import React from 'react';
import { RotateCcw, CheckCircle, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const ReturnPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div id="return-policy-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <RotateCcw className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Exchange & Return Policy
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Your satisfaction is our priority. Read our hassle-free 7-day exchange conditions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="font-bold text-sm sm:text-base text-stone-900">7-Day Exchange Window</h2>
          <p>
            Any unworn, unwashed, and unstitched article with original tags intact can be exchanged within <strong>7 days</strong> of delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm sm:text-base text-stone-900">Eligible Conditions for Exchange</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
            <li>Item size does not fit as expected (for Ready-to-Wear Pret items).</li>
            <li>Defective, torn, or damaged fabric received.</li>
            <li>Incorrect color, SKU, or article delivered in error.</li>
            <li>Items must retain original packaging, invoice, and brand tags.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm sm:text-base text-stone-900">Non-Exchangeable Articles</h2>
          <p>
            Custom-stitched items, items sold under clearance "Flash Sale" discounts exceeding 40%, and fabric that has been tailored or altered are not eligible for exchange.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm sm:text-base text-stone-900">How to Initiate an Exchange</h2>
          <p>
            Simply WhatsApp our customer care team at <strong>+{settings.whatsappNumber}</strong> with your Order Number and photos of the article and tags. Our team will arrange reverse pickup or guide you to ship it to our fulfillment hub in Lahore.
          </p>
        </section>
      </div>
    </div>
  );
};
