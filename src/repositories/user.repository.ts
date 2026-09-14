import { BaseRepository } from './base.repository';
import { IUser, UserModel } from '../models';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return this.model.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash').exec();
  }
}

export const userRepository = new UserRepository();
