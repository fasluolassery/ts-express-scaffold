import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { VALIDATION_MESSAGES } from '../constants';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'worker';
  isActive: boolean;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'worker';
  isActive: boolean;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type IUserModel = Model<IUserDocument>;

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, VALIDATION_MESSAGES.NAME_REQUIRED],
      trim: true,
      minlength: [2, VALIDATION_MESSAGES.NAME_MIN],
      maxlength: [50, VALIDATION_MESSAGES.NAME_MAX],
    },
    email: {
      type: String,
      required: [true, VALIDATION_MESSAGES.EMAIL_REQUIRED],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, VALIDATION_MESSAGES.EMAIL_INVALID],
    },
    password: {
      type: String,
      required: [true, VALIDATION_MESSAGES.PASSWORD_REQUIRED],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'worker'],
        message: VALIDATION_MESSAGES.ROLE_INVALID,
      },
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (this: IUserDocument) {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
});

// Compare password instance method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export default User;
