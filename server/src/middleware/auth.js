import jwt from 'jsonwebtoken';

/**
 * Middleware verifyToken
 * - Membaca Bearer token dari header Authorization
 * - Verify JWT dengan secret dari .env
 * - Inject decoded user ke req.user
 * - Kirim 401 jika token tidak valid atau tidak ada
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak ditemukan.',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah kadaluarsa. Silakan login kembali.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat verifikasi token.',
    });
  }
};

/**
 * Middleware authorizeRoles
 * Membatasi akses hanya untuk role tertentu
 * @param  {...string} roles - Role yang diizinkan (e.g., 'ADMIN')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki izin untuk mengakses resource ini.',
      });
    }
    next();
  };
};

export { verifyToken, authorizeRoles };
