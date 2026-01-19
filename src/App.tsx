import React from 'react';
import { useGameStore } from './store/gameStore';
import { GamePhase } from './types';
import { Lobby } from './components/lobby/Lobby';
import { Handover } from './components/game/Handover';
import { RevealCard } from './components/game/RevealCard';
import { GameTimer } from './components/game/GameTimer';
import { Result } from './components/game/Result';
import { InstallPrompt } from './components/ui/InstallPrompt';

function App() {
  const phase = useGameStore((state) => state.phase);

  const renderPhase = () => {
    switch (phase) {
      case GamePhase.LOBBY:
        return <Lobby />;
      case GamePhase.HANDOVER:
        return <Handover />;
      case GamePhase.REVEAL:
        return <RevealCard />;
      case GamePhase.PLAYING:
        return <GameTimer />;
      case GamePhase.RESULT:
        return <Result />;
      default:
        return <Lobby />;
    }
  };

  return (
    <div className="font-sans antialiased text-brand-text" dir="rtl">
      {renderPhase()}
      <InstallPrompt />
    </div>
  );
}

export default App;