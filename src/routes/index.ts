import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger.config';
import { APP_ROUTES } from '../constants';
import healthRouter from './health.routes';

const router = Router();

// Serve Swagger Interactive API Documentation
router.use(APP_ROUTES.SWAGGER_DOCS, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Health Check Routes at Root and API Prefix for Cloud Compatibility
router.use(healthRouter);

interface RouteModule {
  path: string;
  route: Router;
}

/**
 * Route Registry Array
 * Add new module routes here (e.g., { path: `${APP_ROUTES.API_PREFIX}/products`, route: productRouter })
 */
const apiRoutes: RouteModule[] = [
  {
    path: APP_ROUTES.API_PREFIX,
    route: healthRouter,
  },
];

apiRoutes.forEach((routeModule) => {
  router.use(routeModule.path, routeModule.route);
});

export default router;
