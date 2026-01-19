export type WordItem = string | { en: string; ku: string };

export interface Category {
  id: string;
  name: string;
  items: WordItem[];
  isBilingual: boolean;
}

export enum GamePhase {
  LOBBY = 'LOBBY',
  HANDOVER = 'HANDOVER',
  REVEAL = 'REVEAL',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT'
}

export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
}

export type WordSource = 'SYSTEM' | 'CUSTOM' | 'MIXED';

export interface GameSettings {
  categoryIds: string[];
  wordSource: WordSource; // Replaces useCustomPack
  customWords: string[];
  timerDuration: number; // in seconds
  spiesCount: number;
}