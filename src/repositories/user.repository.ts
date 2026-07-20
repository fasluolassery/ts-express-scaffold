import { BaseRepository } from './base.repository';
import { User, IUserDocument } from '../models/user.model';

export class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  /**
   * Find a user by their email address.
   * @param email Email address of the user
   * @returns User document or null
   */
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return this.findOne({ email });
  }

  /**
   * Find a user by email and explicitly include password field for authentication.
   */
  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return this.model.findOne({ email }).select('+password').exec();
  }

  /**
   * Find a user by refresh token (selecting refreshToken field).
   */
  async findByRefreshToken(refreshToken: string): Promise<IUserDocument | null> {
    return this.model.findOne({ refreshToken }).select('+refreshToken').exec();
  }

  /**
   * Update the stored refresh token for a user.
   */
  async updateRefreshToken(
    userId: string,
    refreshToken: string | null
  ): Promise<IUserDocument | null> {
    return this.update(userId, { refreshToken });
  }
}

export const userRepository = new UserRepository();
