import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

/**
 * Cloudinary Configuration
 * 
 * Setup Cloudinary for file uploads
 * Used for: design files, payment proofs, box model images
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// Storage Configurations
// ==========================================

/**
 * Storage for Design Files
 * Folder: benua-kertas/designs
 * Allowed formats: jpg, jpeg, png, pdf, ai, psd, svg
 */
const designStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'benua-kertas/designs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'ai', 'psd', 'svg'],
    resource_type: 'auto',
    transformation: [{ quality: 'auto' }],
  },
});

/**
 * Storage for Payment Proofs
 * Folder: benua-kertas/payments
 * Allowed formats: jpg, jpeg, png
 */
const paymentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'benua-kertas/payments',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image',
    transformation: [{ quality: 'auto', width: 1000, crop: 'limit' }],
  },
});

/**
 * Storage for Box Model Images
 * Folder: benua-kertas/box-models
 * Allowed formats: jpg, jpeg, png, svg
 */
const boxModelStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'benua-kertas/box-models',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'auto',
  },
});

// ==========================================
// Multer Upload Configurations
// ==========================================

/**
 * Upload middleware for design files
 * Max file size: 10MB
 */
export const uploadDesign = multer({
  storage: designStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/postscript', // .ai
      'image/vnd.adobe.photoshop', // .psd
      'image/svg+xml',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, PDF, AI, PSD, and SVG are allowed.'));
    }
  },
});

/**
 * Upload middleware for payment proofs
 * Max file size: 5MB
 */
export const uploadPayment = multer({
  storage: paymentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG and PNG are allowed.'));
    }
  },
});

/**
 * Upload middleware for box model images
 * Max file size: 2MB
 */
export const uploadBoxModel = multer({
  storage: boxModelStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG and PNG are allowed.'));
    }
  },
});

// ==========================================
// Utility Functions
// ==========================================

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, video, raw, auto)
 */
export const deleteFile = async (publicId, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

/**
 * Get file info from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
export const getFileInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting file info from Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate signed upload URL for direct upload from frontend
 * @param {string} folder - Folder name
 */
export const generateUploadSignature = (folder) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: folder,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  };
};

export default cloudinary;
