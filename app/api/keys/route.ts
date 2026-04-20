import { NextRequest, NextResponse } from 'next/server';

interface ApiKeyConfig {
  service: 'gemini' | 'jimmy-night';
  key: string;
  lastUpdated: string;
  status: 'active' | 'invalid' | 'expired';
}

interface ApiKeyResponse {
  success: boolean;
  message: string;
  data?: {
    service: string;
    status: string;
    lastUpdated: string;
  };
}

// Almacenamiento en memoria (en producción usar BD o Vault)
const apiKeyStore = new Map<string, ApiKeyConfig>();

/**
 * GET /api/keys/status
 * Obtiene el estado de todas las claves API configuradas
 */
export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  const searchParams = request.nextUrl.searchParams;
  const service = searchParams.get('service') as 'gemini' | 'jimmy-night' | null;
  const adminToken = searchParams.get('token');

  // Validar token admin
  if (!adminToken || adminToken !== process.env.ADMIN_API_TOKEN) {
    return NextResponse.json(
      { error: 'Token no autorizado' },
      { status: 401 }
    );
  }

  if (service) {
    const config = apiKeyStore.get(service);
    if (!config) {
      return NextResponse.json(
        {
          service,
          status: 'not-configured',
          message: `${service} no está configurado`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      service,
      status: config.status,
      lastUpdated: config.lastUpdated,
      keyPreview: `${config.key.substring(0, 4)}...${config.key.substring(config.key.length - 4)}`,
    });
  }

  // Retornar estado de todas las claves
  const status = {
    gemini: apiKeyStore.get('gemini') ? 'configured' : 'not-configured',
    'jimmy-night': apiKeyStore.get('jimmy-night') ? 'configured' : 'not-configured',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(status);
}

/**
 * POST /api/keys/set
 * Configura una nueva clave API
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiKeyResponse>> {
  try {
    const body = await request.json();
    const { service, key, adminToken } = body;

    // Validar token admin
    if (!adminToken || adminToken !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Token no autorizado' },
        { status: 401 }
      );
    }

    // Validar entrada
    if (!service || !key) {
      return NextResponse.json(
        { success: false, message: 'Faltan parámetros: service y key requeridos' },
        { status: 400 }
      );
    }

    if (!['gemini', 'jimmy-night'].includes(service)) {
      return NextResponse.json(
        { success: false, message: 'Servicio no válido. Use: gemini o jimmy-night' },
        { status: 400 }
      );
    }

    // Validar que la clave no esté vacía
    if (key.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'La clave es muy corta. Mínimo 10 caracteres.' },
        { status: 400 }
      );
    }

    // Guardar en almacenamiento
    const config: ApiKeyConfig = {
      service,
      key: key.trim(),
      lastUpdated: new Date().toISOString(),
      status: 'active',
    };

    apiKeyStore.set(service, config);

    // También guardar en variables de entorno si es posible (requiere reinicio)
    if (service === 'gemini') {
      process.env.GEMINI_API_KEY = key.trim();
    } else if (service === 'jimmy-night') {
      process.env.JIMMY_NIGHT_API_KEY = key.trim();
    }

    console.log(`[API Keys] ${service} configurado exitosamente`);

    return NextResponse.json(
      {
        success: true,
        message: `Clave de ${service} configurada exitosamente`,
        data: {
          service,
          status: config.status,
          lastUpdated: config.lastUpdated,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API Keys Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: `Error al configurar clave: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/keys/delete
 * Elimina una clave API
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiKeyResponse>> {
  try {
    const body = await request.json();
    const { service, adminToken } = body;

    // Validar token admin
    if (!adminToken || adminToken !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Token no autorizado' },
        { status: 401 }
      );
    }

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Parámetro service requerido' },
        { status: 400 }
      );
    }

    if (!apiKeyStore.has(service)) {
      return NextResponse.json(
        { success: false, message: `${service} no está configurado` },
        { status: 404 }
      );
    }

    apiKeyStore.delete(service);
    delete (process.env as any)[`${service.toUpperCase()}_API_KEY`];

    console.log(`[API Keys] ${service} eliminado`);

    return NextResponse.json({
      success: true,
      message: `Clave de ${service} eliminada exitosamente`,
    });
  } catch (error) {
    console.error('[API Keys Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: `Error al eliminar clave: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      },
      { status: 500 }
    );
  }
}
