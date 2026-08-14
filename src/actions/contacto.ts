'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendContactFormEmail(data: {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
}) {
  try {
    const receiver = process.env.EMAIL_VENTAS || process.env.EMAIL_GENERAL || 'contacto@fydingenieria.cl';
    // Siempre intentamos enviar desde el correo oficial corporativo
    const sender = 'contacto@fydingenieria.cl';

    const { data: resendData, error } = await resend.emails.send({
      from: `Formulario Web F&D <${sender}>`,
      to: [receiver],
      replyTo: data.email,
      subject: `Nuevo mensaje de Contacto: ${data.reason} - ${data.fullName}`,
      html: `
        <h2>Nuevo mensaje desde Formulario Web</h2>
        <p><strong>Nombre:</strong> ${data.fullName}</p>
        <p><strong>Empresa:</strong> ${data.company || 'N/A'}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone}</p>
        <p><strong>Motivo:</strong> ${data.reason}</p>
        <br/>
        <p><strong>Mensaje:</strong></p>
        <p>${data.message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    if (error) {
      console.error('Error al enviar formulario de contacto:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Fallo general enviando formulario:', error);
    return { success: false, error: 'Fallo de conexión interno' };
  }
}
