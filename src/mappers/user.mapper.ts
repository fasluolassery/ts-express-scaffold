import { UserResponseDto } from '../dtos/user.dto';
import { IUserDocument } from '../models/user.model';

export class UserMapper {
  /**
   * Maps a database User Document to a UserResponseDto.
   * @param user The Mongoose user document
   * @returns The user response data transfer object
   */
  public static toResponseDto(user: IUserDocument): UserResponseDto {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
