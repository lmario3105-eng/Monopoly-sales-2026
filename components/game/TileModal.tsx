'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Tile, TileType } from '@/lib/game-types';
import { TILE_ICONS } from '@/lib/game-types';

interface TileModalProps {
  tile: Tile | null;
  open: boolean;
  onClose: () => void;
}

const getTileDescription = (type: TileType): string => {
  const descriptions: Record<TileType, string> = {
    vape: 'Oportunidad de venta de productos Vape. ¡Genera puntos de venta!',
    destilado: 'Zona de venta de destilados premium. Alto potencial de ganancias.',
    ropa: 'Punto de venta de ropa y moda. ¡Conquista el mercado textil!',
    accesorios: 'Venta de accesorios y complementos. Diversifica tu cartera.',
    comodin: '¡Carta comodín! Úsala estratégicamente para duplicar puntos o avanzar.',
    recompensa: '¡Felicidades! Has caído en una casilla de recompensa especial.',
    evento: 'Evento aleatorio del mercado. Puede ser positivo o negativo.',
    inicio: 'Punto de partida. ¡Que comience la competencia!',
  };
  return descriptions[type];
};

const getTileBgClass = (type: TileType): string => {
  const colors: Record<TileType, string> = {
    vape: 'bg-tile-vape/20',
    destilado: 'bg-tile-destilado/20',
    ropa: 'bg-tile-ropa/20',
    accesorios: 'bg-tile-accesorios/20',
    comodin: 'bg-tile-comodin/20',
    recompensa: 'bg-tile-recompensa/20',
    evento: 'bg-tile-evento/20',
    inicio: 'bg-primary/20',
  };
  return colors[type];
};

export function TileModal({ tile, open, onClose }: TileModalProps) {
  if (!tile) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn('max-w-[320px] rounded-xl', getTileBgClass(tile.type))}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center text-3xl">
              {TILE_ICONS[tile.type]}
            </div>
            <div>
              <DialogTitle className="text-lg">{tile.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">Zona {tile.zone}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <p className="text-sm text-foreground/90">
            {getTileDescription(tile.type)}
          </p>
          
          {tile.points > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium">Puntos base</span>
              <span className="text-xl font-bold text-primary">+{tile.points}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-background/50">
              <span className="text-muted-foreground">Tipo</span>
              <p className="font-medium capitalize">{tile.type}</p>
            </div>
            <div className="p-2 rounded-lg bg-background/50">
              <span className="text-muted-foreground">Posición</span>
              <p className="font-medium">#{tile.id}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
