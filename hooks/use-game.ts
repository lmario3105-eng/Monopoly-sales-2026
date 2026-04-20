'use client';

import { useState, useCallback, useEffect } from 'react';
import type { GameState, ActivityItem, Team, TeamId } from '@/lib/game-types';
import { TEAMS, BOARD_TILES, RANDOM_EVENTS } from '@/lib/game-types';

// Demo settings: 1 real second = 1 game minute
// 1 day = 8 hours (480 minutes) = 480 seconds in demo
// 30 days = 14400 seconds in demo
// For faster demo: 1 day every 30 seconds (30 days = 15 minutes)
const SECONDS_PER_GAME_DAY = 30; // 30 real seconds = 1 game day
const TOTAL_GAME_DAYS = 30;

interface ExtendedGameState extends GameState {
  monthDay: number;
  totalDays: number;
  isMonthComplete: boolean;
}

const createInitialState = (): ExtendedGameState => ({
  teams: TEAMS.map(team => ({ ...team })),
  currentTeamIndex: 0,
  tiles: BOARD_TILES,
  activities: [],
  isRolling: false,
  lastRoll: null,
  gameStarted: true,
  elapsedTime: 0,
  monthDay: 1,
  totalDays: TOTAL_GAME_DAYS,
  isMonthComplete: false,
});

export function useGame() {
  const [state, setState] = useState<ExtendedGameState>(createInitialState);

  // Game clock and day progression
  useEffect(() => {
    if (!state.gameStarted || state.isMonthComplete) return;
    
    const interval = setInterval(() => {
      setState(prev => {
        const newElapsedTime = prev.elapsedTime + 1;
        const newMonthDay = Math.min(
          Math.floor(newElapsedTime / SECONDS_PER_GAME_DAY) + 1,
          TOTAL_GAME_DAYS
        );
        const isComplete = newMonthDay >= TOTAL_GAME_DAYS && 
          (newElapsedTime % SECONDS_PER_GAME_DAY) >= SECONDS_PER_GAME_DAY - 1;
        
        return {
          ...prev,
          elapsedTime: newElapsedTime,
          monthDay: newMonthDay,
          isMonthComplete: isComplete,
        };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.gameStarted, state.isMonthComplete]);

  // Add activity
  const addActivity = useCallback((
    teamId: TeamId,
    message: string,
    type: ActivityItem['type'],
    points?: number
  ) => {
    const activity: ActivityItem = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      teamId,
      message,
      type,
      points,
    };
    
    setState(prev => ({
      ...prev,
      activities: [...prev.activities, activity],
    }));
  }, []);

  // Get a roll for current team
  const getRoll = useCallback(() => {
    setState(prev => {
      const teams = [...prev.teams];
      teams[prev.currentTeamIndex] = {
        ...teams[prev.currentTeamIndex],
        rolls: teams[prev.currentTeamIndex].rolls + 1,
      };
      
      return { ...prev, teams };
    });
    
    const team = state.teams[state.currentTeamIndex];
    addActivity(team.id, `${team.name} obtuvo un lanzamiento`, 'roll');
  }, [state.teams, state.currentTeamIndex, addActivity]);

  // Roll dice
  const rollDice = useCallback(() => {
    const team = state.teams[state.currentTeamIndex];
    
    if (team.rolls <= 0 || state.isRolling) return;
    
    setState(prev => ({ ...prev, isRolling: true }));
    
    // Simulate rolling animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      
      setState(prev => {
        const teams = [...prev.teams];
        const currentTeam = { ...teams[prev.currentTeamIndex] };
        
        // Update rolls
        currentTeam.rolls = currentTeam.rolls - 1;
        
        // Calculate new position
        const totalTiles = BOARD_TILES.length;
        const newPosition = (currentTeam.position + roll) % totalTiles;
        currentTeam.position = newPosition;
        
        // Get the tile landed on
        const tile = BOARD_TILES[newPosition];
        
        // Calculate points
        let pointsEarned = tile.points;
        
        // Affinity bonus
        if (currentTeam.affinity.includes(tile.type as any)) {
          pointsEarned = Math.floor(pointsEarned * 1.2);
        }
        
        currentTeam.points += pointsEarned;
        
        // Handle special tiles
        if (tile.type === 'comodin') {
          currentTeam.comodines += 1;
        }
        
        if (tile.type === 'recompensa') {
          const bonus = 50 + Math.floor(Math.random() * 50);
          currentTeam.points += bonus;
          pointsEarned += bonus;
        }
        
        teams[prev.currentTeamIndex] = currentTeam;
        
        // Next team
        const nextTeamIndex = (prev.currentTeamIndex + 1) % teams.length;
        
        // Give next team a roll if they have none
        if (teams[nextTeamIndex].rolls === 0) {
          teams[nextTeamIndex] = {
            ...teams[nextTeamIndex],
            rolls: 1,
          };
        }
        
        return {
          ...prev,
          teams,
          currentTeamIndex: nextTeamIndex,
          isRolling: false,
          lastRoll: roll,
        };
      });
      
      // Add activities
      addActivity(team.id, `${team.name} lanzo un ${roll}`, 'roll');
      
      const tile = BOARD_TILES[(team.position + roll) % BOARD_TILES.length];
      addActivity(
        team.id,
        `${team.name} cayo en ${tile.name}`,
        tile.type === 'comodin' ? 'comodin' : 
        tile.type === 'recompensa' ? 'reward' :
        tile.type === 'evento' ? 'event' : 'move',
        tile.points
      );
      
      // Random global event
      if (Math.random() < 0.15) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        addActivity(team.id, event.message, 'event');
      }
      
    }, 800);
  }, [state.teams, state.currentTeamIndex, state.isRolling, addActivity]);

  // Reset game
  const resetGame = useCallback(() => {
    setState(createInitialState());
  }, []);

  // Select team (for demo purposes)
  const selectTeam = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentTeamIndex: index }));
  }, []);

  // Generate mock top sellers for demo
  const getTopSellers = useCallback(() => {
    const sellers = [
      { name: 'Carlos Martinez', points: Math.floor(state.teams[0].points * 0.4), teamId: 'leon' },
      { name: 'Maria Gonzalez', points: Math.floor(state.teams[1].points * 0.35), teamId: 'tigre' },
      { name: 'Juan Perez', points: Math.floor(state.teams[2].points * 0.3), teamId: 'aguila' },
      { name: 'Ana Rodriguez', points: Math.floor(state.teams[3].points * 0.38), teamId: 'serpiente' },
    ];
    return sellers.sort((a, b) => b.points - a.points);
  }, [state.teams]);

  return {
    state,
    getRoll,
    rollDice,
    resetGame,
    selectTeam,
    getTopSellers,
  };
}
