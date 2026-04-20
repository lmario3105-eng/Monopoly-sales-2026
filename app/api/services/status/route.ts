import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/services/status
 * Obtiene el estado de todos los servicios disponibles
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const jimmyNightKey = process.env.JIMMY_NIGHT_API_KEY;

  const services = {
    gemini: {
      name: 'Google Gemini',
      configured: !!geminiKey,
      status: geminiKey ? 'active' : 'not-configured',
      type: 'AI',
      description: 'Procesamiento de lenguaje natural y generación de respuestas',
      endpoint: '/api/chat',
    },
    'jimmy-night': {
      name: 'Jimmy Night API',
      configured: !!jimmyNightKey,
      status: jimmyNightKey ? 'active' : 'not-configured',
      type: 'External Service',
      description: 'Servicio externo integrado',
      endpoint: '/api/jimmy-night',
    },
    whatsapp: {
      name: 'WhatsApp Business API',
      configured: !!process.env.WHATSAPP_ACCESS_TOKEN,
      status: process.env.WHATSAPP_ACCESS_TOKEN ? 'active' : 'not-configured',
      type: 'Messaging',
      description: 'Integración con WhatsApp Business',
      endpoint: '/api/whatsapp',
    },
  };

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    services,
    summary: {
      total: Object.keys(services).length,
      configured: Object.values(services).filter((s: any) => s.configured).length,
      notConfigured: Object.values(services).filter((s: any) => !s.configured).length,
    },
  });
}
