import React, { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { IProduct } from '../../types/store';

interface ProductEditorModalProps {
  product?: (IProduct & { totalStock?: number }) | null;
  categories: Array<{ slug: string; name: string }>;
  onClose: () => void;
  onSave: (productData: Partial<IProduct>) => Promise<void>;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  categories,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || (categories[0]?.slug || '3-piece-suits'));
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() || '4250');
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() || '');
  const [fabric, setFabric] = useState(product?.fabric || 'Luxury Swiss Lawn');
  const [description, setDescription] = useState(product?.description || '');
  const [shirtDetails, setShirtDetails] = useState(product?.shirtDetails || '');
  const [trouserDetails, setTrouserDetails] = useState(product?.trouserDetails || '');
  const [dupattaDetails, setDupattaDetails] = useState(product?.dupattaDetails || '');
  const [imageUrl, setImageUrl] = useState(product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(product?.status || 'active');

  // Simple variant stock state
  const [variants, setVariants] = useState(
    product?.variants?.map((v) => ({ ...v })) || [
      { sku: 'NEW-S', color: 'Default', colorCode: '#1c1917', size: 'S' as const, stock: 10 },
      { sku: 'NEW-M', color: 'Default', colorCode: '#1c1917', size: 'M' as const, stock: 15 },
      { sku: 'NEW-L', color: 'Default', colorCode: '#1c1917', size: 'L' as const, stock: 8 },
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateVariantStock = (idx: number, newStock: number) => {
    const updated = [...variants];
    updated[idx].stock = Math.max(0, newStock);
    setVariants(updated);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        sku: `NEW-${variants.length + 1}`,
        color: 'Classic',
        colorCode: '#1c1917',
        size: 'M',
        stock: 5,
      },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a product title.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        name: name.trim(),
        category,
        basePrice: Number(basePrice) || 0,
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        fabric: fabric.trim(),
        description: description.trim(),
        shirtDetails: shirtDetails.trim(),
        trouserDetails: trouserDetails.trim(),
        dupattaDetails: dupattaDetails.trim(),
        status,
        images: [
          {
            url: imageUrl.trim(),
            alt: name.trim(),
            isPrimary: true,
          },
        ],
        variants,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70 rounded-t-2xl">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
            {isEditing ? `Edit Product: ${product?.name}` : 'Add New Eastern Dress'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-stone-800 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Product Title / Dress Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zartaj Luxury Embroidered 3-Piece Lawn Suit"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-[#8b3a42] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:ring-2 focus:ring-[#8b3a42] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Fabric Type</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. Luxury Swiss Lawn, Chiffon, Cambric"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:ring-2 focus:ring-[#8b3a42] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Price (PKR) *</label>
              <input
                type="number"
                required
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="4250"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:ring-2 focus:ring-[#8b3a42] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Compare At Price (PKR)</label>
              <input
                type="number"
                min="0"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="4950 (optional strikethrough)"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:ring-2 focus:ring-[#8b3a42] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:ring-2 focus:ring-[#8b3a42] focus:outline-none"
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Primary Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 text-xs focus:ring-2 focus:ring-[#8b3a42] focus:outline-none"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                  onError={(e) => {
                    (e.target as any).src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Exquisite lawn suit with digital printed dupatta..."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:ring-2 focus:ring-[#8b3a42] focus:outline-none"
            />
          </div>

          {/* Unstitched / Pret Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Shirt Fabric Details</label>
              <input
                type="text"
                value={shirtDetails}
                onChange={(e) => setShirtDetails(e.target.value)}
                placeholder="Embroidered front (1.25m)"
                className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Trouser Fabric</label>
              <input
                type="text"
                value={trouserDetails}
                onChange={(e) => setTrouserDetails(e.target.value)}
                placeholder="Dyed cambric (2.5m)"
                className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Dupatta Fabric</label>
              <input
                type="text"
                value={dupattaDetails}
                onChange={(e) => setDupattaDetails(e.target.value)}
                placeholder="Digital silk (2.5m)"
                className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white text-xs"
              />
            </div>
          </div>

          {/* Variant Stock Management */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-semibold text-stone-700">
                Sizes & Available Stock Quantity
              </label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs font-semibold text-[#8b3a42] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="border border-stone-200 rounded-xl divide-y divide-stone-200 overflow-hidden">
              {variants.map((v, i) => (
                <div key={i} className="p-2.5 bg-white flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-semibold text-stone-800 w-16">Size: {v.size}</span>
                    <span className="text-stone-500 font-mono text-[11px]">({v.sku})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 text-[11px]">Stock:</span>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => handleUpdateVariantStock(i, Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded border border-stone-300 text-center font-bold text-stone-900"
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(i)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
