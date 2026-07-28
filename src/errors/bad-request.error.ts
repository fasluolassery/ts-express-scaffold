import AppError from './app-error';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class BadRequestError extends AppError {
  constructor(message: string = ERROR_MESSAGES.BAD_REQUEST, errors?: Record<string, string>) {
    super(message, HTTP_STATUS.BAD_REQUEST, true, errors);
  }
}

export default BadRequestError;
