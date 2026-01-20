import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { GamePhase } from '../../types';
import { Icon } from '../ui/Icon';

export const Handover: React.FC = () => {
  const players = useGameStore(state => state.players);
  const currentPlayerIndex = useGameStore(state => state.currentPlayerIndex);
  const resetToLobby = useGameStore(state => state.resetToLobby);

  const controls = useAnimation();
  const [isExiting, setIsExiting] = useState(false);

  const handleGoHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetToLobby();
  };

  const currentPlayer = players[currentPlayerIndex];

  const handleTap = async () => {
    if (isExiting) return;
    setIsExiting(true);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    await controls.start({
      rotateY: -90,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" }
    });

    useGameStore.setState({ phase: GamePhase.REVEAL });
  };

  return (
    <motion.div
      className="bg-[#371211] min-h-screen w-full flex flex-col relative overflow-hidden font-display text-white selection:bg-[#E51E1B] selection:text-white cursor-pointer"
      dir="rtl"
      initial={{ rotateY: 0, opacity: 1 }}
      animate={controls}
      style={{ transformOrigin: "left center", perspective: "1000px" }}
      onClick={handleTap}
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full border-[40px] border-white/5 opacity-50 blur-3xl"></div>
        <div className="absolute top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#7D1416]/40 blur-3xl mix-blend-screen"></div>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4WgIYFPWZANALDqYQgzuOEsxnBSGtp18P8MnA9cO_imz7bah6NTOv-uO2lDoBPfgKKJCc9_c4dxAx3pzZ-nYesf-Py6qsiB8Pc9ChRTXUmWLHhXY4Yi6Jc2OOdMA_JNSdiQJuUuf4YIy7bozKF9aGB_VoAIilii_LNUFsb1FedlOLgSnDOUSTp1MlA41Cywo3g5RHpe-W_t4wVKoD0IgyLaZi5q-JOM8HZ26zdi4SSdbHEyrnMe6pvxFDF9YEii_EpXvjeS0RoMUM')" }}></div>
      </div>

      <header className="relative z-10 w-full flex justify-between items-start pt-6 px-4 pb-4">
        <div className="w-10" /> {/* Spacer for balance */}
        <div /> {/* Center spacer */}
        <button
          onClick={handleGoHome}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-200 active:scale-95 pointer-events-auto"
          title="گەڕانەوە بۆ لۆبی"
        >
          <Icon name="home" className="text-lg text-white/80" />
        </button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6 -mt-10 pointer-events-none">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-[#E51E1B]/30 rounded-full blur-xl transform group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <Icon name="person" className="text-5xl text-white/90" />
          </div>
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#E51E1B] rounded-full flex items-center justify-center border-4 border-[#371211] shadow-sm">
            <Icon name="priority_high" className="text-[#371211] text-sm" />
          </div>
        </div>

        <h2 className="text-lg md:text-xl font-medium text-white/70 mb-3 text-center tracking-wide">
          مۆبایلەکە بدە بە
        </h2>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center leading-[1.1] tracking-tight drop-shadow-xl">
          {currentPlayer.name}
        </h1>

        <div className="w-12 h-1.5 bg-[#E51E1B] rounded-full mt-8 opacity-90 shadow-[0_0_20px_rgba(229,30,27,0.6)]"></div>
      </main>

      <footer className="relative z-10 w-full flex flex-col items-center pb-8 pt-12 bg-gradient-to-t from-[#7D1416]/80 to-transparent pointer-events-none">
        <p className="text-base md:text-lg font-bold text-[#E51E1B] mb-6 tracking-wide text-center bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/5 shadow-sm">
          لەسەر شاشە بدە بۆ کردنەوە
        </p>
        <div className="flex flex-col items-center justify-center h-20 w-full group animate-pulse">
          <Icon name="touch_app" className="text-6xl text-[#E51E1B] drop-shadow-[0_2px_15px_rgba(229,30,27,0.5)]" />
        </div>
        <div className="h-1.5 w-32 rounded-full bg-white/20 mt-4 mx-auto"></div>
      </footer>

    </motion.div>
  );
};