import * as authService from '../services/auth.service.js';
import prisma from '../config/prisma.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Silakan login.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body);
    // Selalu return sukses untuk mencegah user enumeration attack
    res.status(200).json({
      success: true,
      message: 'Jika email terdaftar, link reset telah dikirim.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token reset password diperlukan.',
      });
    }

    await authService.resetPassword({ token, password: req.body.password });
    
    res.status(200).json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = new Error('User tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
