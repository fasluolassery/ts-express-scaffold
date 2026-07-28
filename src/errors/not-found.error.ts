import AppError from './app-error';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export default NotFoundError;
