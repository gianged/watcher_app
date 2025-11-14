import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';
import { prisma } from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import departmentRoutes from './routes/department.routes';
import ticketRoutes from './routes/ticket.routes';
import announceRoutes from './routes/announce.routes';
import enumRoutes from './routes/enum.routes';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '8081', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Register plugins
async function start() {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    });

    // Register Cookie support
    await fastify.register(cookie);

    // Register JWT
    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      cookie: {
        cookieName: 'token',
        signed: false,
      },
    });

    // Register multipart for file uploads
    await fastify.register(multipart);

    // Register Swagger
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'Watcher API',
          description: 'API documentation for Watcher application',
          version: '2.0.0',
        },
        servers: [
          {
            url: `http://localhost:${PORT}`,
            description: 'Development server',
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
      },
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/swagger',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
    });

    // Register routes with /watcher prefix
    await fastify.register(authRoutes, { prefix: '/watcher/auth' });
    await fastify.register(userRoutes, { prefix: '/watcher/manage/users' });
    await fastify.register(departmentRoutes, { prefix: '/watcher/manage/departments' });
    await fastify.register(ticketRoutes, { prefix: '/watcher/manage/tickets' });
    await fastify.register(announceRoutes, { prefix: '/watcher/manage/announces' });
    await fastify.register(enumRoutes, { prefix: '/watcher/enums' });

    // Health check endpoint
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Start server
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
    console.log(`📚 Swagger documentation available at http://${HOST}:${PORT}/swagger`);
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

start();
