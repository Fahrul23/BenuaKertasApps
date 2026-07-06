import prisma from '../config/prisma.js';

/**
 * Master Data Service
 * Handles all master data operations for custom orders
 */

// ==========================================
// BOX MODELS
// ==========================================

/**
 * Get all active box models
 */
export const getActiveBoxModels = async () => {
  return await prisma.boxModel.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      basePrice: true,
    },
  });
};

/**
 * Get all box models (including inactive) - for admin
 */
export const getAllBoxModels = async () => {
  return await prisma.boxModel.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * Get box model by ID
 */
export const getBoxModelById = async (id) => {
  return await prisma.boxModel.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Get box model by code
 */
export const getBoxModelByCode = async (code) => {
  return await prisma.boxModel.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      basePrice: true,
    },
  });
};

/**
 * Create new box model
 */
export const createBoxModel = async (data) => {
  return await prisma.boxModel.create({
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      basePrice: data.basePrice ? parseFloat(data.basePrice) : null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

/**
 * Update box model
 */
export const updateBoxModel = async (id, data) => {
  return await prisma.boxModel.update({
    where: { id: parseInt(id) },
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      basePrice: data.basePrice ? parseFloat(data.basePrice) : null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

/**
 * Delete box model
 */
export const deleteBoxModel = async (id) => {
  return await prisma.boxModel.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Toggle box model active status
 */
export const toggleBoxModelStatus = async (id) => {
  const boxModel = await prisma.boxModel.findUnique({
    where: { id: parseInt(id) },
  });

  if (!boxModel) {
    throw new Error('Box model not found');
  }

  return await prisma.boxModel.update({
    where: { id: parseInt(id) },
    data: {
      isActive: !boxModel.isActive,
    },
  });
};

// ==========================================
// MATERIALS
// ==========================================

/**
 * Get all active materials
 */
export const getActiveMaterials = async () => {
  return await prisma.material.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
    },
  });
};

/**
 * Get material by code
 */
export const getMaterialByCode = async (code) => {
  return await prisma.material.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
    },
  });
};

/**
 * Get all materials (including inactive) - for admin
 */
export const getAllMaterials = async () => {
  return await prisma.material.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * Get material by ID
 */
export const getMaterialById = async (id) => {
  return await prisma.material.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create new material
 */
export const createMaterial = async (data) => {
  return await prisma.material.create({
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

/**
 * Update material
 */
export const updateMaterial = async (id, data) => {
  return await prisma.material.update({
    where: { id: parseInt(id) },
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

/**
 * Delete material
 */
export const deleteMaterial = async (id) => {
  return await prisma.material.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Toggle material active status
 */
export const toggleMaterialStatus = async (id) => {
  const material = await prisma.material.findUnique({
    where: { id: parseInt(id) },
  });

  if (!material) {
    throw new Error('Material not found');
  }

  return await prisma.material.update({
    where: { id: parseInt(id) },
    data: {
      isActive: !material.isActive,
    },
  });
};

/**
 * Get material price by code and thickness
 */
export const getMaterialPrice = async (code, thickness) => {
  const material = await prisma.material.findUnique({
    where: { code },
  });

  if (!material) {
    throw new Error('Material not found');
  }

  const priceField = `price${thickness}gsm`;
  const price = material[priceField];

  if (!price) {
    throw new Error(`Price not available for thickness ${thickness}gsm`);
  }

  return price;
};

// ==========================================
// FINISHING OPTIONS
// ==========================================

/**
 * Get all active finishing options
 */
export const getActiveFinishingOptions = async () => {
  return await prisma.finishingOption.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      category: true,
    },
  });
};

/**
 * Get finishing option by code
 */
export const getFinishingOptionByCode = async (code) => {
  return await prisma.finishingOption.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      imageUrl: true,
      category: true,
    },
  });
};

// ==========================================
// FINISHING OPTIONS (additional CRUD)
// ==========================================

/**
 * Get all finishing options (including inactive) - for admin
 */
export const getAllFinishingOptions = async () => {
  return await prisma.finishingOption.findMany({
    orderBy: { id: 'asc' },
  });
};

/**
 * Get finishing option by ID
 */
export const getFinishingOptionById = async (id) => {
  return await prisma.finishingOption.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create new finishing option
 */
export const createFinishingOption = async (data) => {
  return await prisma.finishingOption.create({
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      category: data.category,
    },
  });
};

/**
 * Update finishing option
 */
export const updateFinishingOption = async (id, data) => {
  return await prisma.finishingOption.update({
    where: { id: parseInt(id) },
    data: {
      code: data.code,
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      category: data.category,
    },
  });
};

/**
 * Delete finishing option
 */
export const deleteFinishingOption = async (id) => {
  return await prisma.finishingOption.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Toggle finishing option active status
 */
export const toggleFinishingOptionStatus = async (id) => {
  const option = await prisma.finishingOption.findUnique({
    where: { id: parseInt(id) },
  });

  if (!option) {
    throw new Error('Finishing option not found');
  }

  return await prisma.finishingOption.update({
    where: { id: parseInt(id) },
    data: { isActive: !option.isActive },
  });
};



// ==========================================
// BANK ACCOUNTS
// ==========================================

/**
 * Get all active bank accounts
 */
export const getActiveBankAccounts = async () => {
  return await prisma.bank_accounts.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    select: {
      id: true,
      bankName: true,
      accountNumber: true,
      accountHolderName: true,
      branch: true,
      imageUrl: true,
    },
  });
};

/**
 * Get all bank accounts (both active & inactive, Admin only)
 */
export const getAllBankAccounts = async () => {
  return await prisma.bank_accounts.findMany({
    orderBy: { displayOrder: 'asc' },
  });
};

/**
 * Get bank account by ID
 */
export const getBankAccountById = async (id) => {
  return await prisma.bank_accounts.findUnique({
    where: { id: parseInt(id) },
  });
};

/**
 * Create bank account
 */
export const createBankAccount = async (data) => {
  const { bankName, accountNumber, accountHolderName, branch, imageUrl, publicId, isActive, displayOrder } = data;

  const existing = await prisma.bank_accounts.findFirst({
    where: {
      bankName,
      accountNumber,
    },
  });

  if (existing) {
    throw new Error('Rekening bank dengan nomor ini sudah terdaftar');
  }

  return await prisma.bank_accounts.create({
    data: {
      bankName,
      accountNumber,
      accountHolderName,
      branch,
      imageUrl: imageUrl || null,
      publicId: publicId || null,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder != null ? parseInt(displayOrder) : 0,
      updatedAt: new Date(),
    },
  });
};

/**
 * Update bank account
 */
export const updateBankAccount = async (id, data) => {
  return await prisma.bank_accounts.update({
    where: { id: parseInt(id) },
    data: {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName,
      branch: data.branch,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
      publicId: data.publicId !== undefined ? data.publicId : undefined,
      isActive: data.isActive !== undefined ? data.isActive : true,
      displayOrder: data.displayOrder != null ? parseInt(data.displayOrder) : 0,
      updatedAt: new Date(),
    },
  });
};

/**
 * Toggle bank account status
 */
export const toggleBankAccountStatus = async (id) => {
  const acc = await prisma.bank_accounts.findUnique({
    where: { id: parseInt(id) },
  });

  if (!acc) {
    throw new Error('Rekening bank tidak ditemukan');
  }

  return await prisma.bank_accounts.update({
    where: { id: parseInt(id) },
    data: {
      isActive: !acc.isActive,
      updatedAt: new Date(),
    },
  });
};

/**
 * Delete bank account
 */
export const deleteBankAccount = async (id) => {
  return await prisma.bank_accounts.delete({
    where: { id: parseInt(id) },
  });
};

// ==========================================
// PLANO TYPES
// ==========================================

export const getAllPlanoTypes = async () => {
  return await prisma.planoType.findMany({
    orderBy: { sortOrder: 'asc' },
  });
};

export const getActivePlanoTypes = async () => {
  return await prisma.planoType.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
};

export const createPlanoType = async (data) => {
  return await prisma.planoType.create({
    data: {
      code: data.code,
      width: parseFloat(data.width),
      height: parseFloat(data.height),
      effectiveWidth: parseFloat(data.effectiveWidth),
      effectiveHeight: parseFloat(data.effectiveHeight),
      isActive: data.isActive !== undefined ? data.isActive : true,
      sortOrder: data.sortOrder ? parseInt(data.sortOrder) : 0,
    },
  });
};

export const updatePlanoType = async (id, data) => {
  return await prisma.planoType.update({
    where: { id: parseInt(id) },
    data: {
      code: data.code,
      width: parseFloat(data.width),
      height: parseFloat(data.height),
      effectiveWidth: parseFloat(data.effectiveWidth),
      effectiveHeight: parseFloat(data.effectiveHeight),
      isActive: data.isActive !== undefined ? data.isActive : true,
      sortOrder: data.sortOrder ? parseInt(data.sortOrder) : 0,
    },
  });
};

export const togglePlanoTypeStatus = async (id) => {
  const plano = await prisma.planoType.findUnique({
    where: { id: parseInt(id) },
  });
  if (!plano) throw new Error('PlanoType not found');

  return await prisma.planoType.update({
    where: { id: parseInt(id) },
    data: { isActive: !plano.isActive },
  });
};

export const deletePlanoType = async (id) => {
  return await prisma.planoType.delete({
    where: { id: parseInt(id) },
  });
};

// ==========================================
// MATERIAL PRICES
// ==========================================

/**
 * Get distinct thickness values available for a material code
 */
export const getThicknessByMaterialCode = async (materialCode) => {
  const prices = await prisma.materialPrice.findMany({
    where: { materialCode },
    select: { thickness: true },
    distinct: ['thickness'],
    orderBy: { thickness: 'asc' },
  });
  return prices.map(p => p.thickness);
};

export const getAllMaterialPrices = async () => {
  return await prisma.materialPrice.findMany({
    orderBy: [
      { materialCode: 'asc' },
      { thickness: 'asc' },
      { planoCode: 'asc' },
    ],
  });
};

export const createMaterialPrice = async (data) => {
  return await prisma.materialPrice.create({
    data: {
      planoCode: data.planoCode,
      materialCode: data.materialCode,
      thickness: parseInt(data.thickness),
      price: parseFloat(data.price),
    },
  });
};

export const updateMaterialPrice = async (id, data) => {
  return await prisma.materialPrice.update({
    where: { id: parseInt(id) },
    data: {
      planoCode: data.planoCode,
      materialCode: data.materialCode,
      thickness: parseInt(data.thickness),
      price: parseFloat(data.price),
    },
  });
};

export const deleteMaterialPrice = async (id) => {
  return await prisma.materialPrice.delete({
    where: { id: parseInt(id) },
  });
};

