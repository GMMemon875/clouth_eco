import mongoose, { Schema, Document } from 'mongoose';
import { IProduct, IVariant, IProductImage } from '../types';

export interface IProductDocument extends Omit<IProduct, 'id' | '_id'>, Document {}

const VariantSchema = new Schema<IVariant>(
  {
    sku: { type: String, required: true },
    color: { type: String, required: true },
    colorCode: { type: String, default: '#000000' },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'Unstitched', 'Standard'],
      required: true,
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    additionalPrice: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    basePrice: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    fabric: { type: String, required: true, index: true },
    shirtDetails: { type: String, default: '' },
    trouserDetails: { type: String, default: '' },
    dupattaDetails: { type: String, default: '' },
    measurements: {
      chest: { type: String },
      length: { type: String },
      sleeve: { type: String },
      trouser: { type: String },
    },
    images: [ProductImageSchema],
    videoUrl: { type: String, default: null },
    variants: [VariantSchema],
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false, index: true },
    bestSeller: { type: Boolean, default: false, index: true },
    sale: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', description: 'text', tags: 'text', sku: 'text' });

export const ProductModel = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
