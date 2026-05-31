import * as masterDataService from '../services/masterData.service.js';

/**
 * Master Data Controller
 * Handles HTTP requests for master data endpoints
 */

// ==========================================
// BOX MODELS
// ==========================================

/**
 * GET /api/master-data/box-models
 * Get all active box models
 */
export const getBoxModels = async (req, res) => {
  try {
    const boxModels = await masterDataService.getActiveBoxModels();
    
    res.status(200).json({
      success: true,
      message: 'Box models retrieved successfully',
      data: boxModels,
    });
  } catch (error) {
    console.error('Error getting box models:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve box models',
      error: error.message,
    });
  }
};

/**
 * GET /api/master-data/box-models/:code
 * Get box model by code
 */
export const getBoxModelByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const boxModel = await masterDataService.getBoxModelByCode(code);
    
    if (!boxModel) {
      return res.status(404).json({
        success: false,
        message: 'Box model not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Box model retrieved successfully',
      data: boxModel,
    });
  } catch (error) {
    console.error('Error getting box model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve box model',
      error: error.message,
    });
  }
};

// ==========================================
// MATERIALS
// ==========================================

/**
 * GET /api/master-data/materials
 * Get all active materials
 */
export const getMaterials = async (req, res) => {
  try {
    const materials = await masterDataService.getActiveMaterials();
    
    res.status(200).json({
      success: true,
      message: 'Materials retrieved successfully',
      data: materials,
    });
  } catch (error) {
    console.error('Error getting materials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve materials',
      error: error.message,
    });
  }
};

/**
 * GET /api/master-data/materials/:code
 * Get material by code
 */
export const getMaterialByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const material = await masterDataService.getMaterialByCode(code);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Material retrieved successfully',
      data: material,
    });
  } catch (error) {
    console.error('Error getting material:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve material',
      error: error.message,
    });
  }
};

// ==========================================
// FINISHING OPTIONS
// ==========================================

/**
 * GET /api/master-data/finishing-options
 * Get all active finishing options
 */
export const getFinishingOptions = async (req, res) => {
  try {
    const finishingOptions = await masterDataService.getActiveFinishingOptions();
    
    res.status(200).json({
      success: true,
      message: 'Finishing options retrieved successfully',
      data: finishingOptions,
    });
  } catch (error) {
    console.error('Error getting finishing options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve finishing options',
      error: error.message,
    });
  }
};

/**
 * GET /api/master-data/finishing-options/:code
 * Get finishing option by code
 */
export const getFinishingOptionByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const finishingOption = await masterDataService.getFinishingOptionByCode(code);
    
    if (!finishingOption) {
      return res.status(404).json({
        success: false,
        message: 'Finishing option not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Finishing option retrieved successfully',
      data: finishingOption,
    });
  } catch (error) {
    console.error('Error getting finishing option:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve finishing option',
      error: error.message,
    });
  }
};

// ==========================================
// PRICING RULES
// ==========================================

/**
 * GET /api/master-data/pricing-rules
 * Get all active pricing rules
 */
export const getPricingRules = async (req, res) => {
  try {
    const pricingRules = await masterDataService.getActivePricingRules();
    
    res.status(200).json({
      success: true,
      message: 'Pricing rules retrieved successfully',
      data: pricingRules,
    });
  } catch (error) {
    console.error('Error getting pricing rules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pricing rules',
      error: error.message,
    });
  }
};

// ==========================================
// BANK ACCOUNTS
// ==========================================

/**
 * GET /api/master-data/bank-accounts
 * Get all active bank accounts
 */
export const getBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await masterDataService.getActiveBankAccounts();
    
    res.status(200).json({
      success: true,
      message: 'Bank accounts retrieved successfully',
      data: bankAccounts,
    });
  } catch (error) {
    console.error('Error getting bank accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bank accounts',
      error: error.message,
    });
  }
};

// ==========================================
// PRICE CALCULATION
// ==========================================

/**
 * POST /api/master-data/calculate-price
 * Calculate order price
 * 
 * Body:
 * {
 *   boxModel: string,
 *   length: number,
 *   width: number,
 *   height: number,
 *   heightLid: number (optional),
 *   material: string,
 *   thickness: number,
 *   finishing: string,
 *   quantity: number
 * }
 */
export const calculatePrice = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    const requiredFields = ['boxModel', 'length', 'width', 'height', 'material', 'thickness', 'finishing', 'quantity'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields,
      });
    }
    
    const priceData = await masterDataService.calculateOrderPrice(orderData);
    
    res.status(200).json({
      success: true,
      message: 'Price calculated successfully',
      data: priceData,
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate price',
      error: error.message,
    });
  }
};
