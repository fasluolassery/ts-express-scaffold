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
}

export const userRepository = new UserRepository();
