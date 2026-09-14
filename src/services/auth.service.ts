import {
  UserRepository,
  userRepository as defaultUserRepository,
} from '../repositories/user.repository';
import { RegisterBodyType, LoginBodyType } from '../validators';
import { AuthResponseDto, AuthTokensDto, UserResponseDto } from '../dtos';
import { toUserResponseDto } from '../mappers';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils';
import { ConflictError, UnauthorizedError, ForbiddenError, NotFoundError } from '../errors';
import { AUTH_MESSAGES } from '../constants';

export class AuthService {
  private userRepository: UserRepository;

  constructor(repository?: UserRepository) {
    this.userRepository = repository ?? defaultUserRepository;
  }

  /**
   * Registers a new user account.
   */
  async register(input: RegisterBodyType): Promise<AuthResponseDto> {
    const { name, email, password } = input;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const newUser = await this.userRepository.create({
      name,
      email,
      passwordHash: password, // Pre-save hook hashes this
    });

    const accessToken = generateAccessToken(newUser.id, newUser.role);
    const refreshToken = generateRefreshToken(newUser.id);

    return {
      user: toUserResponseDto(newUser),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Authenticates user credentials and issues access & refresh tokens.
   */
  async login(input: LoginBodyType): Promise<AuthResponseDto> {
    const { email, password } = input;

    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new ForbiddenError(AUTH_MESSAGES.USER_INACTIVE);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: toUserResponseDto(user),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Rotates access and refresh tokens using a valid refresh token.
   * Centralized error-normalizer automatically handles expired/invalid JWT errors.
   */
  async refreshToken(rawToken: string): Promise<AuthTokensDto> {
    const decoded = verifyRefreshToken(rawToken);
    const user = await this.userRepository.findById(decoded.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Retrieves profile for the authenticated user.
   */
  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    return toUserResponseDto(user);
  }
}

export const authService = new AuthService();
