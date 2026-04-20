'use client';

import { useState } from 'react';
import { Phone, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface WhatsAppConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void;
}

export function WhatsAppConnectModal({
  isOpen,
  onClose,
  onSuccess,
}: WhatsAppConnectModalProps) {
  const [step, setStep] = useState<'phone' | 'verify' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/whatsapp/register?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al registrar número');
      }

      const data = await response.json();
      setUserId(data.userId);
      setSuccessMessage(
        `Código de verificación enviado a ${phoneNumber}. Revisa tu SMS o WhatsApp.`
      );
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        '/api/whatsapp/register?action=verify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            verificationCode,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Código incorrecto');
      }

      setSuccessMessage('WhatsApp conectado correctamente');
      setStep('success');
      onSuccess(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold">Conectar WhatsApp</h2>
        </div>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Ingresa tu número de teléfono con código de país (ej: +57 3001234567)
            </p>

            <input
              type="tel"
              placeholder="+57 300 1234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900 rounded-lg text-red-600 dark:text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !phoneNumber}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Enviar Código'
              )}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Ingresa el código de 6 dígitos que recibiste en WhatsApp
            </p>

            {successMessage && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-200 text-sm">
                {successMessage}
              </div>
            )}

            <input
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900 rounded-lg text-red-600 dark:text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar Código'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setError('');
              }}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-2"
            >
              Cambiar número
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <p className="text-lg font-semibold">{successMessage}</p>
            <p className="text-gray-600 dark:text-gray-400">
              Ya puedes enviar y recibir mensajes desde WhatsApp y la web.
            </p>

            <button
              onClick={() => {
                onClose();
                setStep('phone');
                setPhoneNumber('');
                setVerificationCode('');
                setError('');
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
