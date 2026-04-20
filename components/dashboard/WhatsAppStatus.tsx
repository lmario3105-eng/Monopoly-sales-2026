'use client';

import { MessageCircle, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WhatsAppStatusProps {
  onConnect?: () => void;
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export function WhatsAppStatus({ onConnect }: WhatsAppStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/whatsapp/auto-sync');
        if (response.ok) {
          const data = await response.json();
          setStatus(data.readyToReceiveMessages ? 'connected' : 'disconnected');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Verificar cada 30s
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    connected: {
      icon: Wifi,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Conectado',
      borderColor: 'border-green-200',
    },
    connecting: {
      icon: Wifi,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      label: 'Conectando...',
      borderColor: 'border-yellow-200',
    },
    disconnected: {
      icon: WifiOff,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      label: 'Desconectado',
      borderColor: 'border-gray-200',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Error',
      borderColor: 'border-red-200',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">WhatsApp Bot</p>
            <div className="flex items-center gap-1 mt-1">
              <Icon className={`w-4 h-4 ${config.color}`} />
              <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
            </div>
          </div>
        </div>
        {messageCount > 0 && (
          <div className="flex items-center justify-center w-6 h-6 bg-red-600 text-white rounded-full text-xs font-bold">
            {messageCount}
          </div>
        )}
      </div>
      {status === 'disconnected' && onConnect && (
        <button
          onClick={onConnect}
          className="mt-3 w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
        >
          Conectar WhatsApp
        </button>
      )}
    </div>
  );
}
