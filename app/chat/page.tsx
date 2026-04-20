'use client';

import { useState, useRef, useEffect, Component, type ReactNode } from 'react';
import { Phone, Lock } from 'lucide-react';
import { WhatsAppConnectModal } from '@/components/chat/WhatsAppConnectModal';
import { AdminPanel } from '@/components/admin/AdminPanel';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

class ChatErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; msg: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, msg: '' };
  }
  static getDerivedStateFromError(e: Error) {
    console.error('[Chat Error]:', e);
    return { hasError: true, msg: e.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
          <div className="bg-white border border-red-300 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <p className="text-red-600 font-bold text-lg">Error en el Chat</p>
            <p className="text-gray-600 text-sm font-mono break-all">{this.state.msg}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl"
            >
              Recargar Chat
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hola! Soy tu asistente de Monopolio. Escriba /help para ver los comandos disponibles. También puedo aprender de tus preguntas.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Verificar si es intento de login de admin
    if (input.toLowerCase().startsWith('/admin-login')) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      // Procesar login de admin
      const parts = input.split(' ');
      if (parts.length >= 3) {
        const username = parts[1];
        const password = parts[2];

        try {
          const response = await fetch('/api/admin/auth?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              password,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setAdminToken(data.token);
            setIsAdmin(true);

            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: `✅ Bienvenido Administrador ${data.admin.username}. Tu rol: ${data.admin.role}. Tienes acceso a: ${data.admin.permissions.join(', ')}`,
              sender: 'bot',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
          } else {
            const data = await response.json();
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: `❌ ${data.error || 'Credenciales inválidas'}`,
              sender: 'bot',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
          }
        } catch (error) {
          console.error('[Admin Login] Error:', error);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: 'Error al procesar login de administrador',
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } else {
        const helpMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Uso: /admin-login <usuario> <contraseña>\nEjemplo: /admin-login admin-monopoly Monopoly2024#Admin',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, helpMessage]);
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: isAdmin ? 'admin' : 'user-web',
          userName: isAdmin ? 'Administrador' : 'Usuario Web',
          message: input,
          isAdmin: isAdmin,
          conversationHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = (await response.json()) as any;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'No pude procesar tu solicitud',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('[Chat Error]:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Disculpa, tuve un error. Intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <div className={`${isAdmin ? 'bg-purple-600' : 'bg-blue-600'} text-white shadow-lg transition-colors`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`${isAdmin ? 'hover:bg-purple-700' : 'hover:bg-blue-700'} p-2 rounded-lg transition`}
              aria-label="Volver al juego"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Asistente de Monopolio</h1>
                {isAdmin && <Lock className="w-4 h-4 text-yellow-300" />}
              </div>
              <p className="text-sm text-blue-100">{isAdmin ? 'Modo Admin' : '24/7 Disponible'}</p>
            </div>
          </div>
          <div className="text-sm text-blue-100 flex items-center gap-4">
            <span>{isLoading ? 'Escribiendo...' : 'En línea'}</span>
            <button
              type="button"
              onClick={() => setShowWhatsAppModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAdminPanel(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Panel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-300 rounded-lg px-4 py-3 max-w-xs">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white shadow-lg">
        <form onSubmit={handleSendMessage} className="max-w-2xl w-full mx-auto flex gap-3 p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAdmin ? 'Comando de admin...' : 'Escribe tu mensaje...'}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-3 transition flex items-center gap-2 font-semibold"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="bg-blue-50 border-t px-4 py-3 max-w-2xl w-full mx-auto">
          <p className="text-xs text-gray-600 font-semibold mb-2">
            {isAdmin ? 'Comandos de Admin:' : 'Comandos:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(isAdmin
              ? ['/admin-panel', '/users-stats', '/broadcast', '/system-status']
              : ['/help', '/stats', '/top', '/teams']
            ).map((cmd) => (
              <button
                key={cmd}
                onClick={() => setInput(cmd)}
                className="text-sm bg-white hover:bg-gray-50 border border-gray-300 px-3 py-2 rounded transition text-gray-700 font-medium"
              >
                {cmd}
              </button>
            ))}
          </div>
          {!isAdmin && (
            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              VIP? Usa <code className="bg-gray-100 px-2 py-1 rounded">/admin-login usuario password</code> para acceso de administrador
            </div>
          )}
        </div>
      </div>

      <WhatsAppConnectModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onSuccess={(userId) => {
          const botMessage: Message = {
            id: Date.now().toString(),
            text: `✅ WhatsApp conectado correctamente. Tu ID: ${userId}. Ahora puedes recibir mensajes en WhatsApp.`,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setShowWhatsAppModal(false);
        }}
      />

      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        adminToken={adminToken}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <ChatErrorBoundary>
      <ChatContent />
    </ChatErrorBoundary>
  );
}
