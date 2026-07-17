import { RegisterSchemaType } from '../validators';
import { IUserDocument } from '../models/user.model';
import { userRepository } from '../repositories';
import { ConflictError } from '../errors';
import { ERROR_MESSAGES } from '../constants';

export class AuthService {
  /**
   * Registers a new user.
   * @param registerData User registration fields
   * @returns The created user document
   */
  public async register(registerData: RegisterSchemaType): Promise<IUserDocument> {
    const { email } = registerData;

    // Check if user already exists using the repository
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Create user using repository
    return userRepository.create(registerData);
  }
}

export const authService = new AuthService();
export default authService;
