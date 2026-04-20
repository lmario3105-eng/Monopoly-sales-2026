import { NextRequest, NextResponse } from 'next/server';

interface ApiKeyStatus {
  service: 'gemini' | 'jimmy-night';
  isConfigured: boolean;
  status: 'active' | 'not-configured' | 'invalid';
  lastChecked: string;
}

/**
 * GET /api/keys?service=gemini|jimmy-night
 * Obtiene el estado de una clave API
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiKeyStatus>> {
  const searchParams = request.nextUrl.searchParams;
  const service = searchParams.get('service') as 'gemini' | 'jimmy-night' | null;

  if (!service || !['gemini', 'jimmy-night'].includes(service)) {
    return NextResponse.json(
      {
        service: 'unknown' as any,
        isConfigured: false,
        status: 'invalid',
        lastChecked: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  const envVarName = service === 'gemini' ? 'GEMINI_API_KEY' : 'JIMMY_NIGHT_API_KEY';
  const isConfigured = !!process.env[envVarName];

  console.log(`[API Keys] ${service} status check: ${isConfigured ? 'Configurado' : 'No configurado'}`);

  return NextResponse.json({
    service,
    isConfigured,
    status: isConfigured ? 'active' : 'not-configured',
    lastChecked: new Date().toISOString(),
  });
}

/**
 * POST /api/keys
 * Devuelve instrucciones para configurar las claves
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { action, service } = body;

    if (action === 'get-instructions') {
      return NextResponse.json({
        success: true,
        instructions: {
          gemini: {
            provider: 'Google AI Studio',
            url: 'https://aistudio.google.com',
            steps: [
              '1. Ve a https://aistudio.google.com',
              '2. Click en "Get API Key"',
              '3. Copia la clave completa',
              '4. Agrega en Vercel Settings → Environment Variables',
              '5. Name: GEMINI_API_KEY',
              '6. Redeploy',
            ],
          },
          'jimmy-night': {
            provider: 'Jimmy Night API',
            url: 'https://jimmynight.dev',
            steps: [
              '1. Ve a https://jimmynight.dev',
              '2. Obtén tu API Key en el dashboard',
              '3. Copia la clave completa',
              '4. Agrega en Vercel Settings → Environment Variables',
              '5. Name: JIMMY_NIGHT_API_KEY',
              '6. Redeploy',
            ],
          },
        },
      });
    }

    if (action === 'status') {
      const geminiConfigured = !!process.env.GEMINI_API_KEY;
      const jimmyNightConfigured = !!process.env.JIMMY_NIGHT_API_KEY;

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        services: {
          gemini: {
            isConfigured: geminiConfigured,
            status: geminiConfigured ? 'active' : 'not-configured',
          },
          'jimmy-night': {
            isConfigured: jimmyNightConfigured,
            status: jimmyNightConfigured ? 'active' : 'not-configured',
          },
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Acción no reconocida',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('[API Keys Error]:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
      },
      { status: 500 }
    );
  }
}

