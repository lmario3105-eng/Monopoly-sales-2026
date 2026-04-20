import { NextRequest, NextResponse } from 'next/server';

interface ConfigStatus {
  verified: boolean;
  webhookUrl: string;
  verifyToken: string;
  timestamp: string;
  environment: {
    whatsappVerifyToken: boolean;
    whatsappAccessToken: boolean;
    whatsappPhoneNumberId: boolean;
    geminiApiKey: boolean;
  };
  instructions: {
    step: number;
    title: string;
    description: string;
    url?: string;
  }[];
}

/**
 * GET /api/whatsapp/sync-status
 * Valida que todo esté sincronizado correctamente con Meta
 */
export async function GET(request: NextRequest): Promise<NextResponse<ConfigStatus>> {
  const webhookUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/api/whatsapp`
    : 'https://[tu-dominio-vercel].vercel.app/api/whatsapp';

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'monopolio_sales_2025';

  const hasAllEnvVars = !!(
    process.env.WHATSAPP_VERIFY_TOKEN &&
    process.env.WHATSAPP_ACCESS_TOKEN &&
    process.env.WHATSAPP_PHONE_NUMBER_ID &&
    process.env.GEMINI_API_KEY
  );

  const config: ConfigStatus = {
    verified: hasAllEnvVars,
    webhookUrl,
    verifyToken,
    timestamp: new Date().toISOString(),
    environment: {
      whatsappVerifyToken: !!process.env.WHATSAPP_VERIFY_TOKEN,
      whatsappAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
      whatsappPhoneNumberId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
      geminiApiKey: !!process.env.GEMINI_API_KEY,
    },
    instructions: [
      {
        step: 1,
        title: 'Crea Aplicación en Meta',
        description: 'Ve a https://developers.facebook.com y crea una nueva aplicación',
        url: 'https://developers.facebook.com/apps',
      },
      {
        step: 2,
        title: 'Agrega Producto WhatsApp',
        description: 'En tu aplicación, agrega el producto "WhatsApp" y configura tu número de teléfono',
        url: 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
      },
      {
        step: 3,
        title: 'Configura el Webhook',
        description: `Pega esta URL en la sección de Webhooks de Meta: ${webhookUrl}`,
        url: webhookUrl,
      },
      {
        step: 4,
        title: 'Usa el Verify Token',
        description: `En Meta, usa este token en el campo "Verify Token": ${verifyToken}`,
      },
      {
        step: 5,
        title: 'Obtén el Access Token',
        description: 'Copia el Access Token permanente de tu aplicación Meta y agrégalo como variable de entorno',
        url: 'https://developers.facebook.com/apps/[tu-app-id]/whatsapp-business/wa-phone-numbers',
      },
      {
        step: 6,
        title: 'Suscríbete al Campo messages',
        description: 'En la configuración del webhook de Meta, suscríbete al campo "messages" para recibir mensajes de WhatsApp',
      },
    ],
  };

  return NextResponse.json(config, { status: 200 });
}
