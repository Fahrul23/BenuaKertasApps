import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { sendMail } from '../config/mailer.js';

export const registerUser = async ({ 
  name, email, password, 
  phone, province, city, district, postalCode, detailAddress 
}) => {
  // Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Email sudah terdaftar');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Simpan user baru
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      province,
      city,
      district,
      postalCode,
      detailAddress,
    },
  });

  // Hapus password dari response
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUser = async ({ email, password }) => {
  const genericError = new Error('Email atau password salah');
  genericError.statusCode = 401;

  // Cari user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw genericError;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw genericError;
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const forgotPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Jika user tidak ada, return success diam-diam (mencegah enumeration attack)
  if (!user) {
    return true;
  }

  // Generate reset token (32 bytes -> 64 characters hex string)
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Set expired 1 jam dari sekarang
  const resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);

  // Update DB
  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpiry,
    },
  });

  // Kirim email
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a;">Reset Password Anda</h2>
      <p>Halo <strong>${user.name}</strong>,</p>
      <p>Kami menerima permintaan untuk mereset password akun Benua Kertas Anda.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">Link ini hanya berlaku selama 1 jam.</p>
      <p style="color: #64748b; font-size: 14px;">Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini dan password Anda akan tetap aman.</p>
      <hr style="border: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Benua Kertas. All rights reserved.</p>
    </div>
  `;

  await sendMail({
    to: user.email,
    subject: 'Reset Password Akun Benua Kertas',
    html: htmlContent,
  });

  return true;
};

export const resetPassword = async ({ token, password }) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: {
        gt: new Date(), // Pastikan belum expired (expiry > sekarang)
      },
    },
  });

  if (!user) {
    const error = new Error('Token reset password tidak valid atau sudah kadaluarsa');
    error.statusCode = 400;
    throw error;
  }

  // Hash password baru
  const hashedPassword = await bcrypt.hash(password, 12);

  // Update user: ganti password, invalidate token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  return true;
};
