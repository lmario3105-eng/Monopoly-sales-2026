import { NextRequest, NextResponse } from 'next/server';

interface SendGiftRequest {
  fromPlayerId: string;
  toPlayerId: string;
  amount: number;
  message?: string;
}

interface GiftResponse {
  success: boolean;
  message: string;
  giftId: string;
  timestamp: string;
}

/**
 * POST /api/gift-hood/send
 * Envía un regalo de un jugador a otro
 */
export async function POST(request: NextRequest): Promise<NextResponse<GiftResponse>> {
  try {
    const body = (await request.json()) as SendGiftRequest;
    const { fromPlayerId, toPlayerId, amount, message } = body;

    if (!fromPlayerId || !toPlayerId || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Se requieren: fromPlayerId, toPlayerId, amount',
          giftId: '',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'La cantidad debe ser mayor a 0',
          giftId: '',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const giftId = `GIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[Gift Hood] Regalo enviado: ${giftId}`, {
      from: fromPlayerId,
      to: toPlayerId,
      amount,
      message,
    });

    return NextResponse.json({
      success: true,
      message: `Regalo de ${amount} puntos enviado exitosamente`,
      giftId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Gift Hood Error]:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
        giftId: '',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
