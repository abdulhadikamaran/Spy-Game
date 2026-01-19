import React, { useState } from 'react';
import { Icon } from '../ui/Icon';

interface PlayerInputProps {
  onAdd: (name: string) => void;
}

export const PlayerInput: React.FC<PlayerInputProps> = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <input
        className="w-full h-14 pl-14 pr-5 rounded-2xl bg-input-bg border-2 border-transparent focus:border-primary/50 focus:bg-[#222] text-text-main placeholder:text-text-muted/50 font-bold outline-none transition-all shadow-inner-depth"
        placeholder="ناوی یاریزان..."
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="absolute left-2 top-2 bottom-2 w-10 bg-primary disabled:bg-white/5 rounded-xl flex items-center justify-center text-white transition-all shadow-lg active:scale-90"
      >
        <Icon name="add" />
      </button>
    </form>
  );
};