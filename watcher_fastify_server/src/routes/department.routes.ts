import { FastifyInstance } from 'fastify';
import { prisma } from '../config/database';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

export default async function departmentRoutes(fastify: FastifyInstance) {
  // Get all departments
  fastify.get('/', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const departments = await prisma.department.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          managerId: true,
          isActive: true,
          _count: {
            select: {
              users: true,
              tickets: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: 'asc' },
      });

      return reply.send(successResponse(departments));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch departments', error.message)
      );
    }
  });

  // Get paginated departments
  fastify.get('/paged', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { page = 1, limit = 10, search = '', isActive } = request.query as any;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where: any = { deletedAt: null };

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { code: { contains: search } },
          { description: { contains: search } },
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [departments, total] = await Promise.all([
        prisma.department.findMany({
          where,
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            managerId: true,
            isActive: true,
            _count: {
              select: {
                users: true,
                tickets: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take,
          orderBy: { name: 'asc' },
        }),
        prisma.department.count({ where }),
      ]);

      return reply.send(paginatedResponse(departments, parseInt(page), parseInt(limit), total));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch departments', error.message)
      );
    }
  });

  // Get department by ID
  fastify.get('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as any;

      const department = await prisma.department.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          managerId: true,
          isActive: true,
          users: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          _count: {
            select: {
              tickets: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!department) {
        return reply.code(404).send(errorResponse('DEPARTMENT_NOT_FOUND', 'Department not found'));
      }

      return reply.send(successResponse(department));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch department', error.message)
      );
    }
  });

  // Create department
  fastify.post('/', { onRequest: [authenticate, authorize(Role.ADMIN, Role.MANAGER)] }, async (request, reply) => {
    try {
      const { name, code, description, managerId, isActive } = request.body as any;

      // Check if department exists
      const existingDept = await prisma.department.findFirst({
        where: {
          OR: [{ name }, ...(code ? [{ code }] : [])],
          deletedAt: null,
        },
      });

      if (existingDept) {
        return reply.code(400).send(
          errorResponse('DEPARTMENT_EXISTS', 'Department with this name or code already exists')
        );
      }

      const department = await prisma.department.create({
        data: {
          name,
          code,
          description,
          managerId: managerId ? parseInt(managerId) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          managerId: true,
          isActive: true,
          createdAt: true,
        },
      });

      return reply.code(201).send(successResponse(department, 'Department created successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('CREATE_FAILED', 'Failed to create department', error.message)
      );
    }
  });

  // Update department
  fastify.put('/:id', { onRequest: [authenticate, authorize(Role.ADMIN, Role.MANAGER)] }, async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { name, code, description, managerId, isActive } = request.body as any;

      const existingDept = await prisma.department.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!existingDept) {
        return reply.code(404).send(errorResponse('DEPARTMENT_NOT_FOUND', 'Department not found'));
      }

      const updatedDepartment = await prisma.department.update({
        where: { id: parseInt(id) },
        data: {
          name,
          code,
          description,
          managerId: managerId ? parseInt(managerId) : null,
          isActive,
        },
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          managerId: true,
          isActive: true,
          updatedAt: true,
        },
      });

      return reply.send(successResponse(updatedDepartment, 'Department updated successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('UPDATE_FAILED', 'Failed to update department', error.message)
      );
    }
  });

  // Delete department (soft delete)
  fastify.delete('/:id', { onRequest: [authenticate, authorize(Role.ADMIN)] }, async (request, reply) => {
    try {
      const { id } = request.params as any;

      const existingDept = await prisma.department.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!existingDept) {
        return reply.code(404).send(errorResponse('DEPARTMENT_NOT_FOUND', 'Department not found'));
      }

      await prisma.department.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });

      return reply.send(successResponse(null, 'Department deleted successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('DELETE_FAILED', 'Failed to delete department', error.message)
      );
    }
  });
}
