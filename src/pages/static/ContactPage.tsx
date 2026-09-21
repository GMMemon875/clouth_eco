import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent. Our team will get back to you shortly.', 'success');
  };

  return (
    <div id="contact-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
          Client Concierge
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Get in Touch With Us
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Have an inquiry regarding custom sizing, unstitched suit orders, or wholesale? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-6 shadow-xs">
          <h2 className="font-bold text-sm sm:text-base text-stone-900 border-b border-stone-100 pb-3">
            Contact Channels
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-stone-700">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-stone-900 font-bold">WhatsApp Direct Line</strong>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  +{settings.whatsappNumber}
                </a>
                <span className="text-[11px] text-stone-400 block">Mon - Sun: 10:00 AM – 10:00 PM PKT</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-stone-100 text-stone-700 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-stone-900 font-bold">Email Support</strong>
                <span className="text-stone-600">{settings.contactEmail}</span>
                <span className="text-[11px] text-stone-400 block">Response within 24 business hours</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-stone-100 text-stone-700 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-stone-900 font-bold">Design Studio & Fulfillment Hub</strong>
                <span className="text-stone-600 block">Gulberg III, M.M. Alam Road, Lahore, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                ✓
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Message Received</h3>
              <p className="text-xs text-stone-500">Thank you for reaching out. We will respond promptly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 03001234567"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Inquiry Topic</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Question about Luxury Lawn suit stitching"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your question here..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#8b3a42] hover:bg-[#6b232a] text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
