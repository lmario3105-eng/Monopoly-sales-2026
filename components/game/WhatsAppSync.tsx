'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

interface BotSummary {
  totalUsers: number;
  connectedUsers: number;
  pendingNotifications: number;
  totalNotifications: number;
}

export function WhatsAppSync() {
  const [summary, setSummary] = useState<BotSummary | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/whatsapp/status');
      if (!res.ok) return;
      const data = await res.json();
      setSummary(data.summary);
      setLastSync(new Date());
    } catch {
      // Silent fail — this is a non-critical overlay
    }
  }

  if (!summary) return null;

  const hasPending = summary.pendingNotifications > 0;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating button */}
      <button
        onClick={() => setShowPopup((v) => !v)}
        className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Estado del bot de WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        {hasPending && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {summary.pendingNotifications > 9 ? '9+' : summary.pendingNotifications}
          </span>
        )}
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="absolute bottom-16 right-0 w-72 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-foreground">WhatsApp Bot</span>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="text-muted-foreground hover:text-foreground transition"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-background rounded-lg border border-border text-sm">
              <span className="text-muted-foreground">Usuarios totales</span>
              <span className="font-bold text-foreground">{summary.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-background rounded-lg border border-border text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-muted-foreground">Conectados WA</span>
              </div>
              <span className="font-bold text-foreground">{summary.connectedUsers}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-background rounded-lg border border-border text-sm">
              <div className="flex items-center gap-1.5">
                {hasPending ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                )}
                <span className="text-muted-foreground">Notif. pendientes</span>
              </div>
              <span className={`font-bold ${hasPending ? 'text-amber-500' : 'text-foreground'}`}>
                {summary.pendingNotifications}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-background rounded-lg border border-border text-sm">
              <span className="text-muted-foreground">Total mensajes</span>
              <span className="font-bold text-foreground">{summary.totalNotifications}</span>
            </div>

            {lastSync && (
              <p className="text-[10px] text-muted-foreground text-center pt-1">
                Actualizado: {lastSync.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </div>

          {/* Footer link */}
          <div className="px-4 pb-4">
            <Link
              href="/admin/whatsapp-bot"
              className="block w-full px-3 py-2.5 text-center text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              onClick={() => setShowPopup(false)}
            >
              Abrir simulador
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
