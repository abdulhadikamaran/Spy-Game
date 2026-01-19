import React from 'react';
import { Icon } from '../ui/Icon';

interface RecentHistoryProps {
  names: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({ names, onAdd, onRemove }) => {
  if (names.length === 0) return null;

  return (
    <div className="mb-2">
      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2 opacity-70">
        یاریزانانی پێشوو:
      </p>
      <div className="flex flex-wrap gap-2">
        {names.map((name, idx) => (
          <div
            key={`${name}-${idx}`}
            onClick={() => onAdd(name)}
            className="group pl-3 pr-2 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 transition-colors text-xs font-bold text-white flex items-center gap-2 active:scale-95 cursor-pointer select-none"
          >
            <Icon name="history" className="text-[14px] opacity-70 group-hover:opacity-100" />
            <span>{name}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(name);
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-500 transition-colors"
              title="سڕینەوە"
            >
              <span className="text-lg leading-none mb-0.5">×</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};