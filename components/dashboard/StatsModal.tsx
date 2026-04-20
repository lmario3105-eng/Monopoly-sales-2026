'use client';

import { useState } from 'react';
import { X, TrendingUp, Users, Trophy, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Player {
  id: string;
  name: string;
  team: string;
  salesPoints: number;
  recruits: number;
  position: number;
  trend: number;
}

interface TeamStats {
  name: string;
  totalPoints: number;
  memberCount: number;
  avgPerPerson: number;
  topPerformer: string;
}

export interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  players?: Player[];
  teams?: TeamStats[];
}

export function StatsModal({ isOpen, onClose, players = [], teams = [] }: StatsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Estadísticas Detalladas
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="teams">Equipos</TabsTrigger>
            <TabsTrigger value="players">Jugadores</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Total Jugadores</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{players.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Total Equipos</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{teams.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Puntos Totales</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {players.reduce((sum, p) => sum + p.salesPoints, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Reclutamientos</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {players.reduce((sum, p) => sum + p.recruits, 0)}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-3 mt-4">
            {teams.length > 0 ? (
              teams.map((team, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    <span className="text-sm font-bold text-blue-600">
                      {team.totalPoints} pts
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="text-xs text-gray-500">Miembros</span>
                      <p className="font-semibold text-gray-900">{team.memberCount}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Promedio/Persona</span>
                      <p className="font-semibold text-gray-900">{team.avgPerPerson}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Top Rendidor</span>
                      <p className="font-semibold text-gray-900 truncate">{team.topPerformer}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay datos de equipos disponibles</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="players" className="space-y-2 mt-4 max-h-80 overflow-y-auto">
            {players.length > 0 ? (
              players
                .sort((a, b) => a.position - b.position)
                .map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full text-sm">
                        {player.position}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{player.name}</p>
                        <p className="text-xs text-gray-500">{player.team}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-xs text-gray-500">Puntos</p>
                        <p className="font-bold text-gray-900">{player.salesPoints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reclutos</p>
                        <p className="font-bold text-gray-900">{player.recruits}</p>
                      </div>
                      {player.trend > 0 && (
                        <div className="text-green-600">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay datos de jugadores disponibles</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
