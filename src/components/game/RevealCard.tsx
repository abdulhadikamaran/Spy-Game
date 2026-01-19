import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Icon } from '../ui/Icon';

export const RevealCard: React.FC = () => {
  const players = useGameStore(state => state.players);
  const currentPlayerIndex = useGameStore(state => state.currentPlayerIndex);
  const currentWord = useGameStore(state => state.currentWord);
  const nextPlayer = useGameStore(state => state.nextPlayer);

  const player = players[currentPlayerIndex];

  const handleHide = () => {
    nextPlayer();
  };

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (player.isImposter) {
        navigator.vibrate([200, 100, 200]);
      } else {
        navigator.vibrate(50);
      }
    }
  }, [player.isImposter]);

  return (
    <div className="h-screen w-full font-display text-white selection:bg-primary selection:text-white flex flex-col relative overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <header className="relative z-10 w-full pt-12 pb-4 flex-none"></header>

      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-6 py-4">
        <div className="relative w-full max-w-sm aspect-[4/5] max-h-[60vh] rounded-[2.5rem] shadow-2xl border bg-[#1E1E1E] border-white/5 flex flex-col overflow-hidden group">

          <div className="relative z-20 flex flex-col items-center justify-center h-full w-full p-6 text-center gap-8">

            <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-lg bg-white/5 text-primary border border-white/10 overflow-hidden p-6 mb-2">
              {player.isImposter ? (
                <Icon name="visibility" className="text-7xl text-white/90" />
              ) : (
                <Icon name="lock_open" className="text-7xl text-white/90" />
              )}
            </div>

            <div className="space-y-4 flex flex-col items-center w-full">

              {player.isImposter ? (
                <div className="flex flex-col gap-4 items-center w-full animate-in fade-in zoom-in duration-300">
                  <h1 className="text-primary text-5xl md:text-6xl font-black leading-tight text-center tracking-tighter drop-shadow-md">
                    تۆ سیخوڕیت
                  </h1>
                  <p className="text-white/80 text-xl font-bold tracking-wide">
                    هەوڵبدە وشەکە بدۆزیتەوە
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 items-center w-full animate-in fade-in zoom-in duration-300">
                  <p className="text-text-muted text-lg font-bold tracking-widest uppercase opacity-80">
                    وشەکە
                  </p>

                  {typeof currentWord === 'string' ? (
                    <h1 className="text-white text-5xl md:text-6xl font-black leading-tight text-center break-words w-full drop-shadow-lg">{currentWord}</h1>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <h1 className="text-white text-5xl md:text-6xl font-black leading-tight text-center break-words w-full drop-shadow-lg">{currentWord?.ku}</h1>
                      <p className="text-text-muted text-2xl font-bold font-serif italic tracking-wide opacity-80">{currentWord?.en}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full px-6 pb-12 pt-4 flex-none max-w-md mx-auto">
        <button
          onClick={handleHide}
          className="group relative w-full overflow-hidden rounded-3xl bg-[#FDE3CF] text-[#282F32] hover:bg-white active:scale-[0.98] transition-all duration-200 py-5 shadow-[0_0_40px_rgba(253,227,207,0.15)] border-4 border-white/5"
        >
          <div className="relative flex items-center justify-center gap-3">
            <Icon name="check_circle" className="text-3xl" />
            <span className="text-2xl font-black tracking-wide">تێگەیشتم</span>
          </div>
        </button>
      </footer>
    </div>
  );
};