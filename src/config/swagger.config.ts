import swaggerJSDoc from 'swagger-jsdoc';
import config from './index';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Service Provider API',
      version: '1.0.0',
      description: 'Service Provider Backend API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@serviceprovider.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app.ts', './src/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
