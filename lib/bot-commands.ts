export type CommandType = 'status' | 'stats' | 'top' | 'gift' | 'help' | 'teams' | 'commands';

export interface BotCommand {
  name: CommandType;
  description: string;
  usage: string;
  execute: (args: string[]) => Promise<string>;
}

export interface CommandContext {
  userId: string;
  userName: string;
  isAdmin: boolean;
  teamId?: string;
}

export const COMMAND_PREFIX = '/';

export const commandHelp: Record<CommandType, string> = {
  status: 'Ver estado actual del juego',
  stats: 'Ver estadísticas detalladas',
  top: 'Ver top 10 vendedores',
  gift: 'Enviar regalo a otro jugador',
  help: 'Mostrar esta ayuda',
  teams: 'Ver información de todos los equipos',
  commands: 'Listar todos los comandos disponibles',
};

export const parseCommand = (message: string): { command: CommandType | null; args: string[] } => {
  const trimmed = message.trim();
  if (!trimmed.startsWith(COMMAND_PREFIX)) {
    return { command: null, args: [] };
  }

  const parts = trimmed.slice(COMMAND_PREFIX.length).split(/\s+/);
  const command = parts[0].toLowerCase() as CommandType;
  const args = parts.slice(1);

  return { command, args };
};
