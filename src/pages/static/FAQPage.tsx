import React, { useState } from 'react';
import { ChevronDown, Phone, HelpCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const FAQPage: React.FC = () => {
  const { settings } = useSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Cash on Delivery (COD) and how does it work?',
      a: 'Cash on Delivery (COD) allows you to pay in cash directly to the courier rider upon receiving your parcel at your doorstep anywhere in Pakistan. You do not need a credit card or bank transfer to place an order.',
    },
    {
      q: 'How long does delivery take across Pakistan?',
      a: 'Orders are dispatched within 24–48 hours. Major cities like Lahore, Karachi, Islamabad, and Rawalpindi typically receive orders within 2–3 working days. Other cities and rural areas take 3–5 working days.',
    },
    {
      q: 'What are the delivery charges?',
      a: 'Standard nationwide courier shipping is Rs. 250 flat. However, any order exceeding Rs. 3,500 automatically qualifies for 100% FREE Nationwide Delivery.',
    },
    {
      q: 'Can I order directly on WhatsApp?',
      a: 'Yes! Every suit has an "Order on WhatsApp" button that automatically creates a pre-formatted message with the suit name, SKU, selected color, and size. Our customer representative will assist and confirm your details directly on WhatsApp.',
    },
    {
      q: 'What is the difference between Unstitched and Ready-to-Wear (Pret)?',
      a: 'Unstitched suits include uncut fabric lengths for the shirt (kameez), trouser (shalwar), and dupatta along with embroidered patches/borders that you can tailor according to your personal measurements. Ready-to-Wear suits come professionally stitched in standard sizes (XS, S, M, L, XL).',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer an easy 7-day exchange guarantee. If the outfit does not fit or you received a damaged item, contact our WhatsApp concierge within 7 days of delivery for a prompt replacement.',
    },
  ];

  return (
    <div id="faq-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#8b3a42]/10 text-[#8b3a42] flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Everything you need to know about placing orders, sizing, delivery, and COD across Pakistan.
        </p>
      </div>

      <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-xs">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="p-4 sm:p-5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-stone-900 focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
        <h3 className="font-bold text-sm text-emerald-950">Have a question not answered here?</h3>
        <p className="text-xs text-emerald-800">
          Our friendly support team is available on WhatsApp daily from 10 AM to 10 PM.
        </p>
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
            'Assalam-o-Alaikum, I have a question regarding an order.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
