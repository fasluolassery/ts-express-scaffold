import { IUser } from '../models';
import { UserResponseDto } from '../dtos';

/**
 * Pure transformation mapper to sanitize user database document into client-safe DTO.
 */
export const toUserResponseDto = (user: IUser): UserResponseDto => ({
  id: String(user._id || user.id),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
  updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
});

/**
 * Transforms an array of user documents into client-safe DTOs.
 */
export const toUserResponseDtoList = (users: IUser[]): UserResponseDto[] =>
  users.map(toUserResponseDto);
