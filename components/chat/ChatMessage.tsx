'use client';

import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-2 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Procesando...</span>
          </div>
        ) : (
          <p className="text-xs leading-relaxed">{message.text}</p>
        )}
      </div>
    </div>
  );
}
