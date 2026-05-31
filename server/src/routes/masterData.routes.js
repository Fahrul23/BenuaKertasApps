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
 * GET /api/master-data/box-models/all
 * Get all box models (including inactive) - for admin
 */
router.get('/box-models/all', masterDataController.getAllBoxModels);

/**
 * GET /api/master-data/box-models/:id
 * Get box model by ID
 */
router.get('/box-models/:id', masterDataController.getBoxModelById);

/**
 * GET /api/master-data/box-models/code/:code
 * Get box model by code
 */
router.get('/box-models/code/:code', masterDataController.getBoxModelByCode);

/**
 * POST /api/master-data/box-models
 * Create new box model
 */
router.post('/box-models', masterDataController.createBoxModel);

/**
 * PUT /api/master-data/box-models/:id
 * Update box model
 */
router.put('/box-models/:id', masterDataController.updateBoxModel);

/**
 * DELETE /api/master-data/box-models/:id
 * Delete box model
 */
router.delete('/box-models/:id', masterDataController.deleteBoxModel);

/**
 * PATCH /api/master-data/box-models/:id/toggle
 * Toggle box model active status
 */
router.patch('/box-models/:id/toggle', masterDataController.toggleBoxModelStatus);

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
