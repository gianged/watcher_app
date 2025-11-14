import { FastifyInstance } from 'fastify';
import { prisma } from '../config/database';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { authenticate } from '../middleware/auth.middleware';
import { generateTicketNumber } from '../utils/ticket-number';

export default async function ticketRoutes(fastify: FastifyInstance) {
  // Get all tickets
  fastify.get('/', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const tickets = await prisma.ticket.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          _count: {
            select: {
              comments: true,
              attachments: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return reply.send(successResponse(tickets));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch tickets', error.message)
      );
    }
  });

  // Get paginated tickets
  fastify.get('/paged', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { page = 1, limit = 10, search = '', status, priority, departmentId, assignedToId } = request.query as any;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where: any = { deletedAt: null };

      if (search) {
        where.OR = [
          { ticketNumber: { contains: search } },
          { title: { contains: search } },
          { description: { contains: search } },
        ];
      }

      if (status) {
        where.status = status;
      }

      if (priority) {
        where.priority = priority;
      }

      if (departmentId) {
        where.departmentId = parseInt(departmentId);
      }

      if (assignedToId) {
        where.assignedToId = parseInt(assignedToId);
      }

      const [tickets, total] = await Promise.all([
        prisma.ticket.findMany({
          where,
          select: {
            id: true,
            ticketNumber: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdBy: {
              select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            assignedTo: {
              select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            _count: {
              select: {
                comments: true,
                attachments: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.ticket.count({ where }),
      ]);

      return reply.send(paginatedResponse(tickets, parseInt(page), parseInt(limit), total));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch tickets', error.message)
      );
    }
  });

  // Get ticket by ID
  fastify.get('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as any;

      const ticket = await prisma.ticket.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          resolvedAt: true,
          closedAt: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true,
            },
          },
          comments: {
            select: {
              id: true,
              comment: true,
              isInternal: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          attachments: {
            select: {
              id: true,
              fileName: true,
              fileUrl: true,
              fileSize: true,
              mimeType: true,
              createdAt: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!ticket) {
        return reply.code(404).send(errorResponse('TICKET_NOT_FOUND', 'Ticket not found'));
      }

      return reply.send(successResponse(ticket));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch ticket', error.message)
      );
    }
  });

  // Create ticket
  fastify.post('/', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const userId = request.user!.id;
      const { title, description, priority, departmentId, assignedToId, dueDate } = request.body as any;

      const ticketNumber = generateTicketNumber();

      const ticket = await prisma.ticket.create({
        data: {
          ticketNumber,
          title,
          description,
          priority: priority || 'MEDIUM',
          createdById: userId,
          assignedToId: assignedToId ? parseInt(assignedToId) : null,
          departmentId: departmentId ? parseInt(departmentId) : null,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          createdAt: true,
        },
      });

      return reply.code(201).send(successResponse(ticket, 'Ticket created successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('CREATE_FAILED', 'Failed to create ticket', error.message)
      );
    }
  });

  // Update ticket
  fastify.put('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { title, description, status, priority, assignedToId, departmentId, dueDate } = request.body as any;

      const existingTicket = await prisma.ticket.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!existingTicket) {
        return reply.code(404).send(errorResponse('TICKET_NOT_FOUND', 'Ticket not found'));
      }

      const updateData: any = {
        title,
        description,
        status,
        priority,
        assignedToId: assignedToId ? parseInt(assignedToId) : null,
        departmentId: departmentId ? parseInt(departmentId) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      };

      // Update resolved/closed timestamps
      if (status === 'RESOLVED' && !existingTicket.resolvedAt) {
        updateData.resolvedAt = new Date();
      }
      if (status === 'CLOSED' && !existingTicket.closedAt) {
        updateData.closedAt = new Date();
      }

      const updatedTicket = await prisma.ticket.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          assignedTo: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          updatedAt: true,
        },
      });

      return reply.send(successResponse(updatedTicket, 'Ticket updated successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('UPDATE_FAILED', 'Failed to update ticket', error.message)
      );
    }
  });

  // Delete ticket (soft delete)
  fastify.delete('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as any;

      const existingTicket = await prisma.ticket.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!existingTicket) {
        return reply.code(404).send(errorResponse('TICKET_NOT_FOUND', 'Ticket not found'));
      }

      await prisma.ticket.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });

      return reply.send(successResponse(null, 'Ticket deleted successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('DELETE_FAILED', 'Failed to delete ticket', error.message)
      );
    }
  });

  // Add comment to ticket
  fastify.post('/:id/comments', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as any;
      const userId = request.user!.id;
      const { comment, isInternal } = request.body as any;

      const ticket = await prisma.ticket.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!ticket) {
        return reply.code(404).send(errorResponse('TICKET_NOT_FOUND', 'Ticket not found'));
      }

      const ticketComment = await prisma.ticketComment.create({
        data: {
          ticketId: parseInt(id),
          userId,
          comment,
          isInternal: isInternal || false,
        },
        select: {
          id: true,
          comment: true,
          isInternal: true,
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          createdAt: true,
        },
      });

      return reply.code(201).send(successResponse(ticketComment, 'Comment added successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('CREATE_FAILED', 'Failed to add comment', error.message)
      );
    }
  });
}
