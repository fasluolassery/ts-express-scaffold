import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { USER_ROLES, UserRole } from '../constants';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModelType = Model<IUser>;

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Do not return by default in queries
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const result = ret as Record<string, unknown>;
        result.id = result._id ? String(result._id) : result.id;
        delete result._id;
        delete result.__v;
        delete result.passwordHash;
        return result;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        const result = ret as Record<string, unknown>;
        result.id = result._id ? String(result._id) : result.id;
        delete result._id;
        delete result.__v;
        delete result.passwordHash;
        return result;
      },
    },
  }
);

/**
 * Pre-save middleware to hash plain password before storing.
 */
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }

  const saltRounds = 10;
  this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
});

/**
 * Compares candidate password against the stored bcrypt hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const UserModel: UserModelType =
  (mongoose.models.User as UserModelType) ||
  mongoose.model<IUser, UserModelType>('User', userSchema);
