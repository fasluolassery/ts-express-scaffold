import AppError from './app-error';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class ConflictError extends AppError {
  constructor(message: string = ERROR_MESSAGES.CONFLICT) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export default ConflictError;
