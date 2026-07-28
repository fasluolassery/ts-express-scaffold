import AppError from './app-error';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export default UnauthorizedError;
