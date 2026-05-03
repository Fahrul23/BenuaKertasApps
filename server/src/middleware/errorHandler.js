/**
 * Global Error Handler Middleware
 * Tangkap semua error dan format response secara konsisten
 */
const errorHandler = (err, req, res, _next) => {
  // Default status code
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server.';

  // Handle Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Data sudah ada. Duplikasi pada field unik.';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Data tidak ditemukan.';
  }

  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'Ukuran file terlalu besar. Maksimal 5MB.';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Field upload file tidak sesuai.';
  }

  // Log error di development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
