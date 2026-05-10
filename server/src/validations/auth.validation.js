import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus minimal 2 karakter' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .min(8, { message: 'Password harus minimal 8 karakter' })
    .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
    .regex(/[a-z]/, { message: 'Password harus mengandung huruf kecil' })
    .regex(/[0-9]/, { message: 'Password harus mengandung angka' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong' }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password harus minimal 8 karakter' })
    .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
    .regex(/[a-z]/, { message: 'Password harus mengandung huruf kecil' })
    .regex(/[0-9]/, { message: 'Password harus mengandung angka' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});
