import { Types } from 'mongoose';

export interface UserResponseDto {
  id: string | Types.ObjectId;
  name: string;
  email: string;
  role: 'customer' | 'worker';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
