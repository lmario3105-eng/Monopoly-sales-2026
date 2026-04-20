'use client';

import { useEffect, useState } from 'react';
import { Settings, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminStats {
  totalUsers: number;
  connectedToWhatsApp: number;
  zoneStats: Record<string, { users: number; points: number }>;
  pendingNotifications: number;
}

interface AdminPanelProps {
  isAdmin: boolean;
  onBroadcast?: (message: string) => void;
}

export function AdminPanel({ isAdmin, onBroadcast }: AdminPanelProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const loadStats = async () => {
      try {
        const response = await fetch('/api/whatsapp/status');
        if (!response.ok) throw new Error('API error');
        const data = await response.json();

        const zoneStats: Record<string, { users: number; points: number }> = {
          A: { users: 0, points: 0 },
          B: { users: 0, points: 0 },
          C: { users: 0, points: 0 },
          D: { users: 0, points: 0 },
        };

        if (data.zones) {
          data.zones.forEach((z: any) => {
            zoneStats[z.zone] = { users: z.userCount, points: z.totalPoints };
          });
        }

        setStats({
          totalUsers: data.summary?.totalUsers ?? 0,
          connectedToWhatsApp: data.summary?.connectedUsers ?? 0,
          zoneStats,
          pendingNotifications: data.summary?.pendingNotifications ?? 0,
        });
      } catch {
        // Silently fail — admin panel is optional info
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 10000); // Actualizar cada 10 segundos
    return () => clearInterval(interval);
  }, [isAdmin]);

  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="bg-accent/10 border border-accent rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-accent rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-accent rounded w-1/3"></div>
      </div>
    );
  }

  if (!stats) return null;

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;

    try {
      // En producción, enviaría a un endpoint API
      console.log('[Admin] Broadcast:', broadcastMessage);
      if (onBroadcast) onBroadcast(broadcastMessage);
      setBroadcastMessage('');
      setShowBroadcast(false);
    } catch (error) {
      console.error('[Admin] Error:', error);
    }
  };

  return (
    <div className="bg-accent/10 border border-accent rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent" />
          Panel de Administración
        </h3>
        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded font-bold">
          ADMIN
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background rounded p-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            Usuarios Totales
          </p>
          <p className="font-bold text-lg text-foreground">{stats.totalUsers}</p>
        </div>

        <div className="bg-background rounded p-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Conectados WhatsApp
          </p>
          <p className="font-bold text-lg text-primary">
            {stats.connectedToWhatsApp}/{stats.totalUsers}
          </p>
        </div>

        <div className="bg-background rounded p-3 col-span-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
            <TrendingUp className="w-3 h-3" />
            Puntos por Zona
          </p>
          <div className="space-y-1">
            {Object.entries(stats.zoneStats).map(([zone, data]) => (
              <div key={zone} className="flex justify-between items-center">
                <span className="text-xs font-medium">Zona {zone}: {data.users} usuarios</span>
                <span className="text-xs text-accent font-bold">
                  {data.points.toLocaleString()} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notificaciones Pendientes */}
      {stats.pendingNotifications > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
          <p className="text-xs text-destructive font-bold">
            ⏳ {stats.pendingNotifications} notificaciones pendientes de enviar por WhatsApp
          </p>
        </div>
      )}

      {/* Botón Broadcast */}
      <div className="pt-2 border-t border-accent/20">
        {!showBroadcast ? (
          <Button
            onClick={() => setShowBroadcast(true)}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            size="sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Enviar Mensaje a Todos
          </Button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Escribe el mensaje..."
              className="w-full text-sm p-2 rounded border border-border bg-background text-foreground resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleBroadcast}
                disabled={!broadcastMessage.trim()}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                size="sm"
              >
                Enviar
              </Button>
              <Button
                onClick={() => {
                  setShowBroadcast(false);
                  setBroadcastMessage('');
                }}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
