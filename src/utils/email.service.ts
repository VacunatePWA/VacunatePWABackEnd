import nodemailer from 'nodemailer';
import 'dotenv/config';

// Configuración SMTP con nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_PORT === '465', // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envía un correo electrónico usando la configuración global.
 * @param options - Opciones del correo (destinatario, asunto, cuerpo HTML).
 */
export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: `"Vacúnate RD" <${process.env.FROM_EMAIL || process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('No se pudo enviar el correo de notificación.');
  }
}; 