import AppError from './app-error';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

export default ForbiddenError;
