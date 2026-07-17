export const VALIDATION_MESSAGES = {
  MONGO_URI_REQUIRED: 'MONGO_URI is required to connect to the database',
  JWT_SECRET_REQUIRED: 'JWT_SECRET is required to sign tokens',
  NAME_REQUIRED: 'Name is required',
  NAME_MIN: 'Name must be at least 2 characters',
  NAME_MAX: 'Name cannot exceed 50 characters',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN: 'Password must be at least 6 characters',
  PASSWORD_MAX: 'Password cannot exceed 128 characters',
  ROLE_INVALID: 'Role must be either customer or worker',
} as const;
