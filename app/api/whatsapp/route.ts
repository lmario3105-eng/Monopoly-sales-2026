import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/gemini-ai';
import * as db from '@/lib/database';

db.initializeDemoData();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.entry?.[0]?.changes?.[0]?.value?.messages) {
      console.log('[WhatsApp] Webhook recibido sin mensajes');
      return NextResponse.json({ status: 'received' });
    }

    const message = body.entry[0].changes[0].value.messages[0];
    const contact = body.entry[0].changes[0].value.contacts[0];
    const phoneNumber: string = message.from;
    const userName: string = contact?.profile?.name || 'Usuario';
    const messageText: string = message.text?.body || '';

    console.log(`[WhatsApp] Mensaje de ${userName} (${phoneNumber}): "${messageText}"`);

    let user = db.getUserByPhone(phoneNumber);
    if (!user) {
      console.log(`[WhatsApp] Nuevo usuario registrado: ${userName}`);
      user = db.createUser({
        name: userName,
        phoneNumber,
        role: 'player',
        teamId: 'leon',
        zone: 'A',
        salesPoints: 0,
        recruits: 0,
        isConnectedToWhatsApp: true,
      });
    } else {
      db.updateUser(user.id, {
        lastActiveWhatsApp: new Date(),
        isConnectedToWhatsApp: true,
      });
    }

    const userContext = {
      salesPoints: user.salesPoints,
      zone: user.zone,
      recruits: user.recruits,
    };

    const responseText = await generateAIResponse(messageText, userName, userContext);

    db.createNotification({
      userId: user.id,
      phoneNumber,
      message: responseText,
      type: 'admin',
      sent: false,
    });

    console.log(`[WhatsApp] Respuesta enviada a ${userName}`);

    return NextResponse.json({
      status: 'processed',
      response: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[WhatsApp Error]:', error);
    return NextResponse.json(
      {
        error: 'Error procesando mensaje',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'monopolio_sales_2025';
  const WEBHOOK_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/whatsapp`
    : 'https://localhost:3000/api/whatsapp';

  if (searchParams.has('hub.verify_token')) {
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    console.log('[WhatsApp] Webhook verification attempt');

    if (token === VERIFY_TOKEN) {
      console.log('[WhatsApp] ✅ Webhook verificado exitosamente');
      return new NextResponse(challenge, { status: 200 });
    }

    console.error('[WhatsApp] ❌ Token inválido');
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  const dbState = db.getDatabaseState();

  return NextResponse.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    webhook: {
      url: WEBHOOK_URL,
      verifyTokenSet: !!process.env.WHATSAPP_VERIFY_TOKEN,
      accessTokenSet: !!process.env.WHATSAPP_ACCESS_TOKEN,
      phoneNumberIdSet: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
    },
    ai: {
      geminiEnabled: !!process.env.GEMINI_API_KEY,
      geminiModel: 'gemini-pro',
    },
    database: dbState,
    readyToReceive:
      !!process.env.WHATSAPP_VERIFY_TOKEN &&
      !!process.env.WHATSAPP_ACCESS_TOKEN &&
      !!process.env.WHATSAPP_PHONE_NUMBER_ID,
  });
}
