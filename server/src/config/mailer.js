import nodemailer from 'nodemailer';

/**
 * Nodemailer transporter menggunakan kredensial dari .env
 */
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // true untuk port 465, false untuk port lainnya
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Kirim email
 * @param {Object} options
 * @param {string} options.to - Alamat email tujuan
 * @param {string} options.subject - Subjek email
 * @param {string} options.html - Konten email dalam format HTML
 * @returns {Promise} Info pengiriman email
 */
export const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Benua Kertas" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default transporter;
