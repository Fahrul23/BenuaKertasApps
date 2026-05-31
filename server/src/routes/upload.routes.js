import express from 'express';
import * as uploadController from '../controllers/upload.controller.js';
import { uploadDesign, uploadPayment, uploadBoxModel } from '../config/cloudinary.js';

const router = express.Router();

/**
 * Upload Routes
 * Base path: /api/upload
 */

// ==========================================
// DESIGN FILE UPLOAD
// ==========================================

/**
 * POST /api/upload/design
 * Upload design file
 * Max size: 10MB
 * Allowed formats: jpg, jpeg, png, pdf, ai, psd, svg
 */
router.post('/design', uploadDesign.single('file'), uploadController.uploadDesignFile);

// ==========================================
// PAYMENT PROOF UPLOAD
// ==========================================

/**
 * POST /api/upload/payment
 * Upload payment proof
 * Max size: 5MB
 * Allowed formats: jpg, jpeg, png
 */
router.post('/payment', uploadPayment.single('file'), uploadController.uploadPaymentProof);

// ==========================================
// BOX MODEL IMAGE UPLOAD
// ==========================================

/**
 * POST /api/upload/box-model
 * Upload box model image
 * Max size: 2MB
 * Allowed formats: jpg, jpeg, png, svg
 */
router.post('/box-model', uploadBoxModel.single('file'), uploadController.uploadBoxModelImage);

// ==========================================
// DELETE FILE
// ==========================================

/**
 * DELETE /api/upload/:publicId
 * Delete file from Cloudinary
 * Note: publicId should have / replaced with -
 * Example: benua-kertas-designs-abc123
 */
router.delete('/:publicId', uploadController.deleteUploadedFile);

// ==========================================
// GENERATE UPLOAD SIGNATURE
// ==========================================

/**
 * GET /api/upload/signature/:folder
 * Generate signature for direct upload from frontend
 * Allowed folders:
 * - benua-kertas/designs
 * - benua-kertas/payments
 * - benua-kertas/box-models
 */
router.get('/signature/:folder', uploadController.getUploadSignature);

export default router;
