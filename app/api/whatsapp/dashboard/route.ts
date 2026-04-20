import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

interface DashboardStatus {
  botStatus: 'online' | 'offline' | 'error';
  timestamp: string;
  configuration: {
    webhookUrl: string;
    verifyToken: string;
    webhookConfigured: boolean;
    accessTokenConfigured: boolean;
    phoneNumberIdConfigured: boolean;
    geminiEnabled: boolean;
  };
  stats: {
    totalUsers: number;
    connectedUsers: number;
    totalSalesPoints: number;
    pendingNotifications: number;
    zoneDistribution: Record<string, number>;
  };
  system: {
    environment: string;
    nodeVersion: string;
    uptime: number;
  };
}

export async function GET(): Promise<NextResponse<DashboardStatus>> {
  try {
    const dbState = db.getDatabaseState();
    const allUsers = db.getAllUsers();
    const connectedUsers = db.getConnectedWhatsAppUsers();
    const pendingNotifs = db.getPendingNotifications();

    const zoneDistribution: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    let totalPoints = 0;
    for (const user of allUsers) {
      totalPoints += user.salesPoints;
      const zone = (user.zone as 'A' | 'B' | 'C' | 'D') || 'A';
      zoneDistribution[zone] = (zoneDistribution[zone] || 0) + 1;
    }

    const dashboard: DashboardStatus = {
      botStatus:
        process.env.WHATSAPP_VERIFY_TOKEN &&
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        process.env.GEMINI_API_KEY
          ? 'online'
          : 'offline',
      timestamp: new Date().toISOString(),
      configuration: {
        webhookUrl: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/whatsapp`
          : 'http://localhost:3000/api/whatsapp',
        verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'monopolio_sales_2025',
        webhookConfigured: !!process.env.WHATSAPP_VERIFY_TOKEN,
        accessTokenConfigured: !!process.env.WHATSAPP_ACCESS_TOKEN,
        phoneNumberIdConfigured: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
        geminiEnabled: !!process.env.GEMINI_API_KEY,
      },
      stats: {
        totalUsers: allUsers.length,
        connectedUsers: connectedUsers.length,
        totalSalesPoints: totalPoints,
        pendingNotifications: pendingNotifs.length,
        zoneDistribution,
      },
      system: {
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        uptime: process.uptime?.() || 0,
      },
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    return NextResponse.json(
      {
        botStatus: 'error',
        timestamp: new Date().toISOString(),
        configuration: {
          webhookUrl: '',
          verifyToken: '',
          webhookConfigured: false,
          accessTokenConfigured: false,
          phoneNumberIdConfigured: false,
          geminiEnabled: false,
        },
        stats: {
          totalUsers: 0,
          connectedUsers: 0,
          totalSalesPoints: 0,
          pendingNotifications: 0,
          zoneDistribution: { A: 0, B: 0, C: 0, D: 0 },
        },
        system: {
          environment: 'unknown',
          nodeVersion: 'unknown',
          uptime: 0,
        },
      },
      { status: 500 }
    );
  }
}
