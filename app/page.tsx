'use client';

import { useState, Component, type ReactNode, Suspense } from 'react';
import { useGame } from '@/hooks/use-game';
import type { Tile } from '@/lib/game-types';
import { Header } from '@/components/game/Header';
import { Board } from '@/components/game/Board';
import { TeamPanel } from '@/components/game/TeamPanel';
import { ActivityFeed } from '@/components/game/ActivityFeed';
import { GameControls } from '@/components/game/GameControls';
import { TileModal } from '@/components/game/TileModal';
import { WelcomeModal } from '@/components/game/WelcomeModal';
import { FinalResults } from '@/components/game/FinalResults';
import { WhatsAppSync } from '@/components/game/WhatsAppSync';
import { AdminPanel } from '@/components/game/AdminPanel';
import { StatsModal } from '@/components/dashboard/StatsModal';
import { WhatsAppStatus } from '@/components/dashboard/WhatsAppStatus';
import { BarChart3, MessageCircle } from 'lucide-react';
import Link from 'next/link';

class GameErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; msg: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, msg: '' };
  }
  static getDerivedStateFromError(e: Error) {
    console.error('[Game Error]:', e);
    return { hasError: true, msg: e.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="bg-card border border-destructive rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <p className="text-destructive font-bold text-lg">Error en el Juego</p>
            <p className="text-muted-foreground text-sm font-mono break-all">{this.state.msg}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl"
            >
              Recargar Juego
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function GameBoard() {
  const { state, getRoll, rollDice, resetGame, selectTeam, getTopSellers } = useGame();
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showStats, setShowStats] = useState(false);

  console.log('[v0] Juego cargado:', { teamsCount: state.teams?.length, hasState: !!state });

  // Renderizado seguro con validaciones
  if (!state?.teams || state.teams.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎲</div>
          <p className="text-muted-foreground">Inicializando juego...</p>
        </div>
      </div>
    );
  }

  const currentTeam = state.teams[state.currentTeamIndex] || state.teams[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 flex flex-col overflow-hidden">
      <Header
        teams={state.teams}
        elapsedTime={state.elapsedTime}
        monthDay={state.monthDay}
        totalDays={state.totalDays}
      />

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          <div className="lg:col-span-2 flex flex-col min-h-0 space-y-4">
            <div className="flex-shrink-0">
              <Board
                tiles={state.tiles || []}
                teams={state.teams}
                currentTeamIndex={state.currentTeamIndex}
                onTileClick={setSelectedTile}
              />
            </div>

            <div className="flex-shrink-0">
              <TeamPanel
                teams={state.teams}
                currentTeamIndex={state.currentTeamIndex}
                onSelectTeam={selectTeam}
              />
            </div>

            <div className="flex-shrink-0">
              <GameControls
                currentTeam={currentTeam}
                isRolling={state.isRolling}
                lastRoll={state.lastRoll}
                onGetRoll={getRoll}
                onRollDice={rollDice}
                onReset={resetGame}
              />
            </div>
          </div>

          <div className="flex flex-col min-h-0 space-y-4 overflow-y-auto">
            <button
              onClick={() => setShowStats(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
            >
              <BarChart3 className="w-4 h-4" />
              Estadísticas
            </button>

            <Link
              href="/chat"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Link>

            <div className="flex-shrink-0">
              <WhatsAppStatus />
            </div>

            <div className="flex-shrink-0">
              <AdminPanel isAdmin={false} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <ActivityFeed activities={state.activities || []} />
            </div>

            <div className="flex-shrink-0">
              <WhatsAppSync />
            </div>
          </div>
        </div>
      </div>

      <TileModal
        tile={selectedTile}
        open={selectedTile !== null}
        onClose={() => setSelectedTile(null)}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        players={(state.teams || []).flatMap((t, idx) =>
          (t.members || []).map((member, memberIdx) => ({
            id: `${idx}-${memberIdx}`,
            name: member,
            team: t.name,
            salesPoints: state.teams[idx].points || 0,
            recruits: 0,
            position: memberIdx + 1,
            trend: 1,
          }))
        )}
        teams={(state.teams || []).map((t) => ({
          name: t.name,
          totalPoints: t.points || 0,
          memberCount: t.members?.length || 0,
          avgPerPerson: Math.floor((t.points || 0) / (t.members?.length || 1)),
          topPerformer: t.members?.[0] || 'N/A',
        }))}
      />
    </div>
  );
}

function GamePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeModal onStart={() => setShowWelcome(false)} />;
  }

  return (
    <GameErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>}>
        <GameBoard />
      </Suspense>
    </GameErrorBoundary>
  );
}

export default GamePage;
