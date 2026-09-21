import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '../types';

export interface ICategoryDocument extends Omit<ICategory, 'id' | '_id'>, Document {}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    parentCategory: { type: String, default: null },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);
