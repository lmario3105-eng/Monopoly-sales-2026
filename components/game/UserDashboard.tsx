'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import type { GameUser } from '@/lib/game-types';

interface UserDashboardProps {
  userId?: string;
}

export function UserDashboard({ userId }: UserDashboardProps) {
  const [user, setUser] = useState<GameUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [whatsAppStatus, setWhatsAppStatus] = useState<'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/whatsapp/status');
        if (!response.ok) throw new Error('API error');
        const data = await response.json();

        const users = data.topUsers ?? data.users ?? [];
        if (users.length > 0) {
          const firstUser = users[0];
          setUser({ ...firstUser, lastActiveWhatsApp: new Date(firstUser.lastActiveWhatsApp ?? Date.now()) });
          setWhatsAppStatus(firstUser.isConnected ?? firstUser.isConnectedToWhatsApp ? 'connected' : 'disconnected');
        }
      } catch (error) {
        // Silently fail — dashboard is optional info
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-secondary rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-secondary rounded w-1/3"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* Usuario Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{user.name}</h3>
          <p className="text-xs text-muted-foreground">
            Zona {user.zone} • {user.role === 'admin' ? '⚙️ Admin' : '👤 Jugador'}
          </p>
        </div>
        
        {/* WhatsApp Status */}
        <div className="flex items-center gap-1.5">
          {whatsAppStatus === 'connected' ? (
            <>
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">WhatsApp OK</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">No conectado</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-background rounded p-2 text-center">
          <p className="text-xs text-muted-foreground">Puntos</p>
          <p className="font-bold text-primary">{user.salesPoints.toLocaleString()}</p>
        </div>
        <div className="bg-background rounded p-2 text-center">
          <p className="text-xs text-muted-foreground">Reclutas</p>
          <p className="font-bold text-accent">{user.recruits}</p>
        </div>
        <div className="bg-background rounded p-2 text-center">
          <p className="text-xs text-muted-foreground">Última actividad</p>
          <p className="text-xs font-mono text-foreground">
            {new Date(user.lastActiveWhatsApp).toLocaleDateString('es-CO', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Comandos rápidos */}
      {whatsAppStatus === 'connected' && (
        <div className="text-xs text-muted-foreground p-2 bg-background/50 rounded border border-border">
          <p className="font-semibold text-foreground mb-1">📱 Comandos WhatsApp:</p>
          <ul className="space-y-0.5">
            <li>• <code className="text-primary">registrar venta</code></li>
            <li>• <code className="text-primary">mi estado</code></li>
            <li>• <code className="text-primary">tabla de posiciones</code></li>
          </ul>
        </div>
      )}
    </div>
  );
}
