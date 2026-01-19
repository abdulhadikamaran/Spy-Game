import React from 'react';
import { Icon } from '../ui/Icon';

interface SpySelectorProps {
  count: number;
  onChange: (n: number) => void;
  playerCount: number;
  onError: (msg: string) => void;
}

export const SpySelector: React.FC<SpySelectorProps> = React.memo(({ count, onChange, playerCount, onError }) => {

  const handleSelect = (n: number) => {
    // Validation Logic
    if (n === 2 && playerCount < 5) {
      onError("بۆ دیاریکردنی ٢ سیخوڕ، پێویستە لانی کەم ٥ یاریزان هەبن");
      return;
    }
    if (n === 3 && playerCount < 7) {
      onError("بۆ دیاریکردنی ٣ سیخوڕ، پێویستە لانی کەم ٧ یاریزان هەبن");
      return;
    }
    onChange(n);
  };

  const getCardStatus = (n: number) => {
    if (n === 2 && playerCount < 5) return 'locked';
    if (n === 3 && playerCount < 7) return 'locked';
    return count === n ? 'active' : 'idle';
  };

  const renderIcons = (n: number) => {
    return (
      <div className="flex -space-x-3 rtl:space-x-reverse justify-center py-2">
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#1E1E1E] ${count === n ? 'bg-white text-primary' : 'bg-[#333] text-gray-500'}`}>
            <Icon name="fingerprint" className="text-[16px]" />
          </div>
        ))}
      </div>
    );
  };

  const Card = ({ n }: { n: number }) => {
    const status = getCardStatus(n);
    const isLocked = status === 'locked';
    const isActive = status === 'active';

    return (
      <button
        onClick={() => handleSelect(n)}
        className={`relative flex-1 aspect-[3/4] rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${isActive
            ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(255,51,51,0.2)] scale-105 z-10'
            : isLocked
              ? 'bg-white/5 border-transparent opacity-50 grayscale'
              : 'bg-surface border-white/5 hover:border-white/20'
          }`}
      >
        {isLocked && (
          <div className="absolute top-2 right-2">
            <Icon name="lock" className="text-text-muted text-sm" />
          </div>
        )}

        {renderIcons(n)}

        <span className={`text-2xl font-black ${isActive ? 'text-primary' : 'text-white'}`}>
          {n}
        </span>
        <span className="text-[10px] uppercase font-bold text-text-muted">سیخوڕ</span>
      </button>
    );
  };

  return (
    <div className="flex gap-3 w-full">
      <Card n={1} />
      <Card n={2} />
      <Card n={3} />
    </div>
  );
});