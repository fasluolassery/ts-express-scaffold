import { Request, Response } from 'express';
import { sendSuccess, setAuthCookies, clearAuthCookies } from '../utils';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../constants';
import { UserMapper } from '../mappers';
import { authService } from '../services';
import asyncHandler from '../middlewares/async.middleware';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

/**
 * Registers a new customer or worker in the system and auto-authenticates.
 */
export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);

  // Set HTTP-only Cookies for secure dual-token authentication
  setAuthCookies(res, accessToken, refreshToken);

  const userResponse = UserMapper.toResponseDto(user);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.CREATED,
    message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
    data: {
      user: userResponse,
    },
  });
});

/**
 * Authenticates user credentials and sets fresh auth cookies.
 */
export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  setAuthCookies(res, accessToken, refreshToken);

  const userResponse = UserMapper.toResponseDto(user);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    data: {
      user: userResponse,
    },
  });
});

/**
 * Refreshes short-lived access token and rotates long-lived refresh token.
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const tokenInput = req.cookies?.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshTokens(tokenInput);

  setAuthCookies(res, accessToken, newRefreshToken);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: SUCCESS_MESSAGES.REFRESH_SUCCESS,
  });
});

/**
 * Revokes current user refresh token and clears auth cookies.
 */
export const logoutUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (req.user?.id) {
      await authService.logout(req.user.id);
    }

    clearAuthCookies(res);

    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    });
  }
);

/**
 * Retrieves authenticated user profile.
 */
export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await authService.getUserProfile(req.user!.id);
    const userResponse = UserMapper.toResponseDto(user);

    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: SUCCESS_MESSAGES.GET_PROFILE_SUCCESS,
      data: {
        user: userResponse,
      },
    });
  }
);
