import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/whatsapp-types';
import type { WhatsAppUser } from '@/lib/whatsapp-types';
import crypto from 'crypto';

interface RegisterRequest {
  phoneNumber: string;
}

interface VerifyRequest {
  userId: string;
  verificationCode: string;
}

// Generar código de verificación (6 dígitos)
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generar ID único
function generateUserId(): string {
  return `wa_${crypto.randomUUID().substring(0, 12)}`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'register') {
      const body = (await request.json()) as RegisterRequest;
      const { phoneNumber } = body;

      if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
        return NextResponse.json(
          { error: 'Número de teléfono inválido' },
          { status: 400 }
        );
      }

      // Verificar si el usuario ya existe
      const existingUser = dataStore.getUserByPhone(phoneNumber);
      if (existingUser && existingUser.isVerified) {
        return NextResponse.json(
          { error: 'Este número ya está registrado' },
          { status: 400 }
        );
      }

      // Crear nuevo usuario
      const verificationCode = generateVerificationCode();
      const userId = generateUserId();

      const newUser: WhatsAppUser = {
        id: userId,
        phoneNumber,
        verificationCode,
        isVerified: false,
        createdAt: new Date(),
        conversationHistory: [],
      };

      dataStore.addWhatsAppUser(newUser);

      // TODO: Enviar código por SMS o WhatsApp en producción
      console.log(
        `[WhatsApp] Código de verificación para ${phoneNumber}: ${verificationCode}`
      );

      return NextResponse.json(
        {
          success: true,
          userId,
          message: 'Código de verificación enviado. Por favor, verifica tu número.',
          verificationCode, // Solo en desarrollo - remover en producción
        },
        { status: 201 }
      );
    } else if (action === 'verify') {
      const body = (await request.json()) as VerifyRequest;
      const { userId, verificationCode } = body;

      if (!userId || !verificationCode) {
        return NextResponse.json(
          { error: 'Parámetros incompletos' },
          { status: 400 }
        );
      }

      const isVerified = dataStore.verifyUser(userId, verificationCode);

      if (!isVerified) {
        return NextResponse.json(
          { error: 'Código de verificación incorrecto' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Número verificado correctamente. Ahora puedes usar WhatsApp.',
        },
        { status: 200 }
      );
    } else if (action === 'status') {
      const userId = url.searchParams.get('userId');

      if (!userId) {
        return NextResponse.json(
          { error: 'userId requerido' },
          { status: 400 }
        );
      }

      // En producción, buscar en base de datos
      return NextResponse.json(
        {
          connected: true,
          lastSync: new Date().toISOString(),
          messagesSynced: 42,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[WhatsApp API]:', error);
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
}
