import swaggerJSDoc from 'swagger-jsdoc';
import config from './index';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API Template',
      version: '1.0.0',
      description: 'Production-ready REST API documentation powered by Swagger / OpenAPI',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: config.server.url,
        description: `${config.server.env.charAt(0).toUpperCase() + config.server.env.slice(1)} Server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Authorization header carrying Bearer JWT access token',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' },
            errors: {
              type: 'object',
              additionalProperties: { type: 'string' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/app.ts', './src/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
