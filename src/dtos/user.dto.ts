import { Types } from 'mongoose';

export interface UserResponseDto {
  id: string | Types.ObjectId;
  name: string;
  email: string;
  role: 'customer' | 'worker' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
