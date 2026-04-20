import { NextRequest, NextResponse } from 'next/server';
import { parseWhatsAppMessage } from '@/lib/whatsapp-bot';
import * as db from '@/lib/database';

// Inicializar datos demo
db.initializeDemoData();

// POST: Simular mensaje de WhatsApp en modo sandbox
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, userName, message } = body;

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Se requiere phoneNumber y message' },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.trim();
    const cleanMessage = message.trim();
    const cleanName = (userName || 'Usuario Prueba').trim();

    // Crear usuario si no existe
    let user = db.getUserByPhone(cleanPhone);
    if (!user) {
      user = db.createUser({
        name: cleanName,
        phoneNumber: cleanPhone,
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

    // Procesar mensaje con la lógica real del bot
    const responseText = await parseWhatsAppMessage(cleanPhone, cleanName, cleanMessage);

    // Registrar notificación de respuesta
    db.createNotification({
      userId: user.id,
      phoneNumber: cleanPhone,
      message: responseText,
      type: 'admin',
      sent: true,
      sentAt: new Date(),
    } as any);

    return NextResponse.json({
      success: true,
      userPhone: cleanPhone,
      userName: user.name,
      incomingMessage: cleanMessage,
      botResponse: responseText,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        zone: user.zone,
        salesPoints: user.salesPoints,
        recruits: user.recruits,
        teamId: user.teamId,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[WhatsApp Test Error]:', error);
    return NextResponse.json(
      { error: 'Error procesando mensaje de prueba', details: String(error) },
      { status: 500 }
    );
  }
}
