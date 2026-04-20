'use client';

import { cn } from '@/lib/utils';
import type { Team } from '@/lib/game-types';
import { Zap, Trophy, Ticket } from 'lucide-react';

interface TeamPanelProps {
  teams: Team[];
  currentTeamIndex: number;
  onSelectTeam?: (index: number) => void;
}

const getTeamBgClass = (color: string): string => {
  const colors: Record<string, string> = {
    'team-leon': 'bg-team-leon/20 border-team-leon',
    'team-tigre': 'bg-team-tigre/20 border-team-tigre',
    'team-aguila': 'bg-team-aguila/20 border-team-aguila',
    'team-serpiente': 'bg-team-serpiente/20 border-team-serpiente',
  };
  return colors[color] || '';
};

const getTeamTextClass = (color: string): string => {
  const colors: Record<string, string> = {
    'team-leon': 'text-team-leon',
    'team-tigre': 'text-team-tigre',
    'team-aguila': 'text-team-aguila',
    'team-serpiente': 'text-team-serpiente',
  };
  return colors[color] || '';
};

export function TeamPanel({ teams, currentTeamIndex, onSelectTeam }: TeamPanelProps) {
  const sortedTeams = [...teams]
    .map((team, originalIndex) => ({ team, originalIndex }))
    .sort((a, b) => b.team.points - a.team.points);

  return (
    <div className="grid grid-cols-2 gap-2 px-3 py-2">
      {sortedTeams.map(({ team, originalIndex }, rank) => {
        const isActive = originalIndex === currentTeamIndex;
        
        return (
          <button
            key={team.id}
            onClick={() => onSelectTeam?.(originalIndex)}
            className={cn(
              'relative p-2.5 rounded-xl border-2 transition-all duration-300',
              getTeamBgClass(team.color),
              isActive 
                ? 'scale-[1.02] shadow-lg' 
                : 'opacity-70 hover:opacity-90',
              isActive && 'animate-pulse-glow'
            )}
          >
            {/* Rank badge */}
            {rank === 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                <Trophy className="w-3 h-3 text-accent-foreground" />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {/* Team icon */}
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
                'bg-background/30 backdrop-blur-sm',
                isActive && 'animate-float'
              )}>
                {team.icon}
              </div>
              
              {/* Team info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1">
                  <span className={cn('font-bold text-sm', getTeamTextClass(team.color))}>
                    {team.name}
                  </span>
                  {isActive && (
                    <Zap className={cn('w-3 h-3', getTeamTextClass(team.color))} />
                  )}
                </div>
                
                {/* Stats row */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-bold text-foreground">
                    {team.points}
                  </span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </div>
            </div>
            
            {/* Resources row */}
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1">
                <span className="text-xs">🎲</span>
                <span className="text-xs font-medium text-foreground">{team.rolls}</span>
              </div>
              <div className="flex items-center gap-1">
                <Ticket className="w-3 h-3 text-accent" />
                <span className="text-xs font-medium text-foreground">{team.comodines}</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[10px] text-muted-foreground">Pos:</span>
                <span className="text-xs font-medium text-foreground">{team.position}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
