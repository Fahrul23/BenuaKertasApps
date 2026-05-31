import { deleteFile, generateUploadSignature } from '../config/cloudinary.js';

/**
 * Upload Controller
 * Handles file uploads to Cloudinary
 */

// ==========================================
// DESIGN FILE UPLOAD
// ==========================================

/**
 * POST /api/upload/design
 * Upload design file
 */
export const uploadDesignFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // File info from Cloudinary
    const fileInfo = {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      format: req.file.format,
      size: req.file.size,
      width: req.file.width,
      height: req.file.height,
    };

    res.status(200).json({
      success: true,
      message: 'Design file uploaded successfully',
      data: fileInfo,
    });
  } catch (error) {
    console.error('Error uploading design file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload design file',
      error: error.message,
    });
  }
};

// ==========================================
// PAYMENT PROOF UPLOAD
// ==========================================

/**
 * POST /api/upload/payment
 * Upload payment proof
 */
export const uploadPaymentProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // File info from Cloudinary
    const fileInfo = {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      format: req.file.format,
      size: req.file.size,
      width: req.file.width,
      height: req.file.height,
    };

    res.status(200).json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: fileInfo,
    });
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload payment proof',
      error: error.message,
    });
  }
};

// ==========================================
// BOX MODEL IMAGE UPLOAD
// ==========================================

/**
 * POST /api/upload/box-model
 * Upload box model image
 */
export const uploadBoxModelImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // File info from Cloudinary
    const fileInfo = {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      format: req.file.format,
      size: req.file.size,
      width: req.file.width,
      height: req.file.height,
    };

    res.status(200).json({
      success: true,
      message: 'Box model image uploaded successfully',
      data: fileInfo,
    });
  } catch (error) {
    console.error('Error uploading box model image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload box model image',
      error: error.message,
    });
  }
};

// ==========================================
// DELETE FILE
// ==========================================

/**
 * DELETE /api/upload/:publicId
 * Delete file from Cloudinary
 */
export const deleteUploadedFile = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    // Decode public ID (replace - with /)
    const decodedPublicId = publicId.replace(/-/g, '/');

    const result = await deleteFile(decodedPublicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message,
    });
  }
};

// ==========================================
// GENERATE UPLOAD SIGNATURE (for direct upload)
// ==========================================

/**
 * GET /api/upload/signature/:folder
 * Generate signature for direct upload from frontend
 */
export const getUploadSignature = async (req, res) => {
  try {
    const { folder } = req.params;

    const allowedFolders = [
      'benua-kertas/designs',
      'benua-kertas/payments',
      'benua-kertas/box-models',
    ];

    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder',
      });
    }

    const signatureData = generateUploadSignature(folder);

    res.status(200).json({
      success: true,
      message: 'Upload signature generated successfully',
      data: signatureData,
    });
  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate upload signature',
      error: error.message,
    });
  }
};
