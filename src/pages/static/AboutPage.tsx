import React from 'react';
import { Sparkles, Heart, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div id="about-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold tracking-widest text-[#8b3a42] uppercase">
          Our Heritage
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          The Story of Noor & Co.
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Born out of a deep passion for Pakistani craftsmanship and heirloom textile traditions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed shadow-xs">
        <p>
          Founded in Lahore, <strong>Noor & Co.</strong> was created to redefine contemporary Eastern wear by marrying the lightness of pure Swiss lawns with the intricacy of subcontinental embroidery and artisanal cutwork.
        </p>

        <p>
          Each design begins on the drawing board with motifs inspired by Mughal architecture, Kashmiri flora, and Persian miniature art. From our 80s fine combed lawn to pure silk dupattas and crinkle chiffons, we select only the finest natural fibers suited for Pakistan’s climate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <Sparkles className="w-5 h-5 text-[#8b3a42] mx-auto mb-2" />
            <h3 className="font-bold text-stone-900 text-xs">Authentic Textiles</h3>
            <p className="text-[11px] text-stone-500 mt-1">100% pure combed yarns</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <Heart className="w-5 h-5 text-rose-600 mx-auto mb-2" />
            <h3 className="font-bold text-stone-900 text-xs">Artisanal Cutwork</h3>
            <p className="text-[11px] text-stone-500 mt-1">Hand-finished resham embroidery</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <Award className="w-5 h-5 text-amber-600 mx-auto mb-2" />
            <h3 className="font-bold text-stone-900 text-xs">Nationwide Trust</h3>
            <p className="text-[11px] text-stone-500 mt-1">Cash on Delivery across 200+ cities</p>
          </div>
        </div>
      </div>
    </div>
  );
};
