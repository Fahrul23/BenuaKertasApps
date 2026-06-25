import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus minimal 2 karakter' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .min(6, { message: 'Password harus minimal 6 karakter' }),
  confirmPassword: z.string(),
  phone: z.union([z.string(), z.number()], { required_error: 'Nomor HP tidak boleh kosong' })
    .transform(String)
    .refine((val) => val.trim().length > 0, { message: 'Nomor HP tidak boleh kosong' }),
  province: z.string({ required_error: 'Provinsi tidak boleh kosong', invalid_type_error: 'Provinsi harus berupa teks' })
    .min(1, { message: 'Provinsi tidak boleh kosong' }),
  city: z.string({ required_error: 'Kota/Kabupaten tidak boleh kosong', invalid_type_error: 'Kota/Kabupaten harus berupa teks' })
    .min(1, { message: 'Kota/Kabupaten tidak boleh kosong' }),
  district: z.string({ required_error: 'Kecamatan tidak boleh kosong', invalid_type_error: 'Kecamatan harus berupa teks' })
    .min(1, { message: 'Kecamatan tidak boleh kosong' }),
  postalCode: z.union([z.string(), z.number()], { required_error: 'Kode pos tidak boleh kosong' })
    .transform(String)
    .refine((val) => val.trim().length > 0, { message: 'Kode pos tidak boleh kosong' }),
  detailAddress: z.string({ required_error: 'Alamat lengkap tidak boleh kosong', invalid_type_error: 'Alamat lengkap harus berupa teks' })
    .min(1, { message: 'Alamat lengkap tidak boleh kosong' }),
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
    .min(6, { message: 'Password harus minimal 6 karakter' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});
