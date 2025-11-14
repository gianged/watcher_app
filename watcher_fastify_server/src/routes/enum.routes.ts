import { FastifyInstance } from 'fastify';
import { successResponse } from '../utils/response';
import { Role, TicketStatus, TicketPriority } from '@prisma/client';

export default async function enumRoutes(fastify: FastifyInstance) {
  // Load all enums
  fastify.get('/load', async (request, reply) => {
    try {
      const enums = {
        roles: Object.values(Role),
        ticketStatuses: Object.values(TicketStatus),
        ticketPriorities: Object.values(TicketPriority),
      };

      return reply.send(successResponse(enums));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'FETCH_FAILED',
        message: 'Failed to load enums',
      });
    }
  });

  // Get roles
  fastify.get('/roles', async (request, reply) => {
    return reply.send(successResponse(Object.values(Role)));
  });

  // Get ticket statuses
  fastify.get('/ticket-statuses', async (request, reply) => {
    return reply.send(successResponse(Object.values(TicketStatus)));
  });

  // Get ticket priorities
  fastify.get('/ticket-priorities', async (request, reply) => {
    return reply.send(successResponse(Object.values(TicketPriority)));
  });
}
