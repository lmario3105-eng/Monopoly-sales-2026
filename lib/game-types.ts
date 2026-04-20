// Monopolio de Ventas: Montería Edition - Types

export type TeamId = 'leon' | 'tigre' | 'aguila' | 'serpiente';

export type TileType = 
  | 'vape' 
  | 'destilado' 
  | 'ropa' 
  | 'accesorios' 
  | 'comodin' 
  | 'recompensa' 
  | 'evento'
  | 'inicio';

export type Zone = 'A' | 'B' | 'C' | 'D';

export interface Tile {
  id: number;
  type: TileType;
  name: string;
  zone: Zone;
  points: number;
  x: number;
  y: number;
}

export interface Team {
  id: TeamId;
  name: string;
  icon: string;
  position: number;
  points: number;
  rolls: number;
  comodines: number;
  color: string;
  affinity: TileType[];
}

export interface ActivityItem {
  id: string;
  timestamp: Date;
  teamId: TeamId;
  message: string;
  type: 'move' | 'points' | 'comodin' | 'event' | 'reward' | 'roll';
  points?: number;
}

export interface GameState {
  teams: Team[];
  currentTeamIndex: number;
  tiles: Tile[];
  activities: ActivityItem[];
  isRolling: boolean;
  lastRoll: number | null;
  gameStarted: boolean;
  elapsedTime: number;
}

// Team definitions
export const TEAMS: Team[] = [
  {
    id: 'leon',
    name: 'León',
    icon: '🦁',
    position: 0,
    points: 0,
    rolls: 1,
    comodines: 0,
    color: 'team-leon',
    affinity: ['destilado', 'accesorios'],
  },
  {
    id: 'tigre',
    name: 'Tigre',
    icon: '🐯',
    position: 0,
    points: 0,
    rolls: 1,
    comodines: 0,
    color: 'team-tigre',
    affinity: ['vape', 'ropa'],
  },
  {
    id: 'aguila',
    name: 'Águila',
    icon: '🦅',
    position: 0,
    points: 0,
    rolls: 1,
    comodines: 0,
    color: 'team-aguila',
    affinity: ['ropa', 'accesorios'],
  },
  {
    id: 'serpiente',
    name: 'Serpiente',
    icon: '🐍',
    position: 0,
    points: 0,
    rolls: 1,
    comodines: 0,
    color: 'team-serpiente',
    affinity: ['vape', 'destilado'],
  },
];

// Board tiles for Montería
export const BOARD_TILES: Tile[] = [
  // Zone A - Top row (left to right)
  { id: 0, type: 'inicio', name: 'Inicio', zone: 'A', points: 0, x: 0, y: 0 },
  { id: 1, type: 'vape', name: 'Centro', zone: 'A', points: 100, x: 1, y: 0 },
  { id: 2, type: 'comodin', name: 'Comodín', zone: 'A', points: 0, x: 2, y: 0 },
  { id: 3, type: 'destilado', name: 'La Castellana', zone: 'A', points: 120, x: 3, y: 0 },
  { id: 4, type: 'evento', name: 'Evento', zone: 'A', points: 0, x: 4, y: 0 },
  { id: 5, type: 'ropa', name: 'Alamedas', zone: 'A', points: 110, x: 5, y: 0 },
  
  // Zone B - Right column (top to bottom)
  { id: 6, type: 'recompensa', name: 'Recompensa', zone: 'B', points: 0, x: 5, y: 1 },
  { id: 7, type: 'accesorios', name: 'Villa del Río', zone: 'B', points: 90, x: 5, y: 2 },
  { id: 8, type: 'vape', name: 'El Recreo', zone: 'B', points: 100, x: 5, y: 3 },
  { id: 9, type: 'comodin', name: 'Comodín', zone: 'B', points: 0, x: 5, y: 4 },
  { id: 10, type: 'destilado', name: 'P-5', zone: 'B', points: 130, x: 5, y: 5 },
  
  // Zone C - Bottom row (right to left)
  { id: 11, type: 'evento', name: 'Evento', zone: 'C', points: 0, x: 4, y: 5 },
  { id: 12, type: 'ropa', name: 'La Julia', zone: 'C', points: 100, x: 3, y: 5 },
  { id: 13, type: 'recompensa', name: 'Recompensa', zone: 'C', points: 0, x: 2, y: 5 },
  { id: 14, type: 'accesorios', name: 'Buenavista', zone: 'C', points: 110, x: 1, y: 5 },
  { id: 15, type: 'vape', name: 'Mocarí', zone: 'C', points: 95, x: 0, y: 5 },
  
  // Zone D - Left column (bottom to top)
  { id: 16, type: 'comodin', name: 'Comodín', zone: 'D', points: 0, x: 0, y: 4 },
  { id: 17, type: 'destilado', name: 'Los Garzones', zone: 'D', points: 85, x: 0, y: 3 },
  { id: 18, type: 'evento', name: 'Evento', zone: 'D', points: 0, x: 0, y: 2 },
  { id: 19, type: 'ropa', name: 'Cantaclaro', zone: 'D', points: 105, x: 0, y: 1 },
];

// Random events
export const RANDOM_EVENTS = [
  { message: '🌧️ Lluvia en Montería - Ventas de accesorios +20%', effect: 'bonus', category: 'accesorios', bonus: 20 },
  { message: '🎉 Festival del Sinú - Todos ganan 50 puntos', effect: 'all_bonus', bonus: 50 },
  { message: '🔥 Ola de calor - Ventas de bebidas se duplican', effect: 'bonus', category: 'destilado', bonus: 100 },
  { message: '📉 Crisis económica - Pierde un turno', effect: 'skip_turn' },
  { message: '🎁 Promoción especial - Gana un comodín extra', effect: 'comodin' },
  { message: '🚗 Tráfico en el puente - Retrocede 2 casillas', effect: 'move_back', spaces: 2 },
  { message: '🎯 Objetivo cumplido - Bonus de 75 puntos', effect: 'bonus_points', bonus: 75 },
  { message: '🤝 Alianza comercial - Intercambia posición con el líder', effect: 'swap_leader' },
];

export const TILE_ICONS: Record<TileType, string> = {
  vape: '💨',
  destilado: '🥃',
  ropa: '👕',
  accesorios: '⌚',
  comodin: '🃏',
  recompensa: '🎁',
  evento: '⚡',
  inicio: '🏁',
};

// Usuario del sistema (con soporte para WhatsApp y roles)
export type UserRole = 'admin' | 'player';

export interface GameUser {
  id: string;
  name: string;
  phoneNumber: string;
  role: UserRole;
  teamId: TeamId;
  zone: Zone;
  salesPoints: number;
  recruits: number;
  lastActiveWhatsApp: Date;
  isConnectedToWhatsApp: boolean;
  createdAt: Date;
}

export interface WhatsAppNotification {
  id: string;
  userId: string;
  phoneNumber: string;
  message: string;
  type: 'sale' | 'achievement' | 'leaderboard' | 'recruitment' | 'event' | 'admin';
  sent: boolean;
  sentAt?: Date;
  createdAt: Date;
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: 'broadcast' | 'update_sale' | 'grant_bonus' | 'remove_player' | 'reset_daily';
  targetUserId?: string;
  details: Record<string, any>;
  createdAt: Date;
  appliedAt?: Date;
}
