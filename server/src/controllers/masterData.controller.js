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
 * GET /api/master-data/box-models/all
 * Get all box models (including inactive) - for admin
 */
export const getAllBoxModels = async (req, res) => {
  try {
    const boxModels = await masterDataService.getAllBoxModels();
    
    res.status(200).json({
      success: true,
      message: 'All box models retrieved successfully',
      data: boxModels,
    });
  } catch (error) {
    console.error('Error getting all box models:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve box models',
      error: error.message,
    });
  }
};

/**
 * GET /api/master-data/box-models/:id
 * Get box model by ID
 */
export const getBoxModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const boxModel = await masterDataService.getBoxModelById(id);
    
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

/**
 * GET /api/master-data/box-models/code/:code
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

/**
 * POST /api/master-data/box-models
 * Create new box model
 */
export const createBoxModel = async (req, res) => {
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.code || !data.name) {
      return res.status(400).json({
        success: false,
        message: 'Code and name are required',
      });
    }
    
    const boxModel = await masterDataService.createBoxModel(data);
    
    res.status(201).json({
      success: true,
      message: 'Box model created successfully',
      data: boxModel,
    });
  } catch (error) {
    console.error('Error creating box model:', error);
    
    // Handle unique constraint error
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Box model with this code already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create box model',
      error: error.message,
    });
  }
};

/**
 * PUT /api/master-data/box-models/:id
 * Update box model
 */
export const updateBoxModel = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Validate required fields
    if (!data.code || !data.name) {
      return res.status(400).json({
        success: false,
        message: 'Code and name are required',
      });
    }
    
    const boxModel = await masterDataService.updateBoxModel(id, data);
    
    res.status(200).json({
      success: true,
      message: 'Box model updated successfully',
      data: boxModel,
    });
  } catch (error) {
    console.error('Error updating box model:', error);
    
    // Handle not found error
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Box model not found',
      });
    }
    
    // Handle unique constraint error
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Box model with this code already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update box model',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/master-data/box-models/:id
 * Delete box model
 */
export const deleteBoxModel = async (req, res) => {
  try {
    const { id } = req.params;
    
    await masterDataService.deleteBoxModel(id);
    
    res.status(200).json({
      success: true,
      message: 'Box model deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting box model:', error);
    
    // Handle not found error
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Box model not found',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete box model',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/master-data/box-models/:id/toggle
 * Toggle box model active status
 */
export const toggleBoxModelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const boxModel = await masterDataService.toggleBoxModelStatus(id);
    
    res.status(200).json({
      success: true,
      message: `Box model ${boxModel.isActive ? 'activated' : 'deactivated'} successfully`,
      data: boxModel,
    });
  } catch (error) {
    console.error('Error toggling box model status:', error);
    
    if (error.message === 'Box model not found') {
      return res.status(404).json({
        success: false,
        message: 'Box model not found',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to toggle box model status',
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
    res.status(500).json({ success: false, message: 'Failed to retrieve materials', error: error.message });
  }
};

/**
 * GET /api/master-data/materials/all
 * Get all materials (including inactive) - for admin
 */
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await masterDataService.getAllMaterials();
    res.status(200).json({
      success: true,
      message: 'All materials retrieved successfully',
      data: materials,
    });
  } catch (error) {
    console.error('Error getting all materials:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve materials', error: error.message });
  }
};

/**
 * GET /api/master-data/materials/:id
 * Get material by ID
 */
export const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await masterDataService.getMaterialById(id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    res.status(200).json({ success: true, message: 'Material retrieved successfully', data: material });
  } catch (error) {
    console.error('Error getting material:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve material', error: error.message });
  }
};

/**
 * GET /api/master-data/materials/code/:code
 * Get material by code
 */
export const getMaterialByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const material = await masterDataService.getMaterialByCode(code);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    res.status(200).json({ success: true, message: 'Material retrieved successfully', data: material });
  } catch (error) {
    console.error('Error getting material:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve material', error: error.message });
  }
};

/**
 * POST /api/master-data/materials
 * Create new material
 */
export const createMaterial = async (req, res) => {
  try {
    const data = req.body;
    if (!data.code || !data.name) {
      return res.status(400).json({ success: false, message: 'Code and name are required' });
    }
    const material = await masterDataService.createMaterial(data);
    res.status(201).json({ success: true, message: 'Material created successfully', data: material });
  } catch (error) {
    console.error('Error creating material:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Material with this code already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to create material', error: error.message });
  }
};

/**
 * PUT /api/master-data/materials/:id
 * Update material
 */
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!data.code || !data.name) {
      return res.status(400).json({ success: false, message: 'Code and name are required' });
    }
    const material = await masterDataService.updateMaterial(id, data);
    res.status(200).json({ success: true, message: 'Material updated successfully', data: material });
  } catch (error) {
    console.error('Error updating material:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Material with this code already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to update material', error: error.message });
  }
};

/**
 * DELETE /api/master-data/materials/:id
 * Delete material
 */
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await masterDataService.deleteMaterial(id);
    res.status(200).json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to delete material', error: error.message });
  }
};

/**
 * PATCH /api/master-data/materials/:id/toggle
 * Toggle material active status
 */
export const toggleMaterialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await masterDataService.toggleMaterialStatus(id);
    res.status(200).json({
      success: true,
      message: `Material ${material.isActive ? 'activated' : 'deactivated'} successfully`,
      data: material,
    });
  } catch (error) {
    console.error('Error toggling material status:', error);
    if (error.message === 'Material not found') {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to toggle material status', error: error.message });
  }
};

// ==========================================
// FINISHING OPTIONS CRUD
// ==========================================

/** GET /api/master-data/finishing-options — active only */
export const getFinishingOptions = async (req, res) => {
  try {
    const data = await masterDataService.getActiveFinishingOptions();
    res.status(200).json({ success: true, message: 'Finishing options retrieved successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve finishing options', error: error.message });
  }
};

/** GET /api/master-data/finishing-options/all — admin */
export const getAllFinishingOptions = async (req, res) => {
  try {
    const data = await masterDataService.getAllFinishingOptions();
    res.status(200).json({ success: true, message: 'All finishing options retrieved successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve finishing options', error: error.message });
  }
};

/** GET /api/master-data/finishing-options/:id — by ID */
export const getFinishingOptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await masterDataService.getFinishingOptionById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Finishing option not found' });
    res.status(200).json({ success: true, message: 'Finishing option retrieved successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve finishing option', error: error.message });
  }
};

/** POST /api/master-data/finishing-options — create */
export const createFinishingOption = async (req, res) => {
  try {
    const data = req.body;
    if (!data.code || !data.name || !data.category) {
      return res.status(400).json({ success: false, message: 'code, name, dan category wajib diisi' });
    }
    const result = await masterDataService.createFinishingOption(data);
    res.status(201).json({ success: true, message: 'Finishing option created successfully', data: result });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Finishing option dengan kode ini sudah ada' });
    }
    res.status(500).json({ success: false, message: 'Failed to create finishing option', error: error.message });
  }
};

/** PUT /api/master-data/finishing-options/:id — update */
export const updateFinishingOption = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!data.code || !data.name || !data.category) {
      return res.status(400).json({ success: false, message: 'code, name, dan category wajib diisi' });
    }
    const result = await masterDataService.updateFinishingOption(id, data);
    res.status(200).json({ success: true, message: 'Finishing option updated successfully', data: result });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Finishing option not found' });
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: 'Kode finishing option sudah digunakan' });
    res.status(500).json({ success: false, message: 'Failed to update finishing option', error: error.message });
  }
};

/** DELETE /api/master-data/finishing-options/:id */
export const deleteFinishingOption = async (req, res) => {
  try {
    const { id } = req.params;
    await masterDataService.deleteFinishingOption(id);
    res.status(200).json({ success: true, message: 'Finishing option deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Finishing option not found' });
    res.status(500).json({ success: false, message: 'Failed to delete finishing option', error: error.message });
  }
};

/** PATCH /api/master-data/finishing-options/:id/toggle */
export const toggleFinishingOptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await masterDataService.toggleFinishingOptionStatus(id);
    res.status(200).json({ success: true, message: `Finishing option ${result.isActive ? 'activated' : 'deactivated'} successfully`, data: result });
  } catch (error) {
    if (error.message === 'Finishing option not found') return res.status(404).json({ success: false, message: 'Finishing option not found' });
    res.status(500).json({ success: false, message: 'Failed to toggle finishing option status', error: error.message });
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

/**
 * GET /api/master-data/bank-accounts/all
 * Get all bank accounts (both active & inactive, Admin only)
 */
export const getAllBankAccounts = async (req, res) => {
  try {
    const accounts = await masterDataService.getAllBankAccounts();
    res.status(200).json({
      success: true,
      message: 'All bank accounts retrieved successfully',
      data: accounts,
    });
  } catch (error) {
    console.error('Error getting all bank accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bank accounts',
      error: error.message,
    });
  }
};

/**
 * GET /api/master-data/bank-accounts/:id
 * Get bank account by ID
 */
export const getBankAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await masterDataService.getBankAccountById(id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Rekening bank tidak ditemukan',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Bank account retrieved successfully',
      data: account,
    });
  } catch (error) {
    console.error('Error getting bank account by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bank account',
      error: error.message,
    });
  }
};

/**
 * POST /api/master-data/bank-accounts
 * Create new bank account (Admin only)
 */
export const createBankAccount = async (req, res) => {
  try {
    const data = req.body;
    
    const required = ['bankName', 'accountNumber', 'accountHolderName'];
    const missing = required.filter(f => !data[f] && data[f] !== 0);
    
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Field wajib tidak lengkap: ${missing.join(', ')}`,
      });
    }
    
    const account = await masterDataService.createBankAccount(data);
    res.status(201).json({
      success: true,
      message: 'Rekening bank berhasil ditambahkan',
      data: account,
    });
  } catch (error) {
    console.error('Error creating bank account:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal menambahkan rekening bank',
      error: error.message,
    });
  }
};

/**
 * PUT /api/master-data/bank-accounts/:id
 * Update bank account (Admin only)
 */
export const updateBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const account = await masterDataService.updateBankAccount(id, data);
    res.status(200).json({
      success: true,
      message: 'Rekening bank berhasil diperbarui',
      data: account,
    });
  } catch (error) {
    console.error('Error updating bank account:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal memperbarui rekening bank',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/master-data/bank-accounts/:id/toggle
 * Toggle bank account active status (Admin only)
 */
export const toggleBankAccountStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await masterDataService.toggleBankAccountStatus(id);
    res.status(200).json({
      success: true,
      message: `Status rekening bank berhasil diubah menjadi ${account.isActive ? 'aktif' : 'nonaktif'}`,
      data: account,
    });
  } catch (error) {
    console.error('Error toggling bank account status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengubah status rekening bank',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/master-data/bank-accounts/:id
 * Delete bank account (Admin only)
 */
export const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    await masterDataService.deleteBankAccount(id);
    res.status(200).json({
      success: true,
      message: 'Rekening bank berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal menghapus rekening bank',
      error: error.message,
    });
  }
};

// ==========================================
// PLANO TYPES
// ==========================================

export const getAllPlanoTypes = async (req, res) => {
  try {
    const data = await masterDataService.getAllPlanoTypes();
    res.status(200).json({ success: true, message: 'Plano types retrieved', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve plano types', error: error.message });
  }
};

export const getActivePlanoTypes = async (req, res) => {
  try {
    const data = await masterDataService.getActivePlanoTypes();
    res.status(200).json({ success: true, message: 'Active plano types retrieved', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve active plano types', error: error.message });
  }
};

export const createPlanoType = async (req, res) => {
  try {
    const data = await masterDataService.createPlanoType(req.body);
    res.status(201).json({ success: true, message: 'Plano type created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create plano type', error: error.message });
  }
};

export const updatePlanoType = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await masterDataService.updatePlanoType(id, req.body);
    res.status(200).json({ success: true, message: 'Plano type updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update plano type', error: error.message });
  }
};

export const togglePlanoTypeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await masterDataService.togglePlanoTypeStatus(id);
    res.status(200).json({ success: true, message: 'Plano type status toggled', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle plano type', error: error.message });
  }
};

export const deletePlanoType = async (req, res) => {
  try {
    const { id } = req.params;
    await masterDataService.deletePlanoType(id);
    res.status(200).json({ success: true, message: 'Plano type deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete plano type', error: error.message });
  }
};

// ==========================================
// MATERIAL PRICES
// ==========================================

/**
 * GET /api/master-data/materials/code/:code/thicknesses
 * Get distinct thickness options for a given material code
 */
export const getThicknessByMaterialCode = async (req, res) => {
  try {
    const { code } = req.params;
    const thicknesses = await masterDataService.getThicknessByMaterialCode(code);
    res.status(200).json({ success: true, message: 'Thicknesses retrieved', data: thicknesses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve thicknesses', error: error.message });
  }
};

export const getAllMaterialPrices = async (req, res) => {
  try {
    const data = await masterDataService.getAllMaterialPrices();
    res.status(200).json({ success: true, message: 'Material prices retrieved', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve material prices', error: error.message });
  }
};

export const createMaterialPrice = async (req, res) => {
  try {
    const data = await masterDataService.createMaterialPrice(req.body);
    res.status(201).json({ success: true, message: 'Material price created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create material price', error: error.message });
  }
};

export const updateMaterialPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await masterDataService.updateMaterialPrice(id, req.body);
    res.status(200).json({ success: true, message: 'Material price updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update material price', error: error.message });
  }
};

export const deleteMaterialPrice = async (req, res) => {
  try {
    const { id } = req.params;
    await masterDataService.deleteMaterialPrice(id);
    res.status(200).json({ success: true, message: 'Material price deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete material price', error: error.message });
  }
};

