'use server'

import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { prisma } from '@/lib/db';
import { PaymentStatus } from '@prisma/client';

export async function initWebpayRecovery(certificateCode: string) {
  try {
    const cred = await prisma.credential.findUnique({
      where: { validationCode: certificateCode },
      include: { holder: true }
    });
    
    if (!cred || cred.status !== 'VIGENTE') {
      return { success: false, error: 'Credencial no vigente o no encontrada' };
    }

    const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
    const buyOrder = `FYD-${Date.now()}`;
    const sessionId = `SES-${cred.id}`.substring(0, 60); 
    const amount = parseInt(process.env.CERTIFICATE_RECOVERY_AMOUNT_CLP || '12000');
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fydingenieria.cl'}/api/webpay/commit`;

    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    
    // Guardar registro de la intención de pago
    await prisma.credentialRecoveryPayment.create({
      data: {
        credentialId: cred.id,
        amount,
        webpayToken: response.token,
        status: PaymentStatus.INICIADA
      }
    });

    return { success: true, url: response.url, token: response.token };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al iniciar pago en Transbank' };
  }
}
