import { Request, Response } from 'express';
import { sendSuccess, generateToken } from '../utils';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../constants';
import { cookieOptions } from '../config/cookie.config';
import { UserMapper } from '../mappers';
import { authService } from '../services';
import asyncHandler from '../middlewares/async.middleware';

/**
 * Registers a new customer or worker in the system.
 * Hashes password automatically and sets an authentication cookie.
 */
export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Delegate user registration to AuthService
  const user = await authService.register(req.body);

  // Generate JWT token using isolated utility
  const token = generateToken(user._id.toString(), user.role);

  // Set HTTP-only Cookie for secure authentication storage using isolated config
  res.cookie('token', token, cookieOptions);

  // Structure response data safely using UserMapper and UserResponseDto
  const userResponse = UserMapper.toResponseDto(user);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.CREATED,
    message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
    data: {
      user: userResponse,
      token,
    },
  });
});
