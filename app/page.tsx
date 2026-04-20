'use client';

import { useState, Component, type ReactNode } from 'react';
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

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; msg: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, msg: '' };
  }
  static getDerivedStateFromError(e: Error) {
    return { hasError: true, msg: e.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="bg-card border border-destructive rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <p className="text-destructive font-bold text-lg">Error al cargar la aplicación</p>
            <p className="text-muted-foreground text-sm font-mono break-all">{this.state.msg}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function GameContent() {
  const { state, getRoll, rollDice, resetGame, selectTeam, getTopSellers } = useGame();
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showStats, setShowStats] = useState(false);

  // Validaciones defensivas
  if (!state || !state.teams || !Array.isArray(state.teams)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-destructive font-bold mb-4">Inicializando juego...</p>
          <p className="text-muted-foreground">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  const currentTeam = state.teams[state.currentTeamIndex];

  if (showWelcome) {
    return <WelcomeModal onStart={() => setShowWelcome(false)} />;
  }

  if (state.isMonthComplete) {
    return (
      <FinalResults
        teams={state.teams}
        topSellers={getTopSellers()}
        onRestart={() => {
          resetGame();
          setShowWelcome(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <Header
        teams={state.teams}
        elapsedTime={state.elapsedTime}
        monthDay={state.monthDay}
        totalDays={state.totalDays}
      />

      {/* Main Content Grid - Responsive Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Left Column - Board & Controls */}
          <div className="lg:col-span-2 flex flex-col min-h-0 space-y-4">
            {/* Board */}
            <div className="flex-shrink-0">
              <Board
                tiles={state.tiles}
                teams={state.teams}
                currentTeamIndex={state.currentTeamIndex}
                onTileClick={setSelectedTile}
              />
            </div>

            {/* Team Panel */}
            <div className="flex-shrink-0">
              <TeamPanel
                teams={state.teams}
                currentTeamIndex={state.currentTeamIndex}
                onSelectTeam={selectTeam}
              />
            </div>

            {/* Game Controls */}
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

          {/* Right Column - Activity Feed & Stats (Scrollable) */}
          <div className="flex flex-col min-h-0 space-y-4 overflow-y-auto">
            {/* Stats Button */}
            <button
              onClick={() => setShowStats(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
            >
              <BarChart3 className="w-4 h-4" />
              Ver Estadísticas
            </button>

            {/* Chat Button */}
            <Link
              href="/chat"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
            >
              <MessageCircle className="w-4 h-4" />
              Abrir Chat
            </Link>

            {/* WhatsApp Status */}
            <div className="flex-shrink-0">
              <WhatsAppStatus />
            </div>

            {/* Admin Panel */}
            <div className="flex-shrink-0">
              <AdminPanel isAdmin={false} />
            </div>

            {/* Activity Feed - Scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ActivityFeed activities={state.activities} />
            </div>

            {/* WhatsApp Sync */}
            <div className="flex-shrink-0">
              <WhatsAppSync />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TileModal
        tile={selectedTile}
        open={selectedTile !== null}
        onClose={() => setSelectedTile(null)}
      />

      {/* Stats Modal */}
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        players={state.teams.flatMap((t, idx) =>
          t.members.map((member, memberIdx) => ({
            id: `${idx}-${memberIdx}`,
            name: member,
            team: t.name,
            salesPoints: Math.floor(Math.random() * 1000),
            recruits: Math.floor(Math.random() * 50),
            position: memberIdx + 1,
            trend: Math.random() > 0.5 ? 1 : -1,
          }))
        )}
        teams={state.teams.map((t) => ({
          name: t.name,
          totalPoints: t.salesPoints,
          memberCount: t.members.length,
          avgPerPerson: Math.floor(t.salesPoints / t.members.length),
          topPerformer: t.members[0] || 'N/A',
        }))}
      />
    </div>
  );
}

export default function GamePage() {
  return (
    <ErrorBoundary>
      <GameContent />
    </ErrorBoundary>
  );
}
