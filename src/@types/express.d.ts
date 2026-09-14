import 'express';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
