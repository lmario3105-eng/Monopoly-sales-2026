// Base de datos en memoria para demo (en producción sería Supabase)
import type { GameUser, WhatsAppNotification, AdminAction, TeamId, Zone } from './game-types';

// Simular almacenamiento en memoria
const users = new Map<string, GameUser>();
const notifications = new Map<string, WhatsAppNotification>();
const adminActions = new Map<string, AdminAction>();

// Función para crear usuario
export function createUser(data: Omit<GameUser, 'id' | 'createdAt' | 'lastActiveWhatsApp'>): GameUser {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const user: GameUser = {
    id,
    ...data,
    lastActiveWhatsApp: new Date(),
    createdAt: new Date(),
  };
  users.set(id, user);
  return user;
}

// Encontrar usuario por teléfono
export function getUserByPhone(phoneNumber: string): GameUser | undefined {
  return Array.from(users.values()).find(u => u.phoneNumber === phoneNumber);
}

// Obtener usuario por ID
export function getUser(id: string): GameUser | undefined {
  return users.get(id);
}

// Actualizar usuario
export function updateUser(id: string, updates: Partial<GameUser>): GameUser | null {
  const user = users.get(id);
  if (!user) return null;
  
  const updated = { ...user, ...updates };
  users.set(id, updated);
  return updated;
}

// Obtener todos los usuarios
export function getAllUsers(): GameUser[] {
  return Array.from(users.values());
}

// Obtener usuarios por zona
export function getUsersByZone(zone: Zone): GameUser[] {
  return Array.from(users.values()).filter(u => u.zone === zone);
}

// Obtener usuarios conectados a WhatsApp
export function getConnectedWhatsAppUsers(): GameUser[] {
  return Array.from(users.values()).filter(u => u.isConnectedToWhatsApp);
}

// Obtener administradores
export function getAdmins(): GameUser[] {
  return Array.from(users.values()).filter(u => u.role === 'admin');
}

// Crear notificación
export function createNotification(data: Omit<WhatsAppNotification, 'id' | 'createdAt'>): WhatsAppNotification {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const notification: WhatsAppNotification = {
    id,
    ...data,
    createdAt: new Date(),
  };
  notifications.set(id, notification);
  return notification;
}

// Obtener notificaciones pendientes
export function getPendingNotifications(): WhatsAppNotification[] {
  return Array.from(notifications.values()).filter(n => !n.sent);
}

// Marcar notificación como enviada
export function markNotificationAsSent(id: string): WhatsAppNotification | null {
  const notif = notifications.get(id);
  if (!notif) return null;
  
  const updated: WhatsAppNotification = {
    ...notif,
    sent: true,
    sentAt: new Date(),
  };
  notifications.set(id, updated);
  return updated;
}

// Crear acción de admin
export function createAdminAction(data: Omit<AdminAction, 'id' | 'createdAt'>): AdminAction {
  const id = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const action: AdminAction = {
    id,
    ...data,
    createdAt: new Date(),
  };
  adminActions.set(id, action);
  return action;
}

// Obtener historial de acciones de admin
export function getAdminActions(adminId?: string): AdminAction[] {
  const all = Array.from(adminActions.values());
  if (!adminId) return all;
  return all.filter(a => a.adminId === adminId);
}

// Datos de inicialización para demo
export function initializeDemoData() {
  // Crear algunos usuarios demo
  const demoUsers: Omit<GameUser, 'id' | 'createdAt' | 'lastActiveWhatsApp'>[] = [
    {
      name: 'Admin Principal',
      phoneNumber: '+573001234567',
      role: 'admin',
      teamId: 'leon',
      zone: 'A',
      salesPoints: 0,
      recruits: 0,
      isConnectedToWhatsApp: true,
    },
    {
      name: 'Juan Vendedor',
      phoneNumber: '+573007654321',
      role: 'player',
      teamId: 'leon',
      zone: 'A',
      salesPoints: 1500,
      recruits: 2,
      isConnectedToWhatsApp: true,
    },
    {
      name: 'María García',
      phoneNumber: '+573009876543',
      role: 'player',
      teamId: 'tigre',
      zone: 'B',
      salesPoints: 2100,
      recruits: 3,
      isConnectedToWhatsApp: false,
    },
  ];

  demoUsers.forEach(userData => {
    const existing = getUserByPhone(userData.phoneNumber);
    if (!existing) {
      createUser(userData);
    }
  });
}

// Limpiar todo (para testing)
export function clearDatabase() {
  users.clear();
  notifications.clear();
  adminActions.clear();
}

// Exportar estado (para debugging)
export function getDatabaseState() {
  return {
    usersCount: users.size,
    notificationsCount: notifications.size,
    actionsCount: adminActions.size,
    users: Array.from(users.values()),
    pendingNotifications: getPendingNotifications(),
  };
}
