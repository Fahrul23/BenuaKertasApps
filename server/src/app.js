import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import errorHandler from './middleware/errorHandler.js';

// __dirname equivalent untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==========================================
// Global Middlewares
// ==========================================

// CORS - izinkan request dari client
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Helmet - security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Morgan - HTTP request logger
app.use(morgan('dev'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Static Files - Serve folder uploads
// ==========================================
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ==========================================
// Health Check
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Benua Kertas API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// API Routes (placeholder - akan diisi nanti)
// ==========================================
// import authRoutes from './routes/auth.js';
// import categoryRoutes from './routes/category.js';
// import productRoutes from './routes/product.js';
// import orderRoutes from './routes/order.js';
// import galleryRoutes from './routes/gallery.js';

// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/gallery', galleryRoutes);

// ==========================================
// 404 Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} tidak ditemukan.`,
  });
});

// ==========================================
// Global Error Handler
// ==========================================
app.use(errorHandler);

export default app;
