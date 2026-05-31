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
  
  /**
   * Get all active materials
   */
  getMaterials: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials`);
    return response.json();
  },

  /**
   * Get material by code
   */
  getMaterialByCode: async (code) => {
    const response = await fetch(`${API_BASE_URL}/master-data/materials/code/${code}`);
    return response.json();
  },

  // ==========================================
  // FINISHING OPTIONS
  // ==========================================
  
  /**
   * Get all active finishing options
   */
  getFinishingOptions: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options`);
    return response.json();
  },

  /**
   * Get finishing option by code
   */
  getFinishingOptionByCode: async (code) => {
    const response = await fetch(`${API_BASE_URL}/master-data/finishing-options/code/${code}`);
    return response.json();
  },

  // ==========================================
  // PRICING RULES
  // ==========================================
  
  /**
   * Get all active pricing rules
   */
  getPricingRules: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/pricing-rules`);
    return response.json();
  },

  // ==========================================
  // BANK ACCOUNTS
  // ==========================================
  
  /**
   * Get all active bank accounts
   */
  getBankAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/master-data/bank-accounts`);
    return response.json();
  },

  // ==========================================
  // PRICE CALCULATION
  // ==========================================
  
  /**
   * Calculate order price
   */
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

