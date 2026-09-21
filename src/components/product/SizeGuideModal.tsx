import React from 'react';
import { X, Ruler, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productFabric?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, productFabric }) => {
  if (!isOpen) return null;

  const standardSizes = [
    { size: 'XS', chest: '36"', waist: '32"', hip: '38"', length: '38"', sleeve: '20"', trouser: '37"' },
    { size: 'S', chest: '38"', waist: '34"', hip: '40"', length: '39"', sleeve: '20.5"', trouser: '38"' },
    { size: 'M', chest: '40"', waist: '36"', hip: '42"', length: '40"', sleeve: '21"', trouser: '38.5"' },
    { size: 'L', chest: '43"', waist: '39"', hip: '45"', length: '41"', sleeve: '21.5"', trouser: '39"' },
    { size: 'XL', chest: '46"', waist: '42"', hip: '48"', length: '42"', sleeve: '22"', trouser: '39.5"' },
  ];

  return (
    <div
      id="size-guide-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="size-guide-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-200 text-[#8b3a42]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Women's Size & Measurement Guide
              </h2>
              <p className="text-xs text-stone-500">Standard Pakistani Ready-to-Wear (Pret) Sizing in Inches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Table */}
        <div className="p-4 sm:p-6 space-y-6 overflow-x-auto">
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest</th>
                  <th className="p-3">Waist</th>
                  <th className="p-3">Hip</th>
                  <th className="p-3">Shirt Length</th>
                  <th className="p-3">Sleeve</th>
                  <th className="p-3">Trouser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600">
                {standardSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-stone-50 transition">
                    <td className="p-3 font-bold text-stone-900 bg-stone-50/50">{row.size}</td>
                    <td className="p-3">{row.chest}</td>
                    <td className="p-3">{row.waist}</td>
                    <td className="p-3">{row.hip}</td>
                    <td className="p-3">{row.length}</td>
                    <td className="p-3">{row.sleeve}</td>
                    <td className="p-3">{row.trouser}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Unstitched Note */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Unstitched Fabric Information</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              Unstitched suits contain full, generous fabric allowances accommodating up to a 48" shirt length and chest size up to 50".
              Shirt (3.0–3.25m), Trouser (2.5m), and Dupatta (2.5m) can be custom-tailored to any personalized cut or style.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="text-[11px] text-stone-500 leading-relaxed space-y-1">
            <p>• All measurements above are finished garment measurements in inches.</p>
            <p>• Actual measurements may slightly vary by up to 0.5" due to hand-tailoring and fabric composition ({productFabric || 'Cotton/Lawn'}).</p>
            <p>• Need tailored guidance? Feel free to message our fashion concierge on WhatsApp before placing your order.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
