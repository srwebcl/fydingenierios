'use server'

import { Resend } from 'resend';
import { prisma } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendContactFormEmail(data: {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  clientType?: string;
  rut?: string;
  companyRut?: string;
  participantsCount?: number;
}) {
  try {
    let interestType: 'SERVICIO' | 'CAPACITACION' | 'GENERAL' = 'GENERAL';
    const reasonLower = data.reason.toLowerCase();
    if (reasonLower.includes('capacitacion') || reasonLower.includes('capacitación') || reasonLower.includes('curso') || reasonLower.includes('diploma')) {
      interestType = 'CAPACITACION';
    } else if (reasonLower.includes('servicio') || reasonLower.includes('informe') || reasonLower.includes('predictivo')) {
      interestType = 'SERVICIO';
    }

    try {
      await prisma.lead.create({
        data: {
          name: data.fullName,
          company: data.company || null,
          email: data.email,
          phone: data.phone,
          message: data.message,
          interestType: interestType,
          interestSlug: data.reason, 
          source: 'Formulario Web',
          clientType: data.clientType || null,
          rut: data.rut || null,
          companyRut: data.companyRut || null,
          participantsCount: data.participantsCount || null,
        }
      });
    } catch (e) {
      console.error('Error al guardar el Lead:', e);
      // No cortamos el flujo si la db falla, igual enviamos el correo
    }

    const receiver = process.env.EMAIL_VENTAS || process.env.EMAIL_GENERAL || 'contacto@fydingenieria.cl';
    // Siempre intentamos enviar desde el correo oficial corporativo
    const sender = 'contacto@fydingenieria.cl';

    const clientTypeHtml = data.clientType 
      ? `
        <div class="field">
          <span class="label">Modalidad de Contratación</span>
          <p class="value">${data.clientType === 'PARTICULAR' ? 'Particular / Persona Natural' : 'Empresa / Institución'}</p>
        </div>
      ` : '';

    const rutHtml = data.rut
      ? `
        <div class="field">
          <span class="label">RUT Persona</span>
          <p class="value">${data.rut}</p>
        </div>
      ` : '';

    const companyRutHtml = data.companyRut
      ? `
        <div class="field">
          <span class="label">RUT Empresa</span>
          <p class="value">${data.companyRut}</p>
        </div>
      ` : '';

    const participantsHtml = data.participantsCount
      ? `
        <div class="field">
          <span class="label">Participantes</span>
          <p class="value">${data.participantsCount}</p>
        </div>
      ` : '';

    const { data: resendData, error } = await resend.emails.send({
      from: `Formulario Web F&D <${sender}>`,
      to: [receiver],
      replyTo: data.email,
      subject: `Nuevo mensaje de Contacto: ${data.reason} - ${data.fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F4FAF9; color: #0B3B3F; margin: 0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .header { background-color: #00A6A6; padding: 30px; text-align: center; }
            .header h2 { color: #FFFFFF; margin: 0; font-size: 24px; }
            .content { padding: 40px; }
            .field { margin-bottom: 20px; }
            .label { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #5B6B6C; font-weight: bold; margin-bottom: 5px; display: block; }
            .value { font-size: 16px; color: #0B3B3F; margin: 0; padding: 12px; background-color: #F4FAF9; border-radius: 6px; border: 1px solid #E5E7EB; }
            .message-box { background-color: #F4FAF9; border-left: 4px solid #6EFA3C; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-top: 30px; }
            .message-box p { margin: 0; font-size: 15px; color: #0B3B3F; line-height: 1.6; }
            .footer { background-color: #F4FAF9; padding: 20px; text-align: center; border-top: 1px solid #e4e4e7; }
            .footer p { margin: 0; font-size: 12px; color: #5B6B6C; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nuevo Lead Web F&D</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Motivo de contacto</span>
                <p class="value" style="font-weight: bold; color: #00A6A6;">${data.reason}</p>
              </div>
              ${clientTypeHtml}
              <div class="field">
                <span class="label">${data.clientType === 'EMPRESA' ? 'Nombre del contacto' : 'Nombre del cliente'}</span>
                <p class="value">${data.fullName}</p>
              </div>
              ${rutHtml}
              ${data.company || data.clientType === 'EMPRESA' ? `
              <div class="field">
                <span class="label">Empresa</span>
                <p class="value">${data.company || 'N/A'}</p>
              </div>
              ` : ''}
              ${companyRutHtml}
              <div class="field">
                <span class="label">Correo Electrónico</span>
                <p class="value"><a href="mailto:${data.email}">${data.email}</a></p>
              </div>
              <div class="field">
                <span class="label">Teléfono</span>
                <p class="value">${data.phone}</p>
              </div>
              ${participantsHtml}
              
              <div class="message-box">
                <span class="label">Mensaje</span>
                <p>${data.message.replace(/\n/g, '<br/>')}</p>
              </div>
            </div>
            <div class="footer">
              <p>Generado automáticamente desde fydingenieria.cl</p>
            </div>
          </div>
        </body>
        </html>
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
