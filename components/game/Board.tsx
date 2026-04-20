'use client';

import { cn } from '@/lib/utils';
import type { Tile, Team, TileType } from '@/lib/game-types';
import { TILE_ICONS } from '@/lib/game-types';

interface BoardProps {
  tiles: Tile[];
  teams: Team[];
  currentTeamIndex: number;
  onTileClick?: (tile: Tile) => void;
}

const getTileColorClass = (type: TileType): string => {
  const colors: Record<TileType, string> = {
    vape: 'bg-tile-vape',
    destilado: 'bg-tile-destilado',
    ropa: 'bg-tile-ropa',
    accesorios: 'bg-tile-accesorios',
    comodin: 'bg-tile-comodin',
    recompensa: 'bg-tile-recompensa',
    evento: 'bg-tile-evento',
    inicio: 'bg-primary',
  };
  return colors[type];
};

const getTeamColorClass = (color: string): string => {
  const colors: Record<string, string> = {
    'team-leon': 'bg-team-leon border-team-leon',
    'team-tigre': 'bg-team-tigre border-team-tigre',
    'team-aguila': 'bg-team-aguila border-team-aguila',
    'team-serpiente': 'bg-team-serpiente border-team-serpiente',
  };
  return colors[color] || '';
};

export function Board({ tiles, teams, currentTeamIndex, onTileClick }: BoardProps) {
  // Validar props
  if (!tiles || !Array.isArray(tiles) || tiles.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Tablero no disponible</div>;
  }

  if (!teams || !Array.isArray(teams) || teams.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Equipos no disponibles</div>;
  }

  // Create a 6x6 grid
  const gridSize = 6;
  
  // Get tile at specific position
  const getTileAt = (x: number, y: number): Tile | undefined => {
    return tiles.find(t => t.x === x && t.y === y);
  };
  
  // Get teams at specific tile
  const getTeamsAtTile = (tileId: number): Team[] => {
    return teams.filter(team => team.position === tileId);
  };

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto p-2">
      {/* Board Background with Montería Map feel */}
      <div className="absolute inset-2 bg-gradient-to-br from-secondary/30 via-card to-secondary/30 rounded-xl border border-border/50" />
      
      {/* Center area with city info */}
      <div className="absolute inset-[20%] bg-card/80 rounded-xl border border-border flex flex-col items-center justify-center p-2 z-10">
        <div className="text-2xl mb-1">🏙️</div>
        <h2 className="text-xs font-bold text-primary text-center">MONTERÍA</h2>
        <p className="text-[10px] text-muted-foreground text-center">Capital del Sinú</p>
        <div className="mt-2 grid grid-cols-2 gap-1 text-[9px]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zone-a" />
            <span className="text-muted-foreground">Zona A</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zone-b" />
            <span className="text-muted-foreground">Zona B</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zone-c" />
            <span className="text-muted-foreground">Zona C</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zone-d" />
            <span className="text-muted-foreground">Zona D</span>
          </div>
        </div>
      </div>
      
      {/* Grid of tiles */}
      <div className="relative grid grid-cols-6 gap-1 p-2 h-full">
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const tile = getTileAt(x, y);
          const cellKey = `cell-${x}-${y}`;
          
          // Only render outer ring tiles
          const isEdge = x === 0 || x === 5 || y === 0 || y === 5;
          
          if (!isEdge || !tile) {
            return <div key={cellKey} className="aspect-square" />;
          }
          
          const teamsOnTile = getTeamsAtTile(tile.id);
          const isCurrentTeamHere = teamsOnTile.some((_, i) => 
            teams.findIndex(t => t.id === teamsOnTile[i]?.id) === currentTeamIndex
          );
          
          return (
            <button
              key={cellKey}
              onClick={() => onTileClick?.(tile)}
              className={cn(
                'relative aspect-square rounded-lg transition-all duration-300',
                getTileColorClass(tile.type),
                'flex flex-col items-center justify-center p-0.5',
                'hover:scale-105 hover:z-20',
                'border-2 border-white/20',
                isCurrentTeamHere && 'ring-2 ring-primary ring-offset-1 ring-offset-background'
              )}
            >
              {/* Tile content */}
              <span className="text-base leading-none">{TILE_ICONS[tile.type]}</span>
              <span className="text-[7px] font-medium text-white/90 leading-tight text-center mt-0.5 line-clamp-1">
                {tile.name}
              </span>
              {tile.points > 0 && (
                <span className="text-[8px] font-bold text-white/80">
                  +{tile.points}
                </span>
              )}
              
              {/* Teams on tile */}
              {teamsOnTile.length > 0 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {teamsOnTile.map((team, i) => (
                    <div
                      key={team.id}
                      className={cn(
                        'w-4 h-4 rounded-full flex items-center justify-center text-[10px]',
                        'border-2 border-white shadow-lg',
                        getTeamColorClass(team.color),
                        teams[currentTeamIndex]?.id === team.id && 'animate-pulse-glow'
                      )}
                      style={{ 
                        transform: `translateX(${i * 4 - (teamsOnTile.length - 1) * 2}px)`,
                        zIndex: 20 + i 
                      }}
                    >
                      {team.icon}
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
