
import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').or(z.literal('')).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
})

// Register Schema
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscore')
    .toLowerCase(),

  email: z
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Login Schema
export const loginSchema = z.object({
  email: z
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(1, 'Password is required'),
})

// Alternatif: Login dengan username atau email
export const loginWithUsernameSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or username is required'),

  password: z
    .string()
    .min(1, 'Password is required'),
})

// Type inference untuk TypeScript
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type LoginWithUsernameInput = z.infer<typeof loginWithUsernameSchema>

// Optional: Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .email('Invalid email address')
    .toLowerCase(),
})

// Optional: Reset Password Schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
