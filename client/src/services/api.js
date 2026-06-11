const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * API Service for Master Data
 */
export const masterDataAPI = {
  // ==========================================
  // BOX MODELS
  // ==========================================
  
  /**
   * Get all active box models
   */
  getBoxModels: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models`);
    return response.json();
  },

  /**
   * Get all box models (including inactive) - for admin
   */
  getAllBoxModels: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/all`);
    return response.json();
  },

  /**
   * Get box model by ID
   */
  getBoxModelById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/${id}`);
    return response.json();
  },

  /**
   * Create new box model
   */
  createBoxModel: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Update box model
   */
  updateBoxModel: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Delete box model
   */
  deleteBoxModel: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /**
   * Toggle box model active status
   */
  toggleBoxModelStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/box-models/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // MATERIALS
  // ==========================================

  /** Get all active materials */
  getMaterials: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials`);
    return response.json();
  },

  /** Get all materials (including inactive) - for admin */
  getAllMaterials: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/all`);
    return response.json();
  },

  /** Get material by ID */
  getMaterialById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/${id}`);
    return response.json();
  },

  /** Get material by code */
  getMaterialByCode: async (code) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/code/${code}`);
    return response.json();
  },

  /** Create new material */
  createMaterial: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Update material */
  updateMaterial: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Delete material */
  deleteMaterial: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /** Toggle material active status */
  toggleMaterialStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // FINISHING OPTIONS
  // ==========================================

  /** Get all active finishing options */
  getFinishingOptions: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options`);
    return response.json();
  },

  /** Get all finishing options incl. inactive - admin */
  getAllFinishingOptions: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/all`);
    return response.json();
  },

  /** Get finishing option by ID */
  getFinishingOptionById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/${id}`);
    return response.json();
  },

  /** Create finishing option */
  createFinishingOption: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Update finishing option */
  updateFinishingOption: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Delete finishing option */
  deleteFinishingOption: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /** Toggle finishing option status */
  toggleFinishingOptionStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // PRICING RULES — 7-field matrix
  // ==========================================

  /** Get all active pricing rules */
  getPricingRules: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules`);
    return response.json();
  },

  /** Get all pricing rules incl. inactive - admin */
  getAllPricingRules: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules/all`);
    return response.json();
  },

  /** Get pricing rule by ID */
  getPricingRuleById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules/${id}`);
    return response.json();
  },

  /** Create / upsert pricing rule */
  createPricingRule: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Update pricing rule by ID */
  updatePricingRule: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Delete pricing rule */
  deletePricingRule: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /** Toggle pricing rule status */
  togglePricingRuleStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  /** Lookup harga berdasarkan kombinasi 7 field */
  lookupPricingRule: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // ==========================================
  // BANK ACCOUNTS
  // ==========================================

  /** Get all active bank accounts (for checkout dropdown) */
  getBankAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts`);
    return response.json();
  },

  /** Get all bank accounts (both active & inactive) - admin */
  getAllBankAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/all`);
    return response.json();
  },

  /** Get bank account by ID */
  getBankAccountById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/${id}`);
    return response.json();
  },

  /** Create bank account */
  createBankAccount: async (data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Update bank account */
  updateBankAccount: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /** Delete bank account */
  deleteBankAccount: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  /** Toggle bank account status */
  toggleBankAccountStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.json();
  },

  // ==========================================
  // PRICE CALCULATION
  // ==========================================

  /** Calculate order price */
  calculatePrice: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/master-data/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },
};

/**
 * API Service for Cloudinary Uploads
 */
export const uploadAPI = {
  /**
   * Upload design file (Max 10MB)
   * Allowed formats: JPG, PNG, PDF, AI, PSD, SVG
   */
  uploadDesign: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload/design`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  /**
   * Upload payment proof (Max 5MB)
   * Allowed formats: JPG, PNG
   */
  uploadPayment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload/payment`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  /**
   * Upload box model image (Max 2MB)
   * Allowed formats: JPG, PNG, SVG
   */
  uploadBoxModel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload/box-model`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  /**
   * Delete uploaded file from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   */
  deleteFile: async (publicId) => {
    const encodedPublicId = publicId.replace(/\//g, '-');
    const response = await fetch(`${API_BASE_URL}/upload/${encodedPublicId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

/**
 * API Service for Pricing Calculator
 */
export const calculatorAPI = {
  /**
   * Calculate plano recommendation based on box dimensions
   * POST /api/v1/calculator/plano
   */
  calculatePlano: async (data) => {
    const response = await fetch(`${API_BASE_URL}/calculator/plano`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Calculate progressive price breakdown
   * POST /api/v1/calculator/price
   */
  calculatePrice: async (data) => {
    const response = await fetch(`${API_BASE_URL}/calculator/price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Calculate full order price (for order submission)
   * POST /api/v1/calculator/full
   */
  calculateFullPrice: async (data) => {
    const response = await fetch(`${API_BASE_URL}/calculator/full`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

