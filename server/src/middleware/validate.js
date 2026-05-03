/**
 * Middleware factory untuk validasi Zod schema
 * validate(schema) → middleware yang cek req.body
 * Kirim 400 dengan detail error jika tidak valid
 *
 * @param {import('zod').ZodSchema} schema - Zod schema untuk validasi
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validasi gagal. Periksa data yang dikirim.',
        errors,
      });
    }

    // Replace req.body dengan data yang sudah di-parse & di-transform
    req.body = result.data;
    next();
  };
};

export default validate;
