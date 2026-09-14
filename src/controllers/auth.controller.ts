import { Request, Response } from 'express';
import { AuthService, authService as defaultAuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/api-response';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.util';
import { HTTP_STATUS, AUTH_MESSAGES } from '../constants';
import { BadRequestError } from '../errors';

export class AuthController {
  private authService: AuthService;

  constructor(service?: AuthService) {
    this.authService = service ?? defaultAuthService;
  }

  /**
   * Registers a new user.
   */
  register = async (req: Request, res: Response): Promise<void> => {
    const { user, tokens } = await this.authService.register(req.body);

    if (tokens.refreshToken) {
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    }

    sendSuccess({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      data: {
        user,
        token: tokens.accessToken,
      },
    });
  };

  /**
   * Authenticates user and sets session cookies.
   */
  login = async (req: Request, res: Response): Promise<void> => {
    const { user, tokens } = await this.authService.login(req.body);

    if (tokens.refreshToken) {
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    }

    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: {
        user,
        token: tokens.accessToken,
      },
    });
  };

  /**
   * Refreshes access token via cookie or request body.
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!rawToken) {
      throw new BadRequestError(AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    const { accessToken, refreshToken } = await this.authService.refreshToken(rawToken);

    if (refreshToken) {
      setAuthCookies(res, accessToken, refreshToken);
    }

    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: AUTH_MESSAGES.REFRESH_SUCCESS,
      data: {
        token: accessToken,
      },
    });
  };

  /**
   * Logs out user by clearing session cookies.
   */
  logout = async (_req: Request, res: Response): Promise<void> => {
    clearAuthCookies(res);

    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  };

  /**
   * Retrieves profile of authenticated user.
   */
  getProfile = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user!;
    const profile = await this.authService.getProfile(id);

    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: AUTH_MESSAGES.PROFILE_FETCH_SUCCESS,
      data: profile,
    });
  };
}

export const authController = new AuthController();
