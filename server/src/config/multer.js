import multer from 'multer';
import path from 'path';

/**
 * Konfigurasi Multer untuk upload file
 * - Storage: diskStorage
 * - Folder: uploads/products & uploads/orders
 * - Filter: hanya image (jpg, png, webp) dan pdf
 * - Limit: 5MB
 */

// Tipe file yang diizinkan
const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeAllowed = ALLOWED_MIMETYPES.includes(file.mimetype);
  const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);

  if (isMimeAllowed && isExtAllowed) {
    cb(null, true);
  } else {
    cb(new Error(`Tipe file tidak diizinkan. Hanya: ${ALLOWED_EXTENSIONS.join(', ')}`), false);
  }
};

/**
 * Buat multer storage untuk folder tertentu
 * @param {string} folder - Subfolder di dalam uploads/ (e.g., 'products', 'orders')
 */
const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join('uploads', folder));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};

// Upload untuk produk
export const uploadProduct = multer({
  storage: createStorage('products'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Upload untuk order
export const uploadOrder = multer({
  storage: createStorage('orders'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default { uploadProduct, uploadOrder };
