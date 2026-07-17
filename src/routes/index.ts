import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger.config';
import { APP_ROUTES } from '../constants';
import healthRouter from './health.routes';
import authRouter from './auth.routes';

const router = Router();

// Swagger API Documentation
router.use(APP_ROUTES.SWAGGER_DOCS, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Health Check Routes
router.use(APP_ROUTES.API_PREFIX, healthRouter);

// Mount Auth Routes
router.use(APP_ROUTES.API_PREFIX, authRouter);

export default router;
