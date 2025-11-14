import { FastifyInstance } from 'fastify';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { successResponse, errorResponse } from '../utils/response';
import { authenticate } from '../middleware/auth.middleware';

export default async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request, reply) => {
    try {
      const { username, password, email, phoneNumber, firstName, lastName, departmentId } = request.body as any;

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
          departmentId: departmentId ? parseInt(departmentId) : null,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          departmentId: true,
          createdAt: true,
        },
      });

      return reply.code(201).send(successResponse(user, 'User registered successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('REGISTRATION_FAILED', 'Failed to register user', error.message)
      );
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const { username, password } = request.body as any;

      // Find user
      const user = await prisma.appUser.findFirst({
        where: {
          username,
          isActive: true,
          deletedAt: null,
        },
        include: {
          department: true,
        },
      });

      if (!user) {
        return reply.code(401).send(
          errorResponse('INVALID_CREDENTIALS', 'Invalid username or password')
        );
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return reply.code(401).send(
          errorResponse('INVALID_CREDENTIALS', 'Invalid username or password')
        );
      }

      // Update last login
      await prisma.appUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      // Generate refresh token
      const refreshToken = fastify.jwt.sign(
        { id: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      return reply.send(
        successResponse({
          user: userWithoutPassword,
          token,
          refreshToken,
        }, 'Login successful')
      );
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('LOGIN_FAILED', 'Failed to login', error.message)
      );
    }
  });

  // Logout
  fastify.post('/logout', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const { refreshToken } = request.body as any;

      if (refreshToken) {
        await prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }

      return reply.send(successResponse(null, 'Logout successful'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('LOGOUT_FAILED', 'Failed to logout', error.message)
      );
    }
  });

  // Update profile
  fastify.put('/update', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const userId = request.user!.id;
      const { email, phoneNumber, firstName, lastName, currentPassword, newPassword } = request.body as any;

      const user = await prisma.appUser.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return reply.code(404).send(errorResponse('USER_NOT_FOUND', 'User not found'));
      }

      const updateData: any = {
        email,
        phoneNumber,
        firstName,
        lastName,
      };

      // If changing password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return reply.code(400).send(
            errorResponse('CURRENT_PASSWORD_REQUIRED', 'Current password is required')
          );
        }

        const isPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isPasswordValid) {
          return reply.code(401).send(
            errorResponse('INVALID_PASSWORD', 'Current password is incorrect')
          );
        }

        updateData.password = await hashPassword(newPassword);
      }

      const updatedUser = await prisma.appUser.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          avatar: true,
          departmentId: true,
          updatedAt: true,
        },
      });

      return reply.send(successResponse(updatedUser, 'Profile updated successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('UPDATE_FAILED', 'Failed to update profile', error.message)
      );
    }
  });

  // Check username availability
  fastify.get('/check-username', async (request, reply) => {
    try {
      const { username } = request.query as any;

      const user = await prisma.appUser.findUnique({
        where: { username },
      });

      return reply.send(successResponse({ available: !user }));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('CHECK_FAILED', 'Failed to check username', error.message)
      );
    }
  });

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    try {
      const { refreshToken } = request.body as any;

      if (!refreshToken) {
        return reply.code(400).send(
          errorResponse('REFRESH_TOKEN_REQUIRED', 'Refresh token is required')
        );
      }

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        return reply.code(401).send(
          errorResponse('INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token')
        );
      }

      // Generate new access token
      const token = fastify.jwt.sign({
        id: storedToken.user.id,
        username: storedToken.user.username,
        email: storedToken.user.email,
        role: storedToken.user.role,
      });

      return reply.send(successResponse({ token }, 'Token refreshed successfully'));
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send(
        errorResponse('REFRESH_FAILED', 'Failed to refresh token', error.message)
      );
    }
  });

  // Get current user
  fastify.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const userId = request.user!.id;

      const user = await prisma.appUser.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          avatar: true,
          departmentId: true,
          department: true,
          lastLoginAt: true,
          createdAt: true,
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
}
