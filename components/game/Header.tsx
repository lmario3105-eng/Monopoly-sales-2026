'use client';

import { Crown, MapPin, Calendar } from 'lucide-react';
import type { Team } from '@/lib/game-types';

interface HeaderProps {
  teams: Team[];
  elapsedTime: number;
  monthDay: number;
  totalDays: number;
}

export function Header({ teams, elapsedTime, monthDay, totalDays }: HeaderProps) {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const leader = sortedTeams[0];
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (monthDay / totalDays) * 100;

  return (
    <header className="bg-card border-b border-border px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        {/* Logo/Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs font-bold text-foreground leading-tight truncate">Monopolio de Ventas</h1>
            <p className="text-xs text-muted-foreground truncate">Monteria</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Current Leader */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1">
            <Crown className="w-3 h-3 text-accent" />
            <span className="text-xs">{leader.icon}</span>
            <span className="text-xs font-bold text-primary">{leader.points}</span>
          </div>
          
          {/* Game Clock */}
          <div className="bg-secondary rounded-lg px-2 py-1 font-mono text-xs font-bold text-primary">
            {formatTime(elapsedTime)}
          </div>
        </div>
      </div>
      
      {/* Month Progress Bar */}
      <div className="mt-2 flex items-center gap-2">
        <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground flex-shrink-0">
          Dia {monthDay}/{totalDays}
        </span>
      </div>
    </header>
  );
}
