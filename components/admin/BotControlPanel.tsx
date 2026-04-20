'use client';

import { useState, useEffect } from 'react';
import { Settings, RefreshCw, AlertCircle, CheckCircle, MessageSquare, Zap } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  icon: React.ReactNode;
}

export function BotControlPanel() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Gemini AI',
      status: 'active',
      lastSync: 'Ahora',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      name: 'WhatsApp',
      status: 'active',
      lastSync: 'Conectado',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: 'Jimmy Night',
      status: 'active',
      lastSync: 'Sincronizado',
      icon: <Zap className="w-5 h-5" />,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const checkServices = async () => {
    setIsLoading(true);
    try {
      const responses = await Promise.all([
        fetch('/api/keys?service=gemini'),
        fetch('/api/jimmy-night'),
      ]);

      const statuses: ServiceStatus[] = [
        {
          name: 'Gemini AI',
          status: responses[0].ok ? 'active' : 'error',
          lastSync: new Date().toLocaleTimeString('es-CO'),
          icon: <Zap className="w-5 h-5" />,
        },
        {
          name: 'WhatsApp',
          status: 'active',
          lastSync: 'Conectado',
          icon: <MessageSquare className="w-5 h-5" />,
        },
        {
          name: 'Jimmy Night',
          status: responses[1].ok ? 'active' : 'error',
          lastSync: new Date().toLocaleTimeString('es-CO'),
          icon: <Zap className="w-5 h-5" />,
        },
      ];

      setServices(statuses);
    } catch (error) {
      console.error('[Bot Control] Error checking services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkServices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'active') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Panel de Control del Bot</h2>
        </div>
        <button
          onClick={checkServices}
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.name} className="bg-background/50 border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">{service.icon}</div>
              {getStatusIcon(service.status)}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{service.name}</p>
              <p className={`text-xs ${getStatusColor(service.status)} font-medium`}>
                {service.status === 'active' ? 'Activo' : 'Error'}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Última sincronización: {service.lastSync}</p>
          </div>
        ))}
      </div>

      <div className="bg-background/50 border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-sm">Comandos Disponibles</h3>
        <div className="text-xs text-muted-foreground space-y-2">
          <p>📋 <code>/help</code> - Mostrar ayuda</p>
          <p>📊 <code>/stats</code> - Ver estadísticas</p>
          <p>🥇 <code>/top</code> - Ver top vendedores</p>
          <p>🏆 <code>/teams</code> - Ver equipos</p>
          <p>🎁 <code>/gift @usuario cantidad</code> - Enviar regalo</p>
          <p>✅ <code>/status</code> - Estado actual</p>
        </div>
      </div>
    </div>
  );
}
