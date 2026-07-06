import express from 'express';
import * as masterDataController from '../controllers/masterData.controller.js';
import * as pricingConfigController from '../controllers/pricingConfig.controller.js';
import * as cmykBlokPriceController from '../controllers/cmykBlokPrice.controller.js';

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

/** GET /api/master-data/materials — Get all active materials */
router.get('/materials', masterDataController.getMaterials);

/** GET /api/master-data/materials/all — Get all materials (including inactive) - for admin */
router.get('/materials/all', masterDataController.getAllMaterials);

/** GET /api/master-data/materials/code/:code — Get material by code */
router.get('/materials/code/:code', masterDataController.getMaterialByCode);

/** GET /api/master-data/materials/code/:code/thicknesses — Get thickness options for material */
router.get('/materials/code/:code/thicknesses', masterDataController.getThicknessByMaterialCode);

/** GET /api/master-data/materials/:id — Get material by ID */
router.get('/materials/:id', masterDataController.getMaterialById);

/** POST /api/master-data/materials — Create new material */
router.post('/materials', masterDataController.createMaterial);

/** PUT /api/master-data/materials/:id — Update material */
router.put('/materials/:id', masterDataController.updateMaterial);

/** DELETE /api/master-data/materials/:id — Delete material */
router.delete('/materials/:id', masterDataController.deleteMaterial);

/** PATCH /api/master-data/materials/:id/toggle — Toggle material active status */
router.patch('/materials/:id/toggle', masterDataController.toggleMaterialStatus);

// ==========================================
// FINISHING OPTIONS CRUD
// ==========================================

/** GET /api/master-data/finishing-options — active only */
router.get('/finishing-options', masterDataController.getFinishingOptions);

/** GET /api/master-data/finishing-options/all — admin */
router.get('/finishing-options/all', masterDataController.getAllFinishingOptions);

/** GET /api/master-data/finishing-options/:id — by ID */
router.get('/finishing-options/:id', masterDataController.getFinishingOptionById);

/** POST /api/master-data/finishing-options — create */
router.post('/finishing-options', masterDataController.createFinishingOption);

/** PUT /api/master-data/finishing-options/:id — update */
router.put('/finishing-options/:id', masterDataController.updateFinishingOption);

/** DELETE /api/master-data/finishing-options/:id — delete */
router.delete('/finishing-options/:id', masterDataController.deleteFinishingOption);

/** PATCH /api/master-data/finishing-options/:id/toggle — toggle status */
router.patch('/finishing-options/:id/toggle', masterDataController.toggleFinishingOptionStatus);


// ==========================================
// BANK ACCOUNTS
// ==========================================

/**
 * GET /api/master-data/bank-accounts — active only (for customers)
 */
router.get('/bank-accounts', masterDataController.getBankAccounts);

/**
 * GET /api/master-data/bank-accounts/all — all accounts (for admin)
 */
router.get('/bank-accounts/all', masterDataController.getAllBankAccounts);

/**
 * GET /api/master-data/bank-accounts/:id — get one
 */
router.get('/bank-accounts/:id', masterDataController.getBankAccountById);

/**
 * POST /api/master-data/bank-accounts — create
 */
router.post('/bank-accounts', masterDataController.createBankAccount);

/**
 * PUT /api/master-data/bank-accounts/:id — update
 */
router.put('/bank-accounts/:id', masterDataController.updateBankAccount);

/**
 * PATCH /api/master-data/bank-accounts/:id/toggle — toggle status
 */
router.patch('/bank-accounts/:id/toggle', masterDataController.toggleBankAccountStatus);

/**
 * DELETE /api/master-data/bank-accounts/:id — delete
 */
router.delete('/bank-accounts/:id', masterDataController.deleteBankAccount);


// ==========================================
// CMYK BLOK PRICES
// ==========================================

router.get('/cmyk-blok-prices', cmykBlokPriceController.getCmykBlokPrices);
router.get('/cmyk-blok-prices/all', cmykBlokPriceController.getAllCmykBlokPrices);
router.post('/cmyk-blok-prices', cmykBlokPriceController.createCmykBlokPrice);
router.put('/cmyk-blok-prices/:id', cmykBlokPriceController.updateCmykBlokPrice);
router.delete('/cmyk-blok-prices/:id', cmykBlokPriceController.deleteCmykBlokPrice);
router.patch('/cmyk-blok-prices/:id/toggle', cmykBlokPriceController.toggleCmykBlokPriceStatus);

// ==========================================
// PRICING CONFIG
// ==========================================

router.get('/pricing-config', pricingConfigController.getPricingConfig);
router.put('/pricing-config', pricingConfigController.updatePricingConfig);

// ==========================================
// MATERIAL PRICES
// ==========================================

router.get('/material-prices', masterDataController.getAllMaterialPrices);
router.post('/material-prices', masterDataController.createMaterialPrice);
router.put('/material-prices/:id', masterDataController.updateMaterialPrice);
router.delete('/material-prices/:id', masterDataController.deleteMaterialPrice);

// ==========================================
// PLANO TYPES
// ==========================================

router.get('/plano-types', masterDataController.getActivePlanoTypes);
router.get('/plano-types/all', masterDataController.getAllPlanoTypes);
router.post('/plano-types', masterDataController.createPlanoType);
router.put('/plano-types/:id', masterDataController.updatePlanoType);
router.delete('/plano-types/:id', masterDataController.deletePlanoType);
router.patch('/plano-types/:id/toggle', masterDataController.togglePlanoTypeStatus);

export default router;
