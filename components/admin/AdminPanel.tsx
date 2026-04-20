'use client';

import { useState } from 'react';
import {
  BarChart3,
  Users,
  Send,
  Plus,
  Lock,
  LogOut,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken?: string;
}

interface User {
  id: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt: string;
}

export function AdminPanel({
  isOpen,
  onClose,
  adminToken = '',
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'users' | 'tasks' | 'notifications'
  >('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadUsers = async () => {
    if (!adminToken) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth?action=get-users', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('[Admin Panel]:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!adminToken || !notificationMessage) return;
    setIsSending(true);

    try {
      const response = await fetch(
        '/api/admin/auth?action=send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            message: notificationMessage,
          }),
        }
      );

      if (response.ok) {
        setSuccessMessage(
          `Notificación enviada a ${users.length} usuario(s)`
        );
        setNotificationMessage('');

        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('[Notification Error]:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Panel Administrativo</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-purple-700 p-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {(
            [
              { id: 'dashboard', label: 'Panel', icon: BarChart3 },
              { id: 'users', label: 'Usuarios', icon: Users },
              { id: 'tasks', label: 'Tareas', icon: Plus },
              { id: 'notifications', label: 'Notificaciones', icon: Send },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                if (id === 'users') loadUsers();
              }}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition ${
                activeTab === id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Usuarios Activos
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {users.length}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Verificados
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {users.filter((u) => u.isVerified).length}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Estado del Sistema</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>API Chat Activo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>WhatsApp Sincronizado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Base de Datos Operativa</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              ) : users.length === 0 ? (
                <p className="text-center text-gray-500">
                  No hay usuarios registrados
                </p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{user.phoneNumber}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {user.id}
                          </p>
                        </div>
                        {user.isVerified ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Mensaje para todos los usuarios
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Escribe el mensaje que deseas enviar..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                />
              </div>

              {successMessage && (
                <div className="flex gap-2 p-3 bg-green-50 dark:bg-green-900 rounded-lg text-green-600 dark:text-green-200">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}

              <button
                onClick={handleSendNotification}
                disabled={isSending || !notificationMessage}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar a {users.length} usuario(s)
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <p className="text-center text-gray-500">
                Funcionalidad de tareas próximamente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
