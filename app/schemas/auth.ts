import { z } from 'zod';

/** Login form schema. Reuse on server for API validation if needed (ARCHITECT_CONTEXT: type-safe contract). */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
