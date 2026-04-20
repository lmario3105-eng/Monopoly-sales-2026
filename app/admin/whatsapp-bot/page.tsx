'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  Send,
  RefreshCw,
  Users,
  BarChart3,
  Zap,
  ChevronLeft,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  phoneNumber: string;
  userName: string;
  timestamp: Date;
  userState?: {
    salesPoints: number;
    zone: string;
    recruits: number;
    role: string;
  };
}

interface BotStatus {
  status: string;
  timestamp: string;
  summary: {
    totalUsers: number;
    connectedUsers: number;
    pendingNotifications: number;
    totalNotifications: number;
  };
  zones: {
    zone: string;
    userCount: number;
    totalPoints: number;
    leader: { name: string; points: number } | null;
  }[];
  topUsers: {
    name: string;
    zone: string;
    salesPoints: number;
    recruits: number;
    teamId: string;
    isConnected: boolean;
  }[];
}

// ─── Preset commands for quick testing ────────────────────────────────────────

const PRESET_COMMANDS = [
  { label: 'Ayuda', command: 'ayuda' },
  { label: 'Mi Estado', command: 'mi estado' },
  { label: 'Venta Vape 150pts', command: 'registrar venta vape 150' },
  { label: 'Venta Ropa 200pts', command: 'registrar venta ropa 200' },
  { label: 'Ranking', command: 'tabla de posiciones' },
  { label: 'Invitar', command: 'invitar miembros' },
  { label: 'Stats Admin', command: 'admin stats' },
];

const DEMO_USERS = [
  { name: 'Admin Principal', phone: '+573001234567', label: 'Admin' },
  { name: 'Juan Vendedor', phone: '+573007654321', label: 'Vendedor A' },
  { name: 'Maria Garcia', phone: '+573009876543', label: 'Vendedor B' },
  { name: 'Nuevo Usuario', phone: '+573005551234', label: 'Nuevo' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function WhatsAppBotAdmin() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedUser, setSelectedUser] = useState(DEMO_USERS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'stats' | 'webhook'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set webhook URL on client
  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/whatsapp`);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch bot status on mount and every 10s
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/whatsapp/status');
      if (!res.ok) throw new Error('Status request failed');
      const data: BotStatus = await res.json();
      setBotStatus(data);
    } catch (err) {
      console.error('[WhatsApp Admin] Error fetching status:', err);
    } finally {
      setStatusLoading(false);
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      text: text.trim(),
      phoneNumber: selectedUser.phone,
      userName: selectedUser.name,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: selectedUser.phone,
          userName: selectedUser.name,
          message: text.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error desconocido');
      }

      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}_bot`,
        role: 'bot',
        text: data.botResponse,
        phoneNumber: 'bot',
        userName: 'Bot Monopolio',
        timestamp: new Date(),
        userState: data.user,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Refresh stats after interaction
      fetchStatus();
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        role: 'bot',
        text: `Error al procesar: ${err instanceof Error ? err.message : 'Error desconocido'}`,
        phoneNumber: 'bot',
        userName: 'Sistema',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  }

  function copyWebhookUrl() {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <MessageCircle className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground leading-none">WhatsApp Bot</h1>
          <p className="text-xs text-muted-foreground">Modo de prueba activo</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-600 font-medium">Activo</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-border bg-card px-4">
        <div className="flex gap-0">
          {(['chat', 'stats', 'webhook'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition capitalize ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'chat' && 'Simulador'}
              {tab === 'stats' && 'Estadisticas'}
              {tab === 'webhook' && 'Webhook'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">

        {/* ── TAB: CHAT SIMULATOR ─────────────────────────────── */}
        {activeTab === 'chat' && (
          <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-160px)]">

            {/* Sidebar: User selector + commands */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-4 overflow-y-auto">

              {/* User selector */}
              <Card className="p-4 border-border bg-card space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Usuario simulado</p>
                <div className="space-y-2">
                  {DEMO_USERS.map((u) => (
                    <button
                      key={u.phone}
                      onClick={() => setSelectedUser(u)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition text-sm ${
                        selectedUser.phone === u.phone
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-foreground hover:border-primary/50'
                      }`}
                    >
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.phone} · {u.label}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Quick commands */}
              <Card className="p-4 border-border bg-card space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Comandos rapidos</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COMMANDS.map((cmd) => (
                    <button
                      key={cmd.command}
                      onClick={() => sendMessage(cmd.command)}
                      disabled={isLoading}
                      className="px-2.5 py-1.5 text-xs font-medium bg-background border border-border rounded-lg hover:border-primary hover:text-primary transition disabled:opacity-50"
                    >
                      {cmd.label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Clear chat */}
              <Button variant="outline" size="sm" className="w-full" onClick={clearChat}>
                Limpiar chat
              </Button>
            </div>

            {/* Chat window */}
            <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-xl overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Bot Monopolio de Ventas</p>
                  <p className="text-xs text-muted-foreground">Simulando como: {selectedUser.name} ({selectedUser.phone})</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                    <Zap className="w-10 h-10 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Escribe un mensaje o usa los comandos rapidos para probar el bot.</p>
                    <p className="text-xs text-muted-foreground/60">Prueba: <span className="font-mono bg-muted px-1 rounded">ayuda</span> o <span className="font-mono bg-muted px-1 rounded">mi estado</span></p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-background border border-border text-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'bot' && (
                        <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wide">Bot</p>
                      )}
                      <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</pre>
                      <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                        {msg.timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {msg.userState && (
                        <div className="mt-2 pt-2 border-t border-border/50 flex gap-3 text-[10px] text-muted-foreground">
                          <span>{msg.userState.salesPoints} pts</span>
                          <span>Zona {msg.userState.zone}</span>
                          <span>{msg.userState.recruits} reclutas</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-background border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 bg-background">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe un comando... (ej: ayuda, mi estado)"
                    disabled={isLoading}
                    className="flex-1 px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition disabled:opacity-50"
                  />
                  <Button
                    onClick={() => sendMessage(inputText)}
                    disabled={!inputText.trim() || isLoading}
                    className="px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: STATS ──────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Estado del sistema</h2>
              <Button variant="outline" size="sm" onClick={fetchStatus} disabled={statusLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${statusLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>

            {statusLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-4 border-border bg-card animate-pulse">
                    <div className="h-3 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-7 bg-muted rounded w-1/3" />
                  </Card>
                ))}
              </div>
            ) : botStatus ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Usuarios', value: botStatus.summary.totalUsers, icon: Users },
                    { label: 'Conectados WA', value: botStatus.summary.connectedUsers, icon: CheckCircle2 },
                    { label: 'Notif. Pendientes', value: botStatus.summary.pendingNotifications, icon: Clock },
                    { label: 'Total Mensajes', value: botStatus.summary.totalNotifications, icon: MessageCircle },
                  ].map((stat) => (
                    <Card key={stat.label} className="p-4 border-border bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon className="w-4 h-4 text-primary" />
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </Card>
                  ))}
                </div>

                {/* Zone breakdown */}
                <Card className="border-border bg-card p-5">
                  <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Estadisticas por zona
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {botStatus.zones.map((z) => (
                      <div key={z.zone} className="bg-background border border-border rounded-lg p-3 space-y-1">
                        <p className="text-xs font-bold text-primary">Zona {z.zone}</p>
                        <p className="text-lg font-bold text-foreground">{z.totalPoints.toLocaleString()} pts</p>
                        <p className="text-xs text-muted-foreground">{z.userCount} usuarios</p>
                        {z.leader && (
                          <p className="text-xs text-muted-foreground truncate">Lider: {z.leader.name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top users */}
                <Card className="border-border bg-card p-5">
                  <h3 className="text-sm font-bold text-foreground mb-4">Top usuarios</h3>
                  <div className="space-y-2">
                    {botStatus.topUsers.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aun no hay usuarios. Usa el simulador para crear algunos.
                      </p>
                    ) : (
                      botStatus.topUsers.map((u, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                          <span className="text-sm font-bold text-muted-foreground w-5 text-center">{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{u.name}</p>
                            <p className="text-xs text-muted-foreground">Zona {u.zone} · {u.recruits} reclutas</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{u.salesPoints.toLocaleString()} pts</p>
                            <p className={`text-[10px] ${u.isConnected ? 'text-green-500' : 'text-muted-foreground'}`}>
                              {u.isConnected ? 'Conectado' : 'Desconectado'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 border-border bg-card text-center">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No se pudo cargar el estado del bot.</p>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB: WEBHOOK ────────────────────────────────────── */}
        {activeTab === 'webhook' && (
          <div className="space-y-4 mt-4 max-w-2xl">
            <h2 className="text-lg font-bold text-foreground">Configuracion del Webhook</h2>

            <Card className="border-border bg-card p-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">URL del Webhook</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={webhookUrl}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground"
                  />
                  <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Registra esta URL en Meta Business Platform o Twilio.</p>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Verify Token</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value="monopolio_sales_2025"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { navigator.clipboard.writeText('monopolio_sales_2025'); }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Usa este token en el campo &quot;Verify Token&quot; de la configuracion del webhook en Meta.
                </p>
              </div>
            </Card>

            <Card className="border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground">Pasos para conectar con Meta WhatsApp Business</h3>
              <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                <li>Crea una aplicacion en <span className="text-foreground font-medium">developers.facebook.com</span></li>
                <li>Agrega el producto &quot;WhatsApp&quot; y configura tu numero de telefono</li>
                <li>En la seccion de webhooks, pega la URL de arriba</li>
                <li>Usa el Verify Token de arriba para verificar el webhook</li>
                <li>Suscribete al campo <span className="font-mono text-xs bg-muted px-1 rounded">messages</span></li>
                <li>Copia tu Access Token permanente a las variables de entorno como <span className="font-mono text-xs bg-muted px-1 rounded">WHATSAPP_ACCESS_TOKEN</span></li>
              </ol>
            </Card>

            <Card className="border-primary/20 bg-primary/5 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Modo de prueba activo</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                El simulador de la pestana &quot;Simulador&quot; procesa mensajes con la logica real del bot sin necesitar WhatsApp configurado. Todos los comandos y la base de datos funcionan exactamente igual que en produccion.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
