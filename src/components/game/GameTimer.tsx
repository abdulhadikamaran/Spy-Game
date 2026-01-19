import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GamePhase } from '../../types';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

export const GameTimer: React.FC = () => {
  const timerDuration = useGameStore(state => state.settings.timerDuration);
  const players = useGameStore(state => state.players);

  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isPaused, setIsPaused] = useState(false);

  const [firstSpeaker, setFirstSpeaker] = useState<string>("...");
  const [isRolling, setIsRolling] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playTickSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtor) {
          audioCtxRef.current = new AudioCtor();
        }
      }

      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Fail silently for audio permission issues
    }
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      const winnerIdx = Math.floor(Math.random() * players.length);
      const winnerName = players[winnerIdx].name;

      let steps = 0;
      const maxSteps = 15;
      const intervalDuration = 50;

      const shuffleInterval = setInterval(() => {
        const randIdx = Math.floor(Math.random() * players.length);
        setFirstSpeaker(players[randIdx].name);

        steps++;

        if (steps >= maxSteps) {
          clearInterval(shuffleInterval);
          setFirstSpeaker(winnerName);
          setIsRolling(false);

          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
          }
        }
      }, intervalDuration);

      return () => clearInterval(shuffleInterval);
    }
  }, [players]);

  useEffect(() => {
    if (timeLeft <= 0 || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newVal = prev - 1;
        if (newVal < 30 && newVal > 0) {
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
          playTickSound();
        }
        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, playTickSound]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndGame = () => {
    useGameStore.setState({ phase: GamePhase.RESULT });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / timerDuration;
  const dashOffset = circumference * (1 - progress);

  const isUrgent = timeLeft < 30;
  const timerColor = isUrgent ? '#FF3333' : '#FFFFFF';

  return (
    <div className={`bg-background min-h-screen font-display text-white overflow-hidden relative flex flex-col items-center transition-colors duration-500 ${isUrgent ? 'bg-[#1a0505]' : 'bg-background'}`}>
      <motion.div
        animate={{ opacity: isUrgent && !isPaused ? [0, 0.2, 0] : 0.05 }}
        transition={{ duration: isUrgent ? 1 : 4, repeat: Infinity }}
        className="absolute inset-0 bg-primary z-0 pointer-events-none"
      />

      <nav className="relative z-10 w-full flex items-center justify-between px-6 pt-10 pb-4">
        <button
          onClick={togglePause}
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-colors active:scale-95"
        >
          <Icon name={isPaused ? 'play_arrow' : 'pause'} className="text-2xl" />
        </button>
        <div className="text-right">
          <span className="text-primary text-[10px] font-bold uppercase tracking-widest block">دۆخی یاری</span>
          <span className="text-white font-black text-lg">
            {isPaused ? 'وەستاوە' : 'بەردەوامە'}
          </span>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center flex-shrink-0 mt-8 mb-8">

        <div className="mb-8 text-center z-20 flex flex-col items-center justify-center h-24">
          <span className="text-text-muted text-xs font-bold uppercase tracking-widest block mb-2 opacity-80">سەرەتا بەم کەسە دەستپێبکەن</span>
          <motion.div
            layout
            animate={{
              scale: isRolling ? 1 : 1.1,
              borderColor: isRolling ? 'rgba(255,255,255,0.1)' : '#FF3333',
              backgroundColor: isRolling ? 'rgba(255,255,255,0.05)' : 'rgba(255, 51, 51, 0.15)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`px-6 py-3 rounded-2xl inline-block backdrop-blur-sm shadow-glass border transition-colors duration-300 ${!isRolling && 'shadow-[0_0_25px_rgba(255,51,51,0.4)]'}`}
          >
            <span className={`font-black text-xl md:text-2xl drop-shadow-md block min-w-[120px] ${isRolling ? 'opacity-70 blur-[0.5px]' : 'opacity-100 text-white'}`}>
              {firstSpeaker}
            </span>
          </motion.div>
        </div>

        <div className="relative w-80 h-80 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full blur-3xl transition-colors duration-1000 ${isUrgent ? 'bg-primary/30' : 'bg-white/5'}`}></div>

          <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />

            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset, stroke: timerColor }}
              transition={{ duration: 1, ease: "linear" }}
              cx="130"
              cy="130"
              r={radius}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.span
              animate={{ scale: isUrgent && !isPaused ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-7xl font-black tracking-tighter tabular-nums"
              style={{ color: timerColor }}
            >
              {formatTime(timeLeft)}
            </motion.span>
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest mt-2">کات ماوە</span>
          </div>
        </div>
      </main>

      <section className="relative z-10 flex-1 w-full max-w-md px-6 pb-28 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="group" className="text-text-muted text-sm" />
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">یاریزانەکان ({players.length})</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide mask-image-bottom">
          {players.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-xs font-bold">
                  {p.name.charAt(0)}
                </div>
                <span className="font-bold text-sm">{p.name}</span>
              </div>
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full bg-green-500 ${!isPaused ? 'animate-pulse' : ''}`}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-background via-background to-transparent pt-12">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleEndGame}
            className="w-full h-16 bg-primary hover:bg-primary-hover active:scale-[0.98] rounded-2xl shadow-glow flex items-center justify-center gap-3 transition-all"
          >
            <Icon name="visibility" className="text-2xl animate-pulse" />
            <span className="text-lg font-black tracking-wide">ئاشکراکردنی ڕاستی</span>
          </button>
        </div>
      </div>
    </div>
  );
};