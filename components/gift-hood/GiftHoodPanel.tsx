'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gift, Send } from 'lucide-react';

interface GiftHoodPanelProps {
  currentPlayerId: string;
  currentPlayerName: string;
  players: Array<{ id: string; name: string; team: string }>;
}

export function GiftHoodPanel({ currentPlayerId, currentPlayerName, players }: GiftHoodPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [giftAmount, setGiftAmount] = useState(10);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const otherPlayers = players.filter((p) => p.id !== currentPlayerId);

  const handleSendGift = async () => {
    if (!selectedPlayer || giftAmount <= 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gift-hood/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPlayerId: currentPlayerId,
          toPlayerId: selectedPlayer,
          amount: giftAmount,
          message: message || `Regalo de ${currentPlayerName}`,
        }),
      });

      if (response.ok) {
        setIsOpen(false);
        setSelectedPlayer(null);
        setGiftAmount(10);
        setMessage('');
        alert('¡Regalo enviado exitosamente!');
      }
    } catch (error) {
      console.error('Error enviando regalo:', error);
      alert('Error enviando regalo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
      >
        <Gift className="w-4 h-4" />
        Enviar Regalo
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Regalo - Gift Hood</DialogTitle>
            <DialogDescription>
              Envía puntos o premios a otros jugadores
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Destinatario</label>
              <select
                value={selectedPlayer || ''}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background"
              >
                <option value="">Selecciona un jugador</option>
                {otherPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.team})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Cantidad de Puntos</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={giftAmount}
                onChange={(e) => setGiftAmount(parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Mensaje (Opcional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="w-full p-2 border border-border rounded-lg bg-background text-sm resize-none h-20"
              />
            </div>

            <Button
              onClick={handleSendGift}
              disabled={!selectedPlayer || giftAmount <= 0 || isLoading}
              className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Enviando...' : 'Enviar Regalo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
