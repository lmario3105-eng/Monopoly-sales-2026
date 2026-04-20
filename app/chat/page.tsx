'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ChatMessage } from '@/components/chat/ChatMessage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hola! Soy tu asistente de Monopolio de Ventas. Puedo ayudarte con reportes, estadísticas, commands o responder preguntas sobre el juego. Escribe /help para ver los comandos disponibles.',
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
      const response = await fetch('/api/chat-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-web',
          userName: 'Web User',
          message: input,
          isAdmin: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en respuesta del servidor');
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
      console.error('[v0] Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Error de conexión. Intenta de nuevo.',
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
      {/* Header */}
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
              <h1 className="text-xl font-bold">Asistente Monopolio</h1>
              <p className="text-sm text-blue-100">Disponible 24/7</p>
            </div>
          </div>
          <div className="text-sm text-blue-100">
            {isLoading ? 'Escribiendo...' : 'Activo'}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-3 max-w-xs">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t bg-white shadow-lg">
        <form
          onSubmit={handleSendMessage}
          className="max-w-2xl w-full mx-auto flex gap-3 p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje o comando (/help)..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-3 transition flex items-center gap-2 font-semibold"
          >
            <Send className="w-4 h-4" />
            Enviar
          </button>
        </form>

        {/* Quick Commands */}
        <div className="bg-blue-50 border-t px-4 py-3 max-w-2xl w-full mx-auto">
          <p className="text-xs text-gray-600 font-semibold mb-2">Comandos rápidos:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['/help', '/stats', '/top', '/teams'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setInput(cmd);
                }}
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
