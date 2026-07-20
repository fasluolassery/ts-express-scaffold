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
        url: config.server.url,
        description: `${config.server.env.charAt(0).toUpperCase() + config.server.env.slice(1)} Server`,
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'HTTP-only cookie containing the JWT access token',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Authorization header carrying Bearer JWT access token',
        },
      },
      schemas: {
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64a0f4439c2d1b70c382a8bf' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            role: { type: 'string', enum: ['customer', 'worker'], example: 'customer' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2026-07-20T10:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-07-20T10:00:00.000Z' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Invalid email or password' },
            errors: {
              type: 'object',
              additionalProperties: { type: 'string' },
              example: { email: 'Please enter a valid email address' },
            },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app.ts', './src/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
