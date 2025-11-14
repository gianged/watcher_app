import { FastifyInstance } from 'fastify';
import { prisma } from '../config/database';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

export default async function announceRoutes(fastify: FastifyInstance) {
  // Get all announcements
  fastify.get('/', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const now = new Date();

      const announcements = await prisma.announce.findMany({
        where: {
          deletedAt: null,
          isActive: true,
          publishDate: { lte: now },
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: now } },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          publishDate: true,
          expiryDate: true,
          isPinned: true,
          isActive: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          { isPinned: 'desc' },
          { publishDate: 'desc' },
        ],
      });

      return reply.send(successResponse(announcements));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch announcements', error.message)
      );
    }
  });

  // Get paginated announcements
  fastify.get('/paged', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { page = 1, limit = 10, search = '', isActive, isPinned } = request.query as any;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where: any = { deletedAt: null };

      if (search) {
        where.OR = [
          { title: { contains: search } },
          { content: { contains: search } },
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      if (isPinned !== undefined) {
        where.isPinned = isPinned === 'true';
      }

      const [announcements, total] = await Promise.all([
        prisma.announce.findMany({
          where,
          select: {
            id: true,
            title: true,
            content: true,
            publishDate: true,
            expiryDate: true,
            isPinned: true,
            isActive: true,
            createdBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take,
          orderBy: [
            { isPinned: 'desc' },
            { publishDate: 'desc' },
          ],
        }),
        prisma.announce.count({ where }),
      ]);

      return reply.send(paginatedResponse(announcements, parseInt(page), parseInt(limit), total));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch announcements', error.message)
      );
    }
  });

  // Get announcement by ID
  fastify.get('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as any;

      const announcement = await prisma.announce.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          content: true,
          publishDate: true,
          expiryDate: true,
          isPinned: true,
          isActive: true,
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
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!announcement) {
        return reply.code(404).send(errorResponse('ANNOUNCEMENT_NOT_FOUND', 'Announcement not found'));
      }

      return reply.send(successResponse(announcement));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch announcement', error.message)
      );
    }
  });

  // Create announcement
  fastify.post('/', { onRequest: [authenticate, authorize(Role.ADMIN, Role.MANAGER)] }, async (request, reply) => {
    try {
      const userId = request.user!.id;
      const { title, content, publishDate, expiryDate, isPinned, isActive } = request.body as any;

      const announcement = await prisma.announce.create({
        data: {
          title,
          content,
          publishDate: new Date(publishDate || Date.now()),
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          isPinned: isPinned || false,
          isActive: isActive !== undefined ? isActive : true,
          createdById: userId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          publishDate: true,
          expiryDate: true,
          isPinned: true,
          isActive: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          createdAt: true,
        },
      });

      return reply.code(201).send(successResponse(announcement, 'Announcement created successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('CREATE_FAILED', 'Failed to create announcement', error.message)
      );
    }
  });

  // Update announcement
  fastify.put('/:id', { onRequest: [authenticate, authorize(Role.ADMIN, Role.MANAGER)] }, async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { title, content, publishDate, expiryDate, isPinned, isActive } = request.body as any;

      const existingAnnounce = await prisma.announce.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!existingAnnounce) {
        return reply.code(404).send(errorResponse('ANNOUNCEMENT_NOT_FOUND', 'Announcement not found'));
      }

      const updatedAnnouncement = await prisma.announce.update({
        where: { id: parseInt(id) },
        data: {
          title,
          content,
          publishDate: publishDate ? new Date(publishDate) : undefined,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          isPinned,
          isActive,
        },
        select: {
          id: true,
          title: true,
          content: true,
          publishDate: true,
          expiryDate: true,
          isPinned: true,
          isActive: true,
          updatedAt: true,
        },
      });

      return reply.send(successResponse(updatedAnnouncement, 'Announcement updated successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('UPDATE_FAILED', 'Failed to update announcement', error.message)
      );
    }
  });

  // Delete announcement (soft delete)
  fastify.delete('/:id', { onRequest: [authenticate, authorize(Role.ADMIN, Role.MANAGER)] }, async (request, reply) => {
    try {
      const { id } = request.params as any;

      const existingAnnounce = await prisma.announce.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!existingAnnounce) {
        return reply.code(404).send(errorResponse('ANNOUNCEMENT_NOT_FOUND', 'Announcement not found'));
      }

      await prisma.announce.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });

      return reply.send(successResponse(null, 'Announcement deleted successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('DELETE_FAILED', 'Failed to delete announcement', error.message)
      );
    }
  });
}
