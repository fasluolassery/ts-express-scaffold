export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REFRESH_SUCCESS: 'Token refreshed successfully',
  PROFILE_FETCH_SUCCESS: 'User profile fetched successfully',
  EMAIL_ALREADY_EXISTS: 'A user with this email address already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_INACTIVE: 'This account has been deactivated',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
} as const;
