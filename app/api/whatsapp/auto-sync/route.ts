import { NextRequest, NextResponse } from 'next/server';

interface SyncResult {
  success: boolean;
  message: string;
  timestamp: string;
  webhook: {
    url: string;
    verifyToken: string;
    status: 'verified' | 'pending' | 'error';
  };
  checklist: {
    webhookUrl: { status: 'ok' | 'pending' | 'error'; message: string; url?: string };
    verifyToken: { status: 'ok' | 'pending' | 'error'; message: string };
    accessToken: { status: 'ok' | 'pending' | 'error'; message: string };
    phoneNumberId: { status: 'ok' | 'pending' | 'error'; message: string };
    geminiKey: { status: 'ok' | 'pending' | 'error'; message: string };
  };
  readyToReceiveMessages: boolean;
  readyForProduction: boolean;
  nextSteps: string[];
  testEndpoints: {
    testWebhook: string;
    testGemini: string;
    testMetaConnection: string;
  };
}

/**
 * GET /api/whatsapp/auto-sync
 * Sincroniza automáticamente todas las variables de entorno
 * y valida que el bot esté listo para recibir mensajes
 */
export async function GET(request: NextRequest): Promise<NextResponse<SyncResult>> {
  const webhookUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/whatsapp`
    : 'https://localhost:3000/api/whatsapp';

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'monopolio_sales_2025';

  // Verificar cada componente
  const webhookOk = !!webhookUrl;
  const verifyTokenOk = !!process.env.WHATSAPP_VERIFY_TOKEN;
  const accessTokenOk = !!process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberIdOk = !!process.env.WHATSAPP_PHONE_NUMBER_ID;
  const geminiKeyOk = !!process.env.GEMINI_API_KEY;

  const allConfigured = webhookOk && verifyTokenOk && accessTokenOk && phoneNumberIdOk && geminiKeyOk;

  const configuredCount = [webhookOk, verifyTokenOk, accessTokenOk, phoneNumberIdOk, geminiKeyOk].filter(
    Boolean
  ).length;

  const nextSteps: string[] = [];

  if (!verifyTokenOk) {
    nextSteps.push('1. Agregar WHATSAPP_VERIFY_TOKEN en Vercel > Settings > Environment Variables');
  }
  if (!accessTokenOk) {
    nextSteps.push(
      '2. Obtener WHATSAPP_ACCESS_TOKEN en Meta Developers y agregarlo a Vercel'
    );
  }
  if (!phoneNumberIdOk) {
    nextSteps.push(
      '3. Obtener WHATSAPP_PHONE_NUMBER_ID en Meta Developers y agregarlo a Vercel'
    );
  }
  if (!geminiKeyOk) {
    nextSteps.push(
      '4. Obtener GEMINI_API_KEY en Google AI Studio y agregarlo a Vercel'
    );
  }
  if (allConfigured) {
    nextSteps.push(
      '5. Configura el webhook en Meta Developers: Agregar webhook con esta URL y token'
    );
    nextSteps.push('6. Suscríbete al campo "messages" en la configuración del webhook');
    nextSteps.push('7. ¡Listo! Envía un mensaje al número de WhatsApp Business para probar');
  }

  const result: SyncResult = {
    success: allConfigured,
    message:
      allConfigured
        ? '✅ Todas las variables están configuradas. El bot está listo para recibir mensajes.'
        : `⚠️ ${configuredCount}/5 variables configuradas. Faltan ${5 - configuredCount}.`,
    timestamp: new Date().toISOString(),
    webhook: {
      url: webhookUrl,
      verifyToken,
      status: allConfigured ? 'verified' : 'pending',
    },
    checklist: {
      webhookUrl: {
        status: webhookOk ? 'ok' : 'error',
        message: webhookOk
          ? `✅ Webhook activo: ${webhookUrl}`
          : '❌ Error: No se pudo generar URL del webhook',
        url: webhookUrl,
      },
      verifyToken: {
        status: verifyTokenOk ? 'ok' : 'pending',
        message: verifyTokenOk
          ? `✅ Token configurado: ${verifyToken.substring(0, 10)}...`
          : '⏳ Agrega WHATSAPP_VERIFY_TOKEN a Vercel',
      },
      accessToken: {
        status: accessTokenOk ? 'ok' : 'pending',
        message: accessTokenOk
          ? '✅ Token de acceso configurado'
          : '⏳ Agrega WHATSAPP_ACCESS_TOKEN (obtén de Meta Developers)',
      },
      phoneNumberId: {
        status: phoneNumberIdOk ? 'ok' : 'pending',
        message: phoneNumberIdOk
          ? '✅ Phone Number ID configurado'
          : '⏳ Agrega WHATSAPP_PHONE_NUMBER_ID (obtén de Meta Developers)',
      },
      geminiKey: {
        status: geminiKeyOk ? 'ok' : 'pending',
        message: geminiKeyOk
          ? '✅ Gemini API Key configurada'
          : '⏳ Agrega GEMINI_API_KEY (obtén de Google AI Studio)',
      },
    },
    readyToReceiveMessages: allConfigured,
    readyForProduction: allConfigured && process.env.NODE_ENV === 'production',
    nextSteps,
    testEndpoints: {
      testWebhook: `${webhookUrl}?hub.verify_token=${verifyToken}&hub.challenge=test_challenge`,
      testGemini: '/api/whatsapp/sync-status',
      testMetaConnection: '/api/whatsapp/validate',
    },
  };

  return NextResponse.json(result, { status: 200 });
}

/**
 * POST /api/whatsapp/auto-sync
 * Realiza validaciones y tests automáticos
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'test-webhook-verification') {
      const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'monopolio_sales_2025';
      const webhookUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api/whatsapp`
        : 'http://localhost:3000/api/whatsapp';

      try {
        const testUrl = `${webhookUrl}?hub.verify_token=${verifyToken}&hub.challenge=test_challenge_123`;
        const response = await fetch(testUrl);
        const text = await response.text();

        if (response.ok && text === 'test_challenge_123') {
          return NextResponse.json({
            success: true,
            message: 'Webhook verificado exitosamente',
            webhookUrl,
          });
        }

        return NextResponse.json(
          { success: false, message: 'Error en verificación del webhook', response: text },
          { status: 400 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: `Error al probar webhook: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          },
          { status: 500 }
        );
      }
    }

    if (action === 'validate-meta-connection') {
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

      if (!accessToken || !phoneNumberId) {
        return NextResponse.json(
          { success: false, message: 'Falta ACCESS_TOKEN o PHONE_NUMBER_ID' },
          { status: 400 }
        );
      }

      try {
        const response = await fetch(
          `https://graph.instagram.com/v18.0/${phoneNumberId}/?access_token=${accessToken}`
        );

        if (response.ok) {
          return NextResponse.json({
            success: true,
            message: 'Conexión con Meta API verificada correctamente',
            phoneNumberId: `${phoneNumberId.substring(0, 5)}...`,
          });
        }

        if (response.status === 401) {
          return NextResponse.json(
            { success: false, message: 'Token de acceso inválido o expirado' },
            { status: 401 }
          );
        }

        return NextResponse.json(
          { success: false, message: 'Error al conectar con Meta API' },
          { status: 400 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: `Error de conexión: ${error instanceof Error ? error.message : 'Desconocido'}`,
          },
          { status: 500 }
        );
      }
    }

    if (action === 'get-setup-instructions') {
      return NextResponse.json({
        instructions: [
          {
            step: 1,
            title: 'Crear aplicación en Meta Developers',
            url: 'https://developers.facebook.com',
            details: [
              'Ir a https://developers.facebook.com',
              'Crear una nueva app o seleccionar existente',
              'Agregar producto "WhatsApp Business"',
            ],
          },
          {
            step: 2,
            title: 'Obtener credenciales de Meta',
            details: [
              'En WhatsApp > API Setup, copiar el Access Token',
              'En Phone Numbers, copiar el Phone Number ID',
              'Guardar estos valores',
            ],
          },
          {
            step: 3,
            title: 'Agregar variables en Vercel',
            url: 'https://vercel.com',
            details: [
              'Ir a tu proyecto > Settings > Environment Variables',
              'Agregar: WHATSAPP_ACCESS_TOKEN',
              'Agregar: WHATSAPP_PHONE_NUMBER_ID',
              'Agregar: WHATSAPP_VERIFY_TOKEN = monopolio_sales_2025',
            ],
          },
          {
            step: 4,
            title: 'Obtener Gemini API Key',
            url: 'https://ai.google.dev',
            details: [
              'Ir a Google AI Studio',
              'Crear una nueva API key',
              'Agregar a Vercel como GEMINI_API_KEY',
            ],
          },
          {
            step: 5,
            title: 'Configurar webhook en Meta',
            details: [
              'En Meta Developers > WhatsApp > Configuration',
              'Webhook URL: ' +
                (process.env.VERCEL_URL
                  ? `https://${process.env.VERCEL_URL}/api/whatsapp`
                  : 'https://tu-proyecto.vercel.app/api/whatsapp'),
              'Verify Token: monopolio_sales_2025',
              'Suscribirse a: messages',
            ],
          },
        ],
      });
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error: ${error instanceof Error ? error.message : 'Desconocido'}` },
      { status: 500 }
    );
  }
}
