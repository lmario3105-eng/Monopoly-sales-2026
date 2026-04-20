// Bot de WhatsApp - procesamiento de comandos y logica de negocio
import * as db from './database';

export async function handleRegisterSale(
  phoneNumber: string,
  category: string,
  points: number,
): Promise<{ success: boolean; message: string; syncedToGame: boolean }> {
  try {
    const validCategories = ['vape', 'destilado', 'ropa', 'accesorios'];

    if (!validCategories.includes(category.toLowerCase())) {
      return {
        success: false,
        message: 'Categoria no valida. Usa: Vape, Destilado, Ropa o Accesorios',
        syncedToGame: false,
      };
    }

    if (points < 0 || points > 1000) {
      return {
        success: false,
        message: 'Los puntos deben estar entre 0 y 1000',
        syncedToGame: false,
      };
    }

    const user = db.getUserByPhone(phoneNumber);
    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado. Contacta al administrador.',
        syncedToGame: false,
      };
    }

    const categoryLower = category.toLowerCase() as 'vape' | 'destilado' | 'ropa' | 'accesorios';
    const finalPoints = Math.round(points);

    const updated = db.updateUser(user.id, {
      salesPoints: user.salesPoints + finalPoints,
    });

    if (updated) {
      db.createNotification({
        userId: user.id,
        phoneNumber,
        message: `Venta registrada: ${finalPoints} puntos en ${categoryLower}`,
        type: 'sale',
        sent: false,
      });
    }

    return {
      success: true,
      message: `Venta registrada: ${finalPoints} pts en ${categoryLower}\nTotal acumulado: ${updated?.salesPoints ?? 0} puntos`,
      syncedToGame: true,
    };
  } catch (error) {
    return { success: false, message: 'Error al registrar la venta', syncedToGame: false };
  }
}

export async function handleCheckStatus(
  phoneNumber: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = db.getUserByPhone(phoneNumber);

    if (!user) {
      return { success: false, message: 'Usuario no encontrado. Contacta al administrador.' };
    }

    const zoneUsers = db.getUsersByZone(user.zone);
    const groupPoints = zoneUsers.reduce((sum, u) => sum + u.salesPoints, 0);
    const zoneRanking = [...zoneUsers].sort((a, b) => b.salesPoints - a.salesPoints);
    const userPosition = zoneRanking.findIndex((u) => u.id === user.id) + 1;

    const lastActive = new Date(user.lastActiveWhatsApp).toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric',
    });

    const statusMessage = `ESTADO - Monopolio de Ventas\n\nNombre: ${user.name}\nZona: ${user.zone}\nTus Puntos: ${user.salesPoints.toLocaleString()}\nPosicion en Zona: #${userPosition} de ${zoneUsers.length}\nReclutas: ${user.recruits}\nTotal Zona ${user.zone}: ${groupPoints.toLocaleString()} pts\nUltimo acceso: ${lastActive}\n\n${user.isConnectedToWhatsApp ? 'Conectado a WhatsApp' : 'No conectado a WhatsApp'}`;

    return { success: true, message: statusMessage };
  } catch (error) {
    return { success: false, message: 'Error al obtener el estado' };
  }
}

export function handleGetHelp(): { success: boolean; message: string } {
  const helpMessage = `COMANDOS DISPONIBLES - Monopolio de Ventas\n\nregistrar venta <categoria> <puntos>\nEj: registrar venta vape 150\n\nmi estado\nVer tus puntos, zona y progreso\n\ninvitar miembros\nObtener enlace de invitacion\n\ntabla de posiciones\nRanking de tu zona y global`;
  return { success: true, message: helpMessage };
}

export async function handleInviteMember(
  phoneNumber: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const inviteLink = `https://monopolio-ventas.vercel.app?ref=${encodeURIComponent(phoneNumber)}`;
    const inviteMessage = `INVITA Y GANA BONUS!\n\nComparte este enlace con tus companeros:\n${inviteLink}\n\nPor cada miembro nuevo: +100 Puntos\n5 miembros: +500 Puntos + Comodin\n10 miembros: +1000 Puntos + Comodin Dorado`;
    return { success: true, message: inviteMessage };
  } catch (error) {
    return { success: false, message: 'Error al generar enlace de invitacion' };
  }
}

export async function handleAdminBroadcast(
  adminPhone: string,
  message: string,
): Promise<{ success: boolean; message: string; sent: number }> {
  try {
    const admin = db.getUserByPhone(adminPhone);

    if (!admin || admin.role !== 'admin') {
      return { success: false, message: 'Solo administradores pueden usar este comando', sent: 0 };
    }

    const allUsers = db.getAllUsers();
    let notificationsSent = 0;

    for (const user of allUsers) {
      db.createNotification({
        userId: user.id,
        phoneNumber: user.phoneNumber,
        message: `Mensaje del Admin:\n\n${message}`,
        type: 'admin',
        sent: false,
      });
      notificationsSent++;
    }

    return {
      success: true,
      message: `Mensaje enviado a ${notificationsSent} usuarios`,
      sent: notificationsSent,
    };
  } catch (error) {
    return { success: false, message: 'Error al enviar broadcast', sent: 0 };
  }
}

export async function handleAdminStats(
  adminPhone: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const admin = db.getUserByPhone(adminPhone);

    if (!admin || admin.role !== 'admin') {
      return { success: false, message: 'Solo administradores pueden usar este comando' };
    }

    const allUsers = db.getAllUsers();
    const connectedUsers = db.getConnectedWhatsAppUsers();
    const pendingNotifs = db.getPendingNotifications();
    const zones = ['A', 'B', 'C', 'D'] as const;

    let statsMessage = 'ESTADISTICAS DEL SISTEMA\n\n';

    for (const zone of zones) {
      const zoneUsers = db.getUsersByZone(zone);
      const zonePoints = zoneUsers.reduce((sum, u) => sum + u.salesPoints, 0);
      const leader = [...zoneUsers].sort((a, b) => b.salesPoints - a.salesPoints)[0];
      statsMessage += `Zona ${zone}: ${zoneUsers.length} usuarios, ${zonePoints.toLocaleString()} pts\n`;
      if (leader) {
        statsMessage += `  Lider: ${leader.name} (${leader.salesPoints} pts)\n`;
      }
    }

    statsMessage += `\nConectados a WhatsApp: ${connectedUsers.length}/${allUsers.length}`;
    statsMessage += `\nNotificaciones pendientes: ${pendingNotifs.length}`;

    return { success: true, message: statsMessage };
  } catch (error) {
    return { success: false, message: 'Error al obtener estadisticas' };
  }
}

export function handleGetRanking(): { success: boolean; message: string } {
  try {
    const allUsers = db.getAllUsers();
    const zones = ['A', 'B', 'C', 'D'] as const;

    let rankingMessage = 'TABLA DE POSICIONES\n\n';

    for (const zone of zones) {
      const zoneUsers = db.getUsersByZone(zone);
      const zonePoints = zoneUsers.reduce((sum, u) => sum + u.salesPoints, 0);
      rankingMessage += `ZONA ${zone}: ${zonePoints.toLocaleString()} pts\n`;

      const topUsers = [...zoneUsers].sort((a, b) => b.salesPoints - a.salesPoints).slice(0, 2);
      topUsers.forEach((u, idx) => {
        rankingMessage += `  ${idx === 0 ? '1.' : '2.'} ${u.name}: ${u.salesPoints.toLocaleString()} pts\n`;
      });
    }

    rankingMessage += '\nTOP GLOBAL:\n';
    const topGlobal = [...allUsers].sort((a, b) => b.salesPoints - a.salesPoints).slice(0, 3);
    topGlobal.forEach((u, idx) => {
      rankingMessage += `${idx + 1}. ${u.name} (Zona ${u.zone}): ${u.salesPoints.toLocaleString()} pts\n`;
    });

    return { success: true, message: rankingMessage };
  } catch (error) {
    return { success: false, message: 'Error al obtener el ranking' };
  }
}

export async function parseWhatsAppMessage(
  phoneNumber: string,
  userName: string,
  messageText: string,
): Promise<string> {
  const text = messageText.toLowerCase().trim();
  const user = db.getUserByPhone(phoneNumber);
  const isAdmin = user?.role === 'admin';

  if (text.startsWith('registrar venta')) {
    const parts = text.split(' ');
    const category = parts[2] ?? '';
    const points = parseInt(parts[3] ?? '0', 10);
    const result = await handleRegisterSale(phoneNumber, category, points);
    return result.message;
  }

  if (text === 'mi estado' || text === 'estado') {
    const result = await handleCheckStatus(phoneNumber);
    return result.message;
  }

  if (text === 'invitar miembros' || text === 'invitar') {
    const result = await handleInviteMember(phoneNumber);
    return result.message;
  }

  if (text === 'tabla de posiciones' || text === 'ranking') {
    return handleGetRanking().message;
  }

  if (text === 'ayuda' || text === 'help' || text === 'comandos') {
    let helpMsg = handleGetHelp().message;
    if (isAdmin) {
      helpMsg += '\n\nCOMANDOS ADMIN:\nadmin broadcast <mensaje> - Enviar a todos\nadmin stats - Ver estadisticas';
    }
    return helpMsg;
  }

  if (text.startsWith('admin broadcast') && isAdmin) {
    const broadcastMessage = text.substring('admin broadcast'.length).trim();
    const result = await handleAdminBroadcast(phoneNumber, broadcastMessage);
    return result.message;
  }

  if ((text === 'admin stats' || text === 'estadisticas') && isAdmin) {
    const result = await handleAdminStats(phoneNumber);
    return result.message;
  }

  return `Hola ${userName}!\n\nSoy el asistente de Monopolio de Ventas.\n\nEscribe "ayuda" para ver los comandos disponibles.${isAdmin ? '\n\nEres administrador - tienes acceso a comandos especiales.' : ''}`;
}

export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  try {
    return true;
  } catch (error) {
    return false;
  }
}
