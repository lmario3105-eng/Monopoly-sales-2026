import { NextRequest, NextResponse } from 'next/server';

interface WhatsAppWebhookBody {
  entry: Array<{
    changes: Array<{
      value: {
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
        }>;
      };
    }>;
  }>;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as WhatsAppWebhookBody;

    console.log('[WhatsApp Webhook] Mensaje recibido:', body);

    // Procesar mensajes
    if (body.entry && body.entry[0]?.changes[0]?.value?.messages) {
      const messages = body.entry[0].changes[0].value.messages;

      for (const msg of messages) {
        if (msg.text?.body) {
          const userMessage = msg.text.body;
          const userId = msg.from;

          console.log(`[WhatsApp] Nuevo mensaje de ${userId}: ${userMessage}`);

          // Procesar con bot
          await processBotMessage(userMessage, userId);
        }
      }
    }

    return NextResponse.json({ success: true, status: 'received' });
  } catch (error) {
    console.error('[WhatsApp Webhook Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const hubChallenge = searchParams.get('hub.challenge');

  if (hubChallenge) {
    console.log('[WhatsApp Webhook] Verificación:', hubChallenge);
    return new NextResponse(hubChallenge);
  }

  return NextResponse.json({ success: true, status: 'webhook ready' });
}

async function processBotMessage(message: string, userId: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/bot/commands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        userName: 'WhatsApp User',
        message,
        isAdmin: false,
      }),
    });

    const result = await response.json() as any;
    console.log('[Bot Response]:', result.response);
  } catch (error) {
    console.error('[Bot Processing Error]:', error);
  }
}
