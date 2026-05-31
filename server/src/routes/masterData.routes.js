import express from 'express';
import * as masterDataController from '../controllers/masterData.controller.js';

const router = express.Router();

/**
 * Master Data Routes
 * Base path: /api/master-data
 */

// ==========================================
// BOX MODELS
// ==========================================

/**
 * GET /api/master-data/box-models
 * Get all active box models
 */
router.get('/box-models', masterDataController.getBoxModels);

/**
 * GET /api/master-data/box-models/:code
 * Get box model by code
 */
router.get('/box-models/:code', masterDataController.getBoxModelByCode);

// ==========================================
// MATERIALS
// ==========================================

/**
 * GET /api/master-data/materials
 * Get all active materials
 */
router.get('/materials', masterDataController.getMaterials);

/**
 * GET /api/master-data/materials/:code
 * Get material by code
 */
router.get('/materials/:code', masterDataController.getMaterialByCode);

// ==========================================
// FINISHING OPTIONS
// ==========================================

/**
 * GET /api/master-data/finishing-options
 * Get all active finishing options
 */
router.get('/finishing-options', masterDataController.getFinishingOptions);

/**
 * GET /api/master-data/finishing-options/:code
 * Get finishing option by code
 */
router.get('/finishing-options/:code', masterDataController.getFinishingOptionByCode);

// ==========================================
// PRICING RULES
// ==========================================

/**
 * GET /api/master-data/pricing-rules
 * Get all active pricing rules
 */
router.get('/pricing-rules', masterDataController.getPricingRules);

// ==========================================
// BANK ACCOUNTS
// ==========================================

/**
 * GET /api/master-data/bank-accounts
 * Get all active bank accounts
 */
router.get('/bank-accounts', masterDataController.getBankAccounts);

// ==========================================
// PRICE CALCULATION
// ==========================================

/**
 * POST /api/master-data/calculate-price
 * Calculate order price
 */
router.post('/calculate-price', masterDataController.calculatePrice);

export default router;
