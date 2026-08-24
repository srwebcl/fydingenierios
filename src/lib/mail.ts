import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendCredentialEmail(
  email: string, 
  holderName: string, 
  pdfBuffer: Buffer, 
  credentialType: 'INFORME_SERVICIO' | 'DIPLOMA_CAPACITACION',
  logoBuffer?: Buffer
) {
  try {
    const isDiploma = credentialType === 'DIPLOMA_CAPACITACION';
    const title = isDiploma ? 'Diploma de Capacitación Oficial' : 'Certificado de Validación de Informe Técnico';
    const sender = process.env.EMAIL_NOTIFICACIONES || 'contacto@fydingenieria.cl';

    const attachments: any[] = [
      {
        filename: isDiploma ? 'Diploma_F&D.pdf' : 'Informe_F&D.pdf',
        content: pdfBuffer,
      }
    ];

    let headerHtml = ``;
    if (logoBuffer) {
      attachments.push({
        filename: 'logo-fyd.png',
        content: logoBuffer,
        contentId: 'logo'
      });
      headerHtml = `<img src="cid:logo" alt="F&D Ingenieros" />`;
    } else {
      headerHtml = `<h2 style="color: #00A6A6; margin: 0;">F&D INGENIEROS</h2>`;
    }

    const { data, error } = await resend.emails.send({
      from: `F&D Ingenieros <${sender}>`,
      to: [email],
      subject: `${title} - F&D Ingenieros`,
      text: `Hola ${holderName},\n\nAdjunto enviamos su ${title} emitido por F&D Ingenieros. Puede validarlo en cualquier momento escaneando el código QR adjunto.\n\nAtentamente,\nF&D Ingenieros`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F4FAF9; color: #0B3B3F; margin: 0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .header { background-color: #FFFFFF; padding: 40px 40px 30px; text-align: center; border-bottom: 4px solid #00A6A6; }
            .header img { max-width: 180px; height: auto; }
            .content { padding: 40px; }
            .title { font-size: 24px; font-weight: bold; color: #00A6A6; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px; }
            .text { font-size: 16px; line-height: 1.6; color: #5B6B6C; margin-bottom: 24px; }
            .highlight { background-color: #F4FAF9; border-left: 4px solid #6EFA3C; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
            .highlight p { margin: 0; font-size: 15px; color: #0B3B3F; }
            .footer { background-color: #F4FAF9; padding: 30px 40px; text-align: center; border-top: 1px solid #e4e4e7; }
            .footer p { margin: 0; font-size: 12px; color: #5B6B6C; line-height: 1.5; }
            .social { margin-top: 15px; font-weight: bold; color: #0B3B3F; font-size: 12px; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              ${headerHtml}
            </div>
            <div class="content">
              <h1 class="title">${title}</h1>
              <p class="text">Estimado/a <strong>${holderName}</strong>,</p>
              <p class="text">Junto con saludar, hacemos entrega formal de su documento adjunto en este correo electrónico, el cual ha sido emitido exitosamente por Ingeniería en Mantenimiento F&D SpA.</p>
              
              <div class="highlight">
                <p><strong>Verificación en Línea</strong><br/>Su documento cuenta con un código QR único. Cualquier supervisor, auditor o mandante puede escanearlo para validar la vigencia y autenticidad del documento directamente en nuestro portal oficial.</p>
              </div>

              <p class="text">Agradecemos su confianza en nuestros servicios.</p>
              <p class="text" style="margin-bottom: 0;">Atentamente,<br/><strong>F&D Ingenieros</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo generado automáticamente, por favor no responda directamente a esta dirección.</p>
              <p class="social">F&D INGENIEROS PLATFORM</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendQuotationEmail(
  email: string, 
  clientName: string,
  quoteNumber: string,
  serviceName: string,
  pdfBuffer: Buffer, 
  logoBuffer?: Buffer,
  senderEmail?: string
) {
  try {
    const sender = process.env.EMAIL_NOTIFICACIONES || 'contacto@fydingenieria.cl';

    const attachments: any[] = [
      {
        filename: `Cotizacion_${quoteNumber}_F&D.pdf`,
        content: pdfBuffer,
      }
    ];

    let headerHtml = ``;
    if (logoBuffer) {
      attachments.push({
        filename: 'logo-fyd.png',
        content: logoBuffer,
        contentId: 'logo'
      });
      headerHtml = `<img src="cid:logo" alt="F&D Ingenieros" />`;
    } else {
      headerHtml = `<h2 style="color: #00A6A6; margin: 0;">F&D INGENIEROS</h2>`;
    }

    const { data, error } = await resend.emails.send({
      from: `F&D Ingenieros <${sender}>`,
      to: [email],
      subject: `Cotización ${quoteNumber}: ${serviceName} - F&D Ingenieros`,
      text: `Hola ${clientName},\n\nAdjunto enviamos nuestra cotización comercial para los servicios solicitados.\n\nAtentamente,\nF&D Ingenieros`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F4FAF9; color: #0B3B3F; margin: 0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .header { background-color: #FFFFFF; padding: 40px 40px 30px; text-align: center; border-bottom: 4px solid #00A6A6; }
            .header img { max-width: 180px; height: auto; }
            .content { padding: 40px; }
            .title { font-size: 24px; font-weight: bold; color: #00A6A6; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.5px; }
            .text { font-size: 16px; line-height: 1.6; color: #5B6B6C; margin-bottom: 24px; }
            .highlight { background-color: #F4FAF9; border-left: 4px solid #6EFA3C; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
            .highlight p { margin: 0; font-size: 15px; color: #0B3B3F; }
            .footer { background-color: #F4FAF9; padding: 30px 40px; text-align: center; border-top: 1px solid #e4e4e7; }
            .footer p { margin: 0; font-size: 12px; color: #5B6B6C; line-height: 1.5; }
            .social { margin-top: 15px; font-weight: bold; color: #0B3B3F; font-size: 12px; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              ${headerHtml}
            </div>
            <div class="content">
              <h1 class="title">Propuesta Comercial</h1>
              <p class="text">Estimado/a <strong>${clientName}</strong>,</p>
              <p class="text">Junto con saludar, hacemos entrega formal de nuestra cotización adjunta en formato PDF para el servicio de <strong>${serviceName}</strong>.</p>
              
              <div class="highlight">
                <p><strong>Vigencia</strong><br/>Recuerde que esta cotización tiene una vigencia de 30 días desde su emisión. Si tiene cualquier duda técnica o comercial, puede responder directamente a este correo.</p>
              </div>

              <p class="text">Agradecemos su interés en nuestros servicios.</p>
              <p class="text" style="margin-bottom: 0;">Atentamente,<br/><strong>F&D Ingenieros</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo oficial, puede responder directamente a esta dirección para comunicarse con el ejecutivo asignado.</p>
              <p class="social">F&D INGENIEROS PLATFORM</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendQuotationSentNotificationEmail(
  senderEmail: string,
  clientName: string,
  clientEmail: string,
  quoteNumber: string
) {
  try {
    const sender = process.env.EMAIL_NOTIFICACIONES || 'contacto@fydingenieria.cl';

    const { data, error } = await resend.emails.send({
      from: `Plataforma F&D <${sender}>`,
      to: [senderEmail],
      subject: `Notificación: Cotización ${quoteNumber} enviada con éxito`,
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
            .text { font-size: 16px; line-height: 1.6; color: #5B6B6C; margin-bottom: 24px; }
            .highlight { background-color: #F4FAF9; border-left: 4px solid #6EFA3C; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
            .highlight p { margin: 0; font-size: 15px; color: #0B3B3F; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Confirmación de Envío</h2>
            </div>
            <div class="content">
              <p class="text">La plataforma ha enviado exitosamente la <strong>Cotización ${quoteNumber}</strong>.</p>
              
              <div class="highlight">
                <p><strong>Destinatario:</strong> ${clientName}<br/>
                <strong>Correo enviado a:</strong> ${clientEmail}</p>
              </div>

              <p class="text">El cliente ya recibió el correo oficial con el PDF adjunto de la propuesta comercial.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error in notification:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send notification email:', error);
    return { success: false, error };
  }
}

