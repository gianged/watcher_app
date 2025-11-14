import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  departmentId: z.number().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const profileUpdateSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword) {
      return data.currentPassword && data.newPassword === data.confirmPassword;
    }
    return true;
  },
  {
    message: 'Passwords are required and must match',
    path: ['confirmPassword'],
  }
);

// User management schemas
export const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']),
  departmentId: z.number().optional(),
  isActive: z.boolean().default(true),
});

// Department schema
export const departmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().optional(),
  description: z.string().optional(),
  managerId: z.number().optional(),
  isActive: z.boolean().default(true),
});

// Ticket schema
export const ticketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  departmentId: z.number().optional(),
  assignedToId: z.number().optional(),
  dueDate: z.string().optional(),
});

// Announcement schema
export const announceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  publishDate: z.string().optional(),
  expiryDate: z.string().optional(),
  isPinned: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// Comment schema
export const commentSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty'),
  isInternal: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type AnnounceInput = z.infer<typeof announceSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
