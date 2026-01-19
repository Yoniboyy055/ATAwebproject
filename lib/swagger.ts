/**
 * OpenAPI 3.0 Specification for Amanuel Travel API
 * Generated with Swagger/OpenAPI
 * 
 * Usage:
 * 1. Install: npm install swagger-ui-express swagger-jsdoc
 * 2. Mount endpoint: /api/docs
 * 3. View at: http://localhost:3000/api/docs
 */

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Amanuel Travel API',
    version: '2.0.0',
    description: 'RESTful API for Amanuel Travel booking and management system',
    contact: {
      name: 'Amanuel Travel Support',
      email: 'support@amanueltravel.com',
      url: 'https://amanueltravel.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://amanueltravel.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
    schemas: {
      Booking: {
        type: 'object',
        required: [
          'tripType',
          'passengers',
          'fromCity',
          'toCity',
          'departDate',
          'fullName',
          'phone',
          'contactMethod',
        ],
        properties: {
          tripType: {
            type: 'string',
            enum: ['one-way', 'round-trip'],
          },
          passengers: {
            type: 'integer',
            minimum: 1,
            maximum: 9,
          },
          passengerNames: {
            type: 'array',
            items: { type: 'string' },
          },
          fromCity: { type: 'string' },
          toCity: { type: 'string' },
          departDate: {
            type: 'string',
            format: 'date-time',
          },
          returnDate: {
            type: 'string',
            format: 'date-time',
          },
          fullName: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          contactMethod: {
            type: 'string',
            enum: ['whatsapp', 'phone', 'email'],
          },
        },
      },
      Review: {
        type: 'object',
        required: ['rating', 'title', 'comment', 'visitorName', 'visitorEmail'],
        properties: {
          packageId: {
            type: 'string',
            format: 'uuid',
          },
          destinationId: {
            type: 'string',
            format: 'uuid',
          },
          rating: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
          },
          title: {
            type: 'string',
            minLength: 3,
            maxLength: 100,
          },
          comment: {
            type: 'string',
            minLength: 10,
            maxLength: 2000,
          },
          visitorName: { type: 'string' },
          visitorEmail: {
            type: 'string',
            format: 'email',
          },
        },
      },
      Error: {
        type: 'object',
        required: ['ok', 'error'],
        properties: {
          ok: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
          },
          details: {
            type: 'object',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Success: {
        type: 'object',
        required: ['ok', 'data'],
        properties: {
          ok: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'Server is healthy',
          },
          '503': {
            description: 'Server is degraded',
          },
        },
      },
    },
    '/api/booking': {
      post: {
        tags: ['Bookings'],
        summary: 'Create a new booking',
        operationId: 'createBooking',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Booking' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Booking created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Success' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '429': {
            description: 'Too many requests',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Create a new review',
        operationId: 'createReview',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Review' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Review created successfully',
          },
          '400': {
            description: 'Validation error',
          },
        },
      },
      get: {
        tags: ['Reviews'],
        summary: 'Get reviews',
        operationId: 'getReviews',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          '200': {
            description: 'List of reviews',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Bookings',
      description: 'Booking management',
    },
    {
      name: 'Reviews',
      description: 'Review management',
    },
  ],
}

/**
 * Setup Swagger UI Express
 * 
 * In app/api/docs/route.ts:
 * 
 * import swaggerUi from 'swagger-ui-express'
 * import { swaggerDefinition } from '@/lib/swagger'
 * 
 * export function GET() {
 *   // Return Swagger UI HTML
 * }
 */
