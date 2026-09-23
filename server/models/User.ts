import mongoose, { Schema, Document } from 'mongoose';
import { IUser, IUserAddress } from '../types';

export interface IUserDocument extends Omit<IUser, 'id' | '_id'>, Document {}

const UserAddressSchema = new Schema<IUserAddress>(
  {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    area: { type: String, default: '' },
    landmark: { type: String, default: '' },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    address: { type: UserAddressSchema, default: () => ({ address: '', city: '', area: '', landmark: '' }) },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Method / transform to exclude password & sensitive reset tokens in JSON output
UserSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, any>) => {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    ret.id = ret._id?.toString();
    return ret;
  },
});

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
