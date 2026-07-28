export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    errors?: Record<string, string>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (errors) {
      this.errors = errors;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
