import prisma from '../config/prisma.js';

/**
 * Get all active bank accounts
 */
export const getActiveBankAccounts = async () => {
  const bankAccounts = await prisma.bankAccount.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });

  return bankAccounts;
};

/**
 * Get all bank accounts (Admin only)
 */
export const getAllBankAccounts = async () => {
  const bankAccounts = await prisma.bankAccount.findMany({
    orderBy: {
      displayOrder: 'asc',
    },
  });

  return bankAccounts;
};

/**
 * Get bank account by ID
 */
export const getBankAccountById = async (id) => {
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { id },
  });

  if (!bankAccount) {
    throw new Error('Bank account not found');
  }

  return bankAccount;
};

/**
 * Create bank account (Admin only)
 */
export const createBankAccount = async (data) => {
  const { bankName, accountNumber, accountHolderName, branch, isActive, displayOrder } = data;

  // Check if account number already exists
  const existing = await prisma.bankAccount.findFirst({
    where: {
      bankName,
      accountNumber,
    },
  });

  if (existing) {
    throw new Error('Bank account with this number already exists');
  }

  const bankAccount = await prisma.bankAccount.create({
    data: {
      bankName,
      accountNumber,
      accountHolderName,
      branch,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    },
  });

  return bankAccount;
};

/**
 * Update bank account (Admin only)
 */
export const updateBankAccount = async (id, data) => {
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { id },
  });

  if (!bankAccount) {
    throw new Error('Bank account not found');
  }

  const updatedBankAccount = await prisma.bankAccount.update({
    where: { id },
    data: {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName,
      branch: data.branch,
      isActive: data.isActive,
      displayOrder: data.displayOrder,
    },
  });

  return updatedBankAccount;
};

/**
 * Toggle bank account active status (Admin only)
 */
export const toggleBankAccountStatus = async (id) => {
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { id },
  });

  if (!bankAccount) {
    throw new Error('Bank account not found');
  }

  const updatedBankAccount = await prisma.bankAccount.update({
    where: { id },
    data: {
      isActive: !bankAccount.isActive,
    },
  });

  return updatedBankAccount;
};

/**
 * Delete bank account (Admin only)
 */
export const deleteBankAccount = async (id) => {
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { id },
  });

  if (!bankAccount) {
    throw new Error('Bank account not found');
  }

  await prisma.bankAccount.delete({
    where: { id },
  });

  return { message: 'Bank account deleted successfully' };
};

/**
 * Reorder bank accounts (Admin only)
 */
export const reorderBankAccounts = async (orderedIds) => {
  // orderedIds is an array of IDs in the desired order
  const updates = orderedIds.map((id, index) =>
    prisma.bankAccount.update({
      where: { id },
      data: { displayOrder: index },
    })
  );

  await prisma.$transaction(updates);

  return { message: 'Bank accounts reordered successfully' };
};
