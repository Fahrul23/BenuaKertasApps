import express from 'express';
import * as calculatorController from '../controllers/calculator.controller.js';

const router = express.Router();

/**
 * Calculator Routes — Pricing Engine v3
 * Base path: /api/v1/calculator
 */

/**
 * POST /api/v1/calculator/plano
 * Hitung ukuran kertas dan rekomendasi plano terbaik
 * Body: { boxModel, panjang, lebar, tinggi, tinggiTutup?, lidah? }
 */
router.post('/plano', calculatorController.calculatePlano);

/**
 * POST /api/v1/calculator/pricing  ← Endpoint UTAMA v3
 * Kalkulasi harga produksi lengkap (8 komponen)
 * Body: { boxModel, panjang, lebar, tinggi, tinggiTutup?, lidah?,
 *          material, materialThickness, laminationSide, quantity }
 * Response: { planoType, jumlahMata, qtyPlano, qtyRim,
 *              hargaKertas, hargaCetak, hargaDrag, hargaPlat,
 *              hargaPisau, hargaPond, hargaPacking, hargaLaminasi,
 *              totalBayar, hargaPerPcs }
 */
router.post('/pricing', calculatorController.calculatePricing);

/**
 * POST /api/v1/calculator/price
 * Kalkulasi progresif (partial — menghitung setiap step yang tersedia)
 * Untuk keperluan live update di frontend sebelum semua step selesai
 */
router.post('/price', calculatorController.calculatePrice);

/**
 * POST /api/v1/calculator/full
 * Hitung total harga lengkap (untuk submit order — alias calculatePricing)
 */
router.post('/full', calculatorController.calculateFullOrderPrice);

export default router;
