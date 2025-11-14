import { FastifyInstance } from 'fastify';
import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

export default async function userRoutes(fastify: FastifyInstance) {
  // Get all users (with optional pagination)
  fastify.get('/', { onRequest: [authenticate, authorize(Role.ADMIN, Role.MANAGER)] }, async (request, reply) => {
    try {
      const users = await prisma.appUser.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          isActive: true,
          departmentId: true,
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return reply.send(successResponse(users));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch users', error.message)
      );
    }
  });

  // Get paginated users
  fastify.get('/paged', { onRequest: [authenticate, authorize(Role.ADMIN, Role.MANAGER)] }, async (request, reply) => {
    try {
      const { page = 1, limit = 10, search = '', role, departmentId, isActive } = request.query as any;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where: any = { deletedAt: null };

      if (search) {
        where.OR = [
          { username: { contains: search } },
          { email: { contains: search } },
          { firstName: { contains: search } },
          { lastName: { contains: search } },
        ];
      }

      if (role) {
        where.role = role;
      }

      if (departmentId) {
        where.departmentId = parseInt(departmentId);
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [users, total] = await Promise.all([
        prisma.appUser.findMany({
          where,
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            isActive: true,
            departmentId: true,
            department: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.appUser.count({ where }),
      ]);

      return reply.send(paginatedResponse(users, parseInt(page), parseInt(limit), total));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch users', error.message)
      );
    }
  });

  // Get user by ID
  fastify.get('/:id', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params as any;

      const user = await prisma.appUser.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          avatar: true,
          isActive: true,
          departmentId: true,
          department: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true,
            },
          },
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return reply.code(404).send(errorResponse('USER_NOT_FOUND', 'User not found'));
      }

      return reply.send(successResponse(user));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('FETCH_FAILED', 'Failed to fetch user', error.message)
      );
    }
  });

  // Create user
  fastify.post('/', { onRequest: [authenticate, authorize(Role.ADMIN)] }, async (request, reply) => {
    try {
      const { username, password, email, phoneNumber, firstName, lastName, role, departmentId, isActive } = request.body as any;

      // Check if user exists
      const existingUser = await prisma.appUser.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return reply.code(400).send(
          errorResponse('USER_EXISTS', 'Username or email already exists')
        );
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.appUser.create({
        data: {
          username,
          password: hashedPassword,
          email,
          phoneNumber,
          firstName,
          lastName,
          role: role || Role.USER,
          departmentId: departmentId ? parseInt(departmentId) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          isActive: true,
          departmentId: true,
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

      return reply.code(201).send(successResponse(user, 'User created successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('CREATE_FAILED', 'Failed to create user', error.message)
      );
    }
  });

  // Update user
  fastify.put('/:id', { onRequest: [authenticate, authorize(Role.ADMIN)] }, async (request, reply) => {
    try {
      const { id } = request.params as any;
      const { email, phoneNumber, firstName, lastName, role, departmentId, isActive, password } = request.body as any;

      const existingUser = await prisma.appUser.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!existingUser) {
        return reply.code(404).send(errorResponse('USER_NOT_FOUND', 'User not found'));
      }

      const updateData: any = {
        email,
        phoneNumber,
        firstName,
        lastName,
        role,
        departmentId: departmentId ? parseInt(departmentId) : null,
        isActive,
      };

      if (password) {
        updateData.password = await hashPassword(password);
      }

      const updatedUser = await prisma.appUser.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          isActive: true,
          departmentId: true,
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

      return reply.send(successResponse(updatedUser, 'User updated successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('UPDATE_FAILED', 'Failed to update user', error.message)
      );
    }
  });

  // Delete user (soft delete)
  fastify.delete('/:id', { onRequest: [authenticate, authorize(Role.ADMIN)] }, async (request, reply) => {
    try {
      const { id } = request.params as any;

      const existingUser = await prisma.appUser.findFirst({
        where: {
          id: parseInt(id),
          deletedAt: null,
        },
      });

      if (!existingUser) {
        return reply.code(404).send(errorResponse('USER_NOT_FOUND', 'User not found'));
      }

      await prisma.appUser.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });

      return reply.send(successResponse(null, 'User deleted successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('DELETE_FAILED', 'Failed to delete user', error.message)
      );
    }
  });
}
