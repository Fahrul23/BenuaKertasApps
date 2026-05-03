import 'dotenv/config';
import app from './src/app.js';
import prisma from './src/config/prisma.js';

const PORT = process.env.PORT || 5000;

/**
 * Start server & test database connection
 */
const startServer = async () => {
  try {
    // Test koneksi database via Prisma
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
