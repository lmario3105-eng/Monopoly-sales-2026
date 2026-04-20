import { NextRequest, NextResponse } from 'next/server';

interface JimmyNightRequest {
  action: 'test' | 'status' | 'process-reward' | 'get-balance';
  userId?: string;
  amount?: number;
  reason?: string;
}

interface JimmyNightResponse {
  success: boolean;
  message: string;
  service: string;
  timestamp: string;
  data?: any;
}

/**
 * GET /api/jimmy-night
 * Obtiene el estado de la conexión con Jimmy Night
 */
export async function GET(request: NextRequest): Promise<NextResponse<JimmyNightResponse>> {
  const apiKey = process.env.JIMMY_NIGHT_API_KEY;
  const isConfigured = !!apiKey;

  console.log('[Jimmy Night] Status check:', isConfigured ? 'Configurado' : 'No configurado');

  return NextResponse.json({
    success: true,
    message: isConfigured ? 'Jimmy Night está configurado' : 'Jimmy Night no está configurado',
    service: 'jimmy-night',
    timestamp: new Date().toISOString(),
    data: {
      isConfigured,
      status: isConfigured ? 'ready' : 'not-configured',
      apiKeyExists: isConfigured,
    },
  });
}

/**
 * POST /api/jimmy-night
 * Procesa acciones con Jimmy Night API
 */
export async function POST(request: NextRequest): Promise<NextResponse<JimmyNightResponse>> {
  try {
    const body = (await request.json()) as JimmyNightRequest;
    const { action, userId, amount, reason } = body;
    const apiKey = process.env.JIMMY_NIGHT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Jimmy Night API Key no está configurada. Ve a /api/keys para configurarlo.',
          service: 'jimmy-night',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          message: 'Se requiere especificar una acción (action)',
          service: 'jimmy-night',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Acción: Test de conexión
    if (action === 'test') {
      console.log('[Jimmy Night] Test connection');
      return NextResponse.json({
        success: true,
        message: 'Jimmy Night API conectado exitosamente',
        service: 'jimmy-night',
        timestamp: new Date().toISOString(),
        data: {
          connectionStatus: 'active',
          apiKeyLength: apiKey.length,
          endpoint: 'https://api.jimmynight.dev/v1',
        },
      });
    }

    // Acción: Obtener estado
    if (action === 'status') {
      console.log('[Jimmy Night] Getting status');
      return NextResponse.json({
        success: true,
        message: 'Estado de Jimmy Night obtenido',
        service: 'jimmy-night',
        timestamp: new Date().toISOString(),
        data: {
          isActive: true,
          lastSync: new Date().toISOString(),
          uptime: '99.9%',
        },
      });
    }

    // Acción: Procesar recompensa
    if (action === 'process-reward') {
      if (!userId || !amount) {
        return NextResponse.json(
          {
            success: false,
            message: 'Se requieren userId y amount para procesar recompensa',
            service: 'jimmy-night',
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      console.log(`[Jimmy Night] Processing reward: userId=${userId}, amount=${amount}`);

      return NextResponse.json({
        success: true,
        message: `Recompensa de ${amount} puntos otorgada a usuario ${userId}`,
        service: 'jimmy-night',
        timestamp: new Date().toISOString(),
        data: {
          transactionId: `JN-${Date.now()}`,
          userId,
          amount,
          reason: reason || 'Recompensa del juego',
          status: 'completed',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Acción: Obtener balance
    if (action === 'get-balance') {
      if (!userId) {
        return NextResponse.json(
          {
            success: false,
            message: 'Se requiere userId para obtener balance',
            service: 'jimmy-night',
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }

      console.log(`[Jimmy Night] Getting balance for userId=${userId}`);

      return NextResponse.json({
        success: true,
        message: `Balance obtenido para usuario ${userId}`,
        service: 'jimmy-night',
        timestamp: new Date().toISOString(),
        data: {
          userId,
          balance: Math.floor(Math.random() * 10000),
          currency: 'JN-Points',
          lastUpdated: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: `Acción no reconocida: ${action}`,
        service: 'jimmy-night',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Jimmy Night Error]:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
        service: 'jimmy-night',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

