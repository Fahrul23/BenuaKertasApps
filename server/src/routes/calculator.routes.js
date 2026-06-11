import express from 'express';
import * as calculatorController from '../controllers/calculator.controller.js';

const router = express.Router();

/**
 * Calculator Routes
 * Base path: /api/v1/calculator
 */

/**
 * POST /api/v1/calculator/plano
 * Hitung ukuran kertas dan rekomendasi plano terbaik
 * Body: { boxModel, panjang, lebar, tinggi, tinggiTutup?, lidah? }
 */
router.post('/plano', calculatorController.calculatePlano);

/**
 * POST /api/v1/calculator/price
 * Hitung breakdown harga secara progresif (partial calculation)
 * Body: { boxModel, panjang, lebar, tinggi, tinggiTutup?, lidah?,
 *          material?, materialThickness?, colorOption?, laminationSide?, quantity? }
 */
router.post('/price', calculatorController.calculatePrice);

/**
 * POST /api/v1/calculator/full
 * Hitung total harga lengkap (untuk submit order)
 * Body: semua field order
 */
router.post('/full', calculatorController.calculateFullOrderPrice);

export default router;
