'use client';

import { useState, useRef, useEffect, Component, type ReactNode } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ChatMessage } from '@/components/chat/ChatMessage';

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
      text: 'Hola! Soy tu asistente de Monopolio. Escriba /help para ver los comandos disponibles.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      console.log('[v0] Enviando mensaje:', input);

      const response = await fetch('/api/chat-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-web',
          userName: 'Usuario Web',
          message: input,
          isAdmin: false,
        }),
      });

      console.log('[v0] Respuesta status:', response.status);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      console.log('[v0] Datos de respuesta:', data);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'No pude procesar tu solicitud',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('[v0] Error en chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Ocurrió un error. Intenta de nuevo.',
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
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hover:bg-blue-700 p-2 rounded-lg transition"
              aria-label="Volver al juego"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Asistente de Monopolio</h1>
              <p className="text-sm text-blue-100">24/7 Disponible</p>
            </div>
          </div>
          <div className="text-sm text-blue-100">
            {isLoading ? 'Escribiendo...' : 'En línea'}
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
            placeholder="Escribe tu mensaje..."
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
          <p className="text-xs text-gray-600 font-semibold mb-2">Comandos:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['/help', '/stats', '/top', '/teams'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => setInput(cmd)}
                className="text-sm bg-white hover:bg-gray-50 border border-gray-300 px-3 py-2 rounded transition text-gray-700 font-medium"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
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
