import React, { useState } from 'react';
import { Save, CheckCircle2, Sliders, Truck, MessageSquare, AlertCircle } from 'lucide-react';
import { IStoreSettings } from '../../types/store';

interface AdminSettingsTabProps {
  settings: IStoreSettings;
  onSaveSettings: (settings: Partial<IStoreSettings>) => Promise<void>;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [storeName, setStoreName] = useState(settings.storeName || settings.brandName || 'Noor & Co.');
  const [tagline, setTagline] = useState(settings.tagline || 'Pakistani Pret & Unstitched Couture');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+92 300 1234567');
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || settings.contactEmail || 'support@noorandco.pk');
  const [deliveryBaseFee, setDeliveryBaseFee] = useState(
    (settings.delivery?.baseFee ?? settings.delivery?.standardCharge ?? 250).toString()
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    (settings.delivery?.freeShippingThreshold ?? settings.delivery?.freeDeliveryThreshold ?? 5000).toString()
  );
  const [estimatedDays, setEstimatedDays] = useState(settings.delivery?.estimatedDays || '3-5 Working Days');
  const [announcementText, setAnnouncementText] = useState(
    settings.announcement?.text || settings.announcementText || 'Free Shipping Nationwide on Orders Above Rs. 5,000 | Cash on Delivery Available'
  );
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    settings.announcement?.enabled !== undefined ? settings.announcement.enabled : true
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await onSaveSettings({
        brandName: storeName.trim(),
        storeName: storeName.trim(),
        tagline: tagline.trim(),
        whatsappNumber: whatsappNumber.trim(),
        supportEmail: supportEmail.trim(),
        contactEmail: supportEmail.trim(),
        announcementText: announcementText.trim(),
        delivery: {
          ...settings.delivery,
          standardCharge: Number(deliveryBaseFee) || 0,
          freeDeliveryThreshold: Number(freeShippingThreshold) || 0,
          baseFee: Number(deliveryBaseFee) || 0,
          freeShippingThreshold: Number(freeShippingThreshold) || 0,
          estimatedDays: estimatedDays.trim(),
        },
        announcement: {
          text: announcementText.trim(),
          enabled: announcementEnabled,
        },
      });
      setSuccessMsg('Store configurations saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save store settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
          Store Operations & Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure nationwide courier delivery tariffs, WhatsApp support line, and store announcements
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General Store Profile */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="font-serif text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            General Brand Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official WhatsApp Business Number (for Orders & Support)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Support Email Address
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@noorandco.pk"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
              />
            </div>
          </div>
        </div>

        {/* Courier & Delivery Tariffs */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
            <Truck className="w-4 h-4 text-[#8b3a42]" />
            <h2 className="font-serif text-sm font-bold text-stone-900">
              Courier Delivery & Shipping Tariffs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Base Delivery Fee (PKR)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryBaseFee}
                onChange={(e) => setDeliveryBaseFee(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
              />
              <p className="text-[10px] text-stone-400 mt-1">Charged on orders below free threshold</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Free Delivery Above (PKR)
              </label>
              <input
                type="number"
                min="0"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
              />
              <p className="text-[10px] text-stone-400 mt-1">Orders above this get free delivery</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Delivery Duration Text
              </label>
              <input
                type="text"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                placeholder="3-5 Working Days"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
              />
              <p className="text-[10px] text-stone-400 mt-1">Shown during checkout</p>
            </div>
          </div>
        </div>

        {/* Top Announcement Bar */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h2 className="font-serif text-sm font-bold text-stone-900">
              Store Announcement Bar
            </h2>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="rounded text-[#8b3a42] focus:ring-[#8b3a42]"
              />
              <span className="font-medium text-stone-700">Display on Storefront</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Top Bar Message
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8b3a42]"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            id="save-store-settings-btn"
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save Store Configurations'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
