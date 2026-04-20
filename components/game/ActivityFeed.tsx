'use client';

import { cn } from '@/lib/utils';
import type { ActivityItem, TeamId } from '@/lib/game-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const getTeamColorClass = (teamId: TeamId): string => {
  const colors: Record<TeamId, string> = {
    leon: 'border-l-team-leon',
    tigre: 'border-l-team-tigre',
    aguila: 'border-l-team-aguila',
    serpiente: 'border-l-team-serpiente',
  };
  return colors[teamId];
};

const getActivityIcon = (type: ActivityItem['type']): string => {
  const icons: Record<ActivityItem['type'], string> = {
    move: '🚶',
    points: '💰',
    comodin: '🃏',
    event: '⚡',
    reward: '🎁',
    roll: '🎲',
  };
  return icons[type];
};

export function ActivityFeed({ activities, maxItems = 50 }: ActivityFeedProps) {
  const displayActivities = activities.slice(-maxItems).reverse();

  return (
    <div className="flex flex-col h-full bg-card/50 rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-secondary/30 to-secondary/10 flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Actividad en Vivo
        </h3>
        <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-full">
          {activities.length} eventos
        </span>
      </div>
      
      {/* Activity List - Scrollable */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-3 space-y-2">
          {displayActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-3xl mb-2">🎮</span>
              <p className="text-xs text-muted-foreground">¡El juego está por comenzar!</p>
            </div>
          ) : (
            displayActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg',
                  'border-l-3 transition-all duration-300 hover:bg-background/60',
                  'bg-gradient-to-r from-background/70 to-background/30',
                  getTeamColorClass(activity.teamId),
                  index === 0 && 'animate-slide-up bg-primary/15 border-l-primary shadow-lg'
                )}
              >
                <span className="text-lg shrink-0 mt-0.5">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug font-medium">
                    {activity.message}
                  </p>
                  {activity.points && activity.points > 0 && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                      <span className="animate-score-pop">⭐</span>
                      +{activity.points} pts
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                  {new Date(activity.timestamp).toLocaleTimeString('es-CO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
