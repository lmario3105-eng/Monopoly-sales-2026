'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Gift, RotateCcw } from 'lucide-react';
import type { Team } from '@/lib/game-types';

interface GameControlsProps {
  currentTeam: Team;
  isRolling: boolean;
  lastRoll: number | null;
  onGetRoll: () => void;
  onRollDice: () => void;
  onReset: () => void;
}

const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const getTeamBgClass = (color: string): string => {
  const colors: Record<string, string> = {
    'team-leon': 'bg-team-leon hover:bg-team-leon/90',
    'team-tigre': 'bg-team-tigre hover:bg-team-tigre/90',
    'team-aguila': 'bg-team-aguila hover:bg-team-aguila/90',
    'team-serpiente': 'bg-team-serpiente hover:bg-team-serpiente/90',
  };
  return colors[color] || '';
};

export function GameControls({
  currentTeam,
  isRolling,
  lastRoll,
  onGetRoll,
  onRollDice,
  onReset,
}: GameControlsProps) {
  const DiceIcon = lastRoll ? DiceIcons[lastRoll - 1] : Dice1;
  
  return (
    <div className="bg-card border-t border-border px-4 py-3 pb-6">
      {/* Current turn indicator */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-lg">{currentTeam.icon}</span>
        <span className="text-sm font-medium text-foreground">
          Turno de         <span className="font-bold text-primary">{currentTeam.name}</span>
        </span>
        <span className="text-xs text-muted-foreground">
          ({currentTeam.rolls} lanzamiento{currentTeam.rolls !== 1 ? 's' : ''})
        </span>
      </div>
      
      {/* Dice display */}
      {lastRoll && (
        <div className="flex justify-center mb-3">
          <div className={cn(
            'w-16 h-16 rounded-xl bg-secondary flex items-center justify-center',
            'border-2 border-primary shadow-lg',
            isRolling && 'animate-dice-roll'
          )}>
            <DiceIcon className="w-10 h-10 text-primary" />
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={onGetRoll}
          disabled={isRolling}
          variant="outline"
          className="flex flex-col items-center gap-1 h-auto py-3"
        >
          <Gift className="w-5 h-5 text-accent" />
          <span className="text-[10px] font-medium">Obtener</span>
          <span className="text-[10px] text-muted-foreground">Lanzamiento</span>
        </Button>
        
        <Button
          onClick={onRollDice}
          disabled={isRolling || currentTeam.rolls === 0}
          className={cn(
            'flex flex-col items-center gap-1 h-auto py-3 text-white',
            getTeamBgClass(currentTeam.color),
            currentTeam.rolls === 0 && 'opacity-50'
          )}
        >
          <DiceIcon className={cn('w-6 h-6', isRolling && 'animate-spin')} />
          <span className="text-xs font-bold">¡LANZAR!</span>
          {currentTeam.rolls === 0 && (
            <span className="text-[10px] opacity-70">Sin turnos</span>
          )}
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          className="flex flex-col items-center gap-1 h-auto py-3"
        >
          <RotateCcw className="w-5 h-5 text-destructive" />
          <span className="text-[10px] font-medium">Reiniciar</span>
          <span className="text-[10px] text-muted-foreground">Juego</span>
        </Button>
      </div>
    </div>
  );
}
