import { NextRequest, NextResponse } from 'next/server';

interface SetupGuide {
  stage: string;
  isComplete: boolean;
  currentStep: number;
  totalSteps: number;
  details: {
    webhook: {
      url: string;
      status: string;
      instructions: string;
    };
    verification: {
      token: string;
      status: string;
      instructions: string;
    };
    credentials: {
      accessToken: {
        status: string;
        instructions: string;
      };
      phoneNumberId: {
        status: string;
        instructions: string;
      };
    };
    subscription: {
      status: string;
      instructions: string;
    };
  };
  nextAction: string;
}

/**
 * GET /api/whatsapp/setup-guide
 * Proporciona una guía paso a paso del proceso de configuración
 */
export async function GET(request: NextRequest): Promise<NextResponse<SetupGuide>> {
  const webhookUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/api/whatsapp`
    : 'https://vm-6pygkfjraxktw7mx1t.vercel.app/api/whatsapp'; // URL de la imagen

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'monopolio_sales_2025';

  // Verificar cuál es el estado actual
  const accessTokenOk = !!process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberIdOk = !!process.env.WHATSAPP_PHONE_NUMBER_ID;
  const subscriptionOk = !!process.env.WHATSAPP_ACCESS_TOKEN; // Asumimos que si hay token, hay subscripción

  let currentStep = 1;
  let isComplete = false;

  if (webhookUrl) currentStep = 2;
  if (verifyToken) currentStep = 3;
  if (accessTokenOk) currentStep = 4;
  if (phoneNumberIdOk) currentStep = 5;
  if (subscriptionOk) {
    currentStep = 6;
    isComplete = true;
  }

  const guide: SetupGuide = {
    stage: isComplete ? 'COMPLETADO' : 'EN PROGRESO',
    isComplete,
    currentStep,
    totalSteps: 6,
    details: {
      webhook: {
        url: webhookUrl,
        status: currentStep >= 2 ? 'ACTIVO' : 'PENDIENTE',
        instructions: `Copia esta URL y pégala en Meta Developers > Tu App > WhatsApp > Configuración > URL del Webhook:\n\n${webhookUrl}`,
      },
      verification: {
        token: verifyToken,
        status: currentStep >= 3 ? 'ACTIVO' : 'PENDIENTE',
        instructions: `En Meta Developers, en la sección de Verify Token, pega este valor:\n\n${verifyToken}`,
      },
      credentials: {
        accessToken: {
          status: accessTokenOk ? 'CONFIGURADO' : 'PENDIENTE',
          instructions: 'Obtén tu Access Token de Meta Developers y agrégalo como variable de entorno: WHATSAPP_ACCESS_TOKEN',
        },
        phoneNumberId: {
          status: phoneNumberIdOk ? 'CONFIGURADO' : 'PENDIENTE',
          instructions: 'Obtén el ID de tu número de teléfono y agrégalo como variable de entorno: WHATSAPP_PHONE_NUMBER_ID',
        },
      },
      subscription: {
        status: subscriptionOk ? 'SUSCRITO' : 'PENDIENTE',
        instructions: 'En Meta Developers, suscríbete al campo "messages" para recibir mensajes de WhatsApp entrantes',
      },
    },
    nextAction: isComplete
      ? 'Enviá un mensaje a tu número de WhatsApp para probar el bot'
      : currentStep === 1
      ? 'Copia la URL del webhook y ve a Meta Developers'
      : currentStep === 2
      ? 'Pega el Verify Token en Meta Developers'
      : currentStep === 3
      ? 'Agrega el Access Token como variable de entorno en Vercel'
      : currentStep === 4
      ? 'Agrega el Phone Number ID como variable de entorno en Vercel'
      : 'Suscríbete al campo messages en Meta Developers',
  };

  return NextResponse.json(guide, { status: 200 });
}
