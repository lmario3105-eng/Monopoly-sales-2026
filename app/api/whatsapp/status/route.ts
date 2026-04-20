import { NextResponse } from 'next/server';
import * as db from '@/lib/database';

// Inicializar datos demo
db.initializeDemoData();

// GET: Estado en tiempo real del bot y estadísticas
export async function GET() {
  try {
    const allUsers = db.getAllUsers();
    const connectedUsers = db.getConnectedWhatsAppUsers();
    const pendingNotifs = db.getPendingNotifications();
    const dbState = db.getDatabaseState();

    // Agrupar por zona
    const zones = ['A', 'B', 'C', 'D'] as const;
    const zoneStats = zones.map((zone) => {
      const zoneUsers = db.getUsersByZone(zone);
      const totalPoints = zoneUsers.reduce((sum, u) => sum + u.salesPoints, 0);
      const leader = [...zoneUsers].sort((a, b) => b.salesPoints - a.salesPoints)[0];
      return {
        zone,
        userCount: zoneUsers.length,
        totalPoints,
        leader: leader ? { name: leader.name, points: leader.salesPoints } : null,
      };
    });

    // Top 5 usuarios por puntos
    const topUsers = [...allUsers]
      .sort((a, b) => b.salesPoints - a.salesPoints)
      .slice(0, 5)
      .map((u) => ({
        name: u.name,
        zone: u.zone,
        salesPoints: u.salesPoints,
        recruits: u.recruits,
        teamId: u.teamId,
        isConnected: u.isConnectedToWhatsApp,
      }));

    return NextResponse.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      summary: {
        totalUsers: allUsers.length,
        connectedUsers: connectedUsers.length,
        pendingNotifications: pendingNotifs.length,
        totalNotifications: dbState.notificationsCount,
      },
      zones: zoneStats,
      topUsers,
    });
  } catch (error) {
    console.error('[WhatsApp Status Error]:', error);
    return NextResponse.json(
      { error: 'Error obteniendo estado', details: String(error) },
      { status: 500 }
    );
  }
}
