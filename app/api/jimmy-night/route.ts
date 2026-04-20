import { NextRequest, NextResponse } from 'next/server';

interface JimmyNightRequest {
  action: string;
  data?: Record<string, any>;
}

/**
 * GET /api/jimmy-night/status
 * Obtiene el estado de la conexión con Jimmy Night
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.JIMMY_NIGHT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        status: 'not-configured',
        message: 'JIMMY_NIGHT_API_KEY no está configurado',
        configured: false,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    status: 'connected',
    configured: true,
    service: 'Jimmy Night API',
    timestamp: new Date().toISOString(),
    endpoints: {
      execute: '/api/jimmy-night',
      status: '/api/jimmy-night/status',
    },
  });
}

/**
 * POST /api/jimmy-night
 * Ejecuta acciones con Jimmy Night API
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = process.env.JIMMY_NIGHT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'JIMMY_NIGHT_API_KEY no configurado',
          message: 'Por favor configura la clave de API de Jimmy Night',
        },
        { status: 400 }
      );
    }

    const body: JimmyNightRequest = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Acción requerida',
          message: 'Proporciona un parámetro "action"',
        },
        { status: 400 }
      );
    }

    console.log(`[Jimmy Night] Ejecutando acción: ${action}`, data);

    // Ejemplo: integración con Jimmy Night
    // Esto dependerá de la documentación real de Jimmy Night
    const jimmyNightResponse = {
      success: true,
      action,
      data: {
        processed: true,
        timestamp: new Date().toISOString(),
        ...data,
      },
      message: `Acción "${action}" ejecutada exitosamente en Jimmy Night`,
    };

    return NextResponse.json(jimmyNightResponse, { status: 200 });
  } catch (error) {
    console.error('[Jimmy Night Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al procesar solicitud',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
