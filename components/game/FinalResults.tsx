'use client';

import { Button } from '@/components/ui/button';
import { Trophy, Medal, Crown, Star, Users, TrendingUp } from 'lucide-react';
import type { Team } from '@/lib/game-types';

interface TopSeller {
  name: string;
  points: number;
  teamId: string;
}

interface FinalResultsProps {
  teams: Team[];
  topSellers: TopSeller[];
  onRestart: () => void;
}

export function FinalResults({ teams, topSellers, onRestart }: FinalResultsProps) {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const winner = sortedTeams[0];
  const totalPoints = teams.reduce((sum, t) => sum + t.points, 0);

  const getTeamColor = (teamId: string) => {
    const colors: Record<string, string> = {
      leon: 'bg-[oklch(0.7_0.2_45)]',
      tigre: 'bg-[oklch(0.65_0.22_25)]',
      aguila: 'bg-[oklch(0.6_0.18_195)]',
      serpiente: 'bg-[oklch(0.55_0.2_145)]',
    };
    return colors[teamId] || 'bg-primary';
  };

  const getPositionIcon = (position: number) => {
    if (position === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (position === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (position === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return <Star className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-b from-accent/30 to-transparent pt-8 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <Trophy className="w-10 h-10 text-accent animate-pulse-glow" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Resultados Finales del Torneo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monopolio de Ventas: Monteria Edition</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="pb-6 space-y-6">
          {/* Winner Announcement */}
          <div className="bg-gradient-to-br from-accent/20 via-primary/10 to-accent/20 border-2 border-accent/50 rounded-2xl p-5 text-center animate-slide-up">
            <Crown className="w-12 h-12 text-accent mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Grupo Zonal Ganador</p>
            <div className="flex items-center justify-center gap-3">
              <div className={`w-12 h-12 rounded-full ${getTeamColor(winner.id)} flex items-center justify-center text-2xl`}>
                {winner.icon}
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-foreground">{winner.name}</h2>
                <p className="text-2xl font-bold text-accent">{winner.points.toLocaleString()} pts</p>
              </div>
            </div>
          </div>

          {/* Team Rankings */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Clasificacion por Grupo Zonal
            </h3>
            <div className="space-y-2">
              {sortedTeams.map((team, index) => (
                <div
                  key={team.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    index === 0 
                      ? 'bg-accent/10 border-accent/30' 
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    {getPositionIcon(index)}
                  </div>
                  <div className={`w-10 h-10 rounded-full ${getTeamColor(team.id)} flex items-center justify-center text-xl`}>
                    {team.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{team.name}</p>
                    <p className="text-xs text-muted-foreground">Zona {team.id.charAt(0).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground text-lg">{team.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">puntos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Individual Sellers */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Mejores Vendedores Individuales
            </h3>
            <div className="space-y-2">
              {topSellers.slice(0, 2).map((seller, index) => (
                <div
                  key={seller.name}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    index === 0 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-accent/10 border-yellow-500/30' 
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index === 0 ? (
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                        <Medal className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{seller.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Grupo {seller.teamId.charAt(0).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent text-lg">{seller.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">puntos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Resumen del Torneo</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{totalPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Puntos Totales</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <p className="text-2xl font-bold text-accent">30</p>
                <p className="text-xs text-muted-foreground">Dias de Competencia</p>
              </div>
            </div>
          </div>

          {/* Congratulations */}
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30 rounded-xl p-4 text-center">
            <p className="text-foreground font-bold text-balance">
              Felicitaciones a todos los participantes por su dedicacion y esfuerzo durante este mes.
            </p>
            <p className="text-primary text-sm mt-1">El exito se construye con constancia.</p>
          </div>
        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="flex-shrink-0 bg-background border-t border-border px-4 pt-4 pb-6">
        <Button
          onClick={onRestart}
          className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg"
        >
          INICIAR NUEVO CICLO
        </Button>
      </div>
    </div>
  );
}
