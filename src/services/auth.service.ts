import { RegisterSchemaType, LoginSchemaType } from '../validators';
import { IUserDocument } from '../models/user.model';
import { userRepository } from '../repositories';
import { ConflictError, UnauthorizedError, NotFoundError } from '../errors';
import { ERROR_MESSAGES } from '../constants';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: IUserDocument;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Registers a new user, generates access & refresh tokens, and saves session in DB.
   */
  public async register(registerData: RegisterSchemaType): Promise<AuthResponse> {
    const { email } = registerData;

    // Check if user already exists using the repository
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Create user using repository
    const user = await userRepository.create(registerData);

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Store refresh token in DB
    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticates user credentials, generates fresh access & refresh tokens.
   */
  public async login(loginData: LoginSchemaType): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user by email including password field
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate dual tokens
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token to user session in DB
    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refreshes access token and rotates refresh token using a valid HTTP-only refresh token.
   */
  public async refreshTokens(tokenInput: string): Promise<AuthResponse> {
    if (!tokenInput) {
      throw new UnauthorizedError(ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(tokenInput);
    } catch {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    // Verify user exists and stored refresh token matches (prevents token reuse attacks)
    const user = await userRepository.findByRefreshToken(tokenInput);
    if (!user || user._id.toString() !== payload.sub) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    // Rotate tokens
    const newAccessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // Update stored refresh token
    await userRepository.updateRefreshToken(user._id.toString(), newRefreshToken);

    return {
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logs out user by revoking their stored refresh token in DB.
   */
  public async logout(userId: string): Promise<void> {
    await userRepository.updateRefreshToken(userId, null);
  }

  /**
   * Retrieves user profile by ID.
   */
  public async getUserProfile(userId: string): Promise<IUserDocument> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }
}

export const authService = new AuthService();
export default authService;
