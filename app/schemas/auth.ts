import { z } from 'zod';

/** Login form schema. Reuse on server for API validation if needed (ARCHITECT_CONTEXT: type-safe contract). */
export const loginSchema = z.object({
  email: z.string().email('ที่อยู่อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน').min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Register (sign up) form schema. */
export const registerSchema = z
  .object({
    email: z.string().email('ที่อยู่อีเมลไม่ถูกต้อง'),
    password: z.string().min(1, 'กรุณากรอกรหัสผ่าน').min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่าน'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
