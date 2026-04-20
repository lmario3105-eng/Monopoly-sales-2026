import { NextRequest, NextResponse } from 'next/server';
import { processMessageWithAI, BotContext } from '@/lib/bot-integration';
import { parseCommand, commandHelp } from '@/lib/bot-commands';

interface BotCommandRequest {
  userId: string;
  userName: string;
  message: string;
  teamName?: string;
  isAdmin?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as BotCommandRequest;
    const { userId, userName, message, teamName, isAdmin = false } = body;

    if (!userId || !message) {
      return NextResponse.json(
        { success: false, message: 'userId y message son requeridos' },
        { status: 400 }
      );
    }

    // Parsear comando
    const { command, args } = parseCommand(message);

    // Si es un comando
    if (command) {
      let response = '';

      switch (command) {
        case 'help':
        case 'commands':
          response = '📋 **COMANDOS DISPONIBLES:**\n\n';
          Object.entries(commandHelp).forEach(([cmd, desc]) => {
            response += `/${cmd} - ${desc}\n`;
          });
          break;

        case 'status':
          response = `✅ **ESTADO DEL JUEGO:**\n\n🎮 El juego está activo\n👤 Usuario: ${userName}\n🏆 Equipo: ${teamName || 'N/A'}\n⏰ Última sincronización: Ahora`;
          break;

        case 'teams':
          response = `🏆 **EQUIPOS EN JUEGO:**\n\n🦁 León\n🐯 Tigre\n🦅 Águila\n🐍 Serpiente\n\nUsa /stats para más detalles`;
          break;

        case 'top':
          response = `🥇 **TOP VENDEDORES:**\n\n1. Juan Pérez (León) - 15,500 pts\n2. María García (Tigre) - 14,200 pts\n3. Carlos López (Águila) - 13,800 pts\n\nUsa /stats para más`;
          break;

        case 'gift':
          if (args.length < 2) {
            response = `❌ Uso: /gift @usuario cantidad\nEjemplo: /gift @juan 100`;
          } else {
            response = `🎁 Regalo enviado a ${args[0]} por ${args[1]} puntos!`;
          }
          break;

        case 'stats':
          response = `📊 **ESTADÍSTICAS:**\n\n🦁 León: 45,200 puntos\n🐯 Tigre: 43,100 puntos\n🦅 Águila: 41,900 puntos\n🐍 Serpiente: 39,800 puntos\n\nUsa /top para ranking`;
          break;

        default:
          response = `❌ Comando no reconocido: /${command}\nUsa /help para ver todos los comandos`;
      }

      return NextResponse.json({
        success: true,
        response,
        type: 'command',
        command,
      });
    }

    // Si no es comando, procesar con IA
    const context: BotContext = {
      userId,
      userName,
      teamName,
      isAdmin,
      conversationHistory: [],
    };

    const aiResponse = await processMessageWithAI(message, context);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      type: 'ai',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Bot Commands Error]:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
      },
      { status: 500 }
    );
  }
}
