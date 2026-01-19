import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Icon } from '../ui/Icon';

export const Result: React.FC = () => {
  const players = useGameStore(state => state.players);
  const currentWord = useGameStore(state => state.currentWord);
  const resetToLobby = useGameStore(state => state.resetToLobby);
  const restartSameSettings = useGameStore(state => state.restartSameSettings);

  const [isRevealed, setIsRevealed] = useState(false);

  const imposters = players.filter(p => p.isImposter);
  const imposterNames = imposters.map(p => p.name).join(' ، ');

  return (
    <div className="bg-background min-h-screen flex flex-col relative overflow-hidden text-text-light transition-colors duration-300">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>

      <div className="relative z-10 flex flex-col h-full min-h-screen w-full max-w-md mx-auto p-6 justify-between">
        <header className="flex flex-col items-center pt-8">
          <h1 className="text-text-light text-xl font-bold tracking-wide uppercase opacity-90 mb-1">ئەنجامی یاری</h1>
          <div className="h-1 w-12 bg-text-light/20 rounded-full"></div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center py-6 w-full">
          {!isRevealed ? (
            <button
              onClick={() => setIsRevealed(true)}
              className="w-full max-w-xs bg-surface rounded-3xl shadow-ceramic p-8 flex flex-col items-center justify-center space-y-4 hover:scale-[1.01] transition-transform active:scale-95 border border-white/5"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-2 animate-pulse">
                <Icon name="visibility" className="text-4xl text-primary" />
              </div>
              <h2 className="text-2xl font-black text-primary">بینینی ئەنجام</h2>
            </button>
          ) : (
            <>
              <div className="mb-6 transform -rotate-2">
                <div className="bg-primary-dark text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/10">
                  <Icon name="verified" className="text-lg" />
                  <span className="text-md font-bold tracking-normal">ئەنجامەکان</span>
                </div>
              </div>

              <div className="w-full max-w-xs bg-surface rounded-3xl shadow-ceramic overflow-hidden relative group transition-transform duration-500 animate-fade-in-up border border-white/5">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>

                <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 relative z-10">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden p-3">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white/90" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 10C5 6 7 4 12 4C17 4 19 6 19 10V12H5V10Z" fill="currentColor" />
                        <rect x="4" y="11" width="16" height="3" fill="#333" />
                        <circle cx="7" cy="15" r="3" fill="currentColor" />
                        <circle cx="17" cy="15" r="3" fill="currentColor" />
                        <line x1="10" y1="15" x2="14" y2="15" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-text-light/60 text-xs font-bold tracking-wide mb-1">سیخوڕەکە</p>
                  <h2 className="text-accent text-2xl font-black leading-tight text-center">{imposterNames}</h2>
                </div>

                <div className="relative w-full h-4 flex items-center justify-center overflow-hidden">
                  <div className="absolute w-[80%] border-t border-dashed border-white/10"></div>
                </div>

                <div className="flex flex-col items-center justify-center pt-4 pb-8 px-6 relative z-10">
                  <p className="text-text-light/60 text-xs font-bold tracking-wide mb-2">وشەی نهێنی</p>
                  {typeof currentWord === 'string' ? (
                    <h3 className="text-text-light text-3xl font-black leading-none tracking-tight drop-shadow-sm opacity-90">{currentWord}</h3>
                  ) : (
                    <div className="text-center">
                      <h3 className="text-text-light text-3xl font-black leading-none tracking-tight drop-shadow-sm opacity-90">{currentWord?.ku}</h3>
                      <p className="text-text-light/60 text-sm font-bold mt-1">{currentWord?.en}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>

        <footer className="w-full flex flex-col gap-3 pb-8 items-center">
          <button
            onClick={restartSameSettings}
            className="relative w-full overflow-hidden rounded-2xl bg-primary text-white h-20 shadow-glow active:shadow-none active:scale-[0.98] transition-all duration-200 group flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="flex flex-col items-center justify-center relative z-10">
              <Icon name="replay" className="text-3xl mb-0.5 group-hover:rotate-[-360deg] transition-transform duration-700" />
              <span className="text-xl font-black tracking-wide">دووبارەکردنەوە</span>
            </div>
          </button>

          <button
            onClick={resetToLobby}
            className="text-text-muted hover:text-white py-3 px-6 text-sm font-bold transition-colors flex items-center gap-2 opacity-60 hover:opacity-100"
          >
            <Icon name="home" className="text-lg" />
            گەڕانەوە بۆ سەرەتا
          </button>
        </footer>
      </div>
    </div>
  );
};