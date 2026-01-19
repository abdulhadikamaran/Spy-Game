import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../../types';
import { Icon } from '../ui/Icon';

interface PlayerListProps {
  players: Player[];
  onRemove: (id: string) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-2 min-h-[40px]">
      <AnimatePresence mode="popLayout">
        {players.map(player => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            key={player.id}
            className="group flex items-center gap-2 bg-white/5 pl-2 pr-4 py-2 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {player.name.charAt(0)}
            </div>
            <span className="font-bold text-sm">{player.name}</span>
            <button
              onClick={() => onRemove(player.id)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-text-muted hover:bg-white/10 hover:text-primary transition-colors"
            >
              <Icon name="close" className="text-[16px]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {players.length === 0 && (
        <div className="w-full flex items-center justify-center py-4 opacity-50">
          <p className="text-text-muted text-sm italic text-center">ناوی یاریزانەکان زیاد بکە...</p>
        </div>
      )}
    </div>
  );
};