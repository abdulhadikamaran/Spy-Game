import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GamePhase, Player, WordItem, GameSettings } from '../types';
import { CATEGORIES } from '../data/wordPacks';

interface GameState {
  // Ephemeral State (Resets on reload)
  phase: GamePhase;
  currentWord: WordItem | null;
  imposterIndex: number | null;
  currentPlayerIndex: number;

  // Persisted State
  players: Player[];
  settings: GameSettings;
  usedWords: Record<string, string[]>;
  packModifications: Record<string, WordItem[]>;
  recentPlayers: string[];

  // Actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setSettings: (settings: Partial<GameSettings>) => void;
  addCustomWord: (word: string) => void;
  removeCustomWord: (word: string) => void;
  updatePack: (categoryId: string, words: WordItem[]) => void;
  resetPack: (categoryId: string) => void;
  startGame: () => void;
  nextPlayer: () => void;
  resetToLobby: () => void;
  restartSameSettings: () => void;
  clearRecentPlayers: () => void;
  removeRecentPlayer: (name: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Defaults
      phase: GamePhase.LOBBY,
      players: [],
      currentWord: null,
      imposterIndex: null,
      currentPlayerIndex: 0,
      recentPlayers: [],
      settings: {
        categoryIds: ['general'],
        wordSource: 'SYSTEM',
        customWords: [],
        timerDuration: 300,
        spiesCount: 1,
      },
      usedWords: {},
      packModifications: {},

      addPlayer: (name) => set((state) => ({
        players: [...state.players, { id: crypto.randomUUID(), name, isImposter: false }]
      })),

      removePlayer: (id) => set((state) => ({
        players: state.players.filter((p) => p.id !== id)
      })),

      setSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      addCustomWord: (word) => set((state) => ({
        settings: {
          ...state.settings,
          customWords: [...state.settings.customWords, word]
        }
      })),

      removeCustomWord: (word) => set((state) => ({
        settings: {
          ...state.settings,
          customWords: state.settings.customWords.filter(w => w !== word)
        }
      })),

      updatePack: (categoryId, words) => set((state) => ({
        packModifications: { ...state.packModifications, [categoryId]: words }
      })),

      resetPack: (categoryId) => set((state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [categoryId]: _, ...rest } = state.packModifications;
        return { packModifications: rest };
      }),

      startGame: () => {
        const state = get();
        const { players, settings, usedWords, packModifications } = state;

        if (players.length < 3) return;

        // 1. Update Recent Players (Persistence Logic)
        const currentNames = players.map(p => p.name);
        const existingRecents = state.recentPlayers;
        // Merge, dedupe, and keep top 15
        const newRecents = Array.from(new Set([...currentNames, ...existingRecents])).slice(0, 15);

        // 2. Pick Imposters
        const totalPlayers = players.length;
        const requestedSpies = settings.spiesCount;

        let actualSpies = 1;
        if (totalPlayers < 5) actualSpies = 1;
        else if (totalPlayers < 7) actualSpies = Math.min(requestedSpies, 2);
        else actualSpies = Math.min(requestedSpies, 3);

        const imposterIndices = new Set<number>();
        while (imposterIndices.size < actualSpies) {
          imposterIndices.add(Math.floor(Math.random() * totalPlayers));
        }

        const newPlayers = players.map((p, idx) => ({
          ...p,
          isImposter: imposterIndices.has(idx)
        }));

        // 3. Select Word Logic
        let selectedWord: WordItem;

        const source = settings.wordSource;
        const useSystem = source === 'SYSTEM' || source === 'MIXED';
        const useCustom = source === 'CUSTOM' || source === 'MIXED';

        type Candidate = { item: WordItem; categoryId: string };
        let pool: Candidate[] = [];

        // System Words
        if (useSystem) {
          const targetCategories = CATEGORIES.filter(c => settings.categoryIds.includes(c.id));

          if (targetCategories.length === 0 && source === 'SYSTEM') {
            targetCategories.push(CATEGORIES.find(c => c.id === 'general') || CATEGORIES[0]);
          }

          targetCategories.forEach(cat => {
            // Use modified pack if available, otherwise default
            const activeItems = packModifications[cat.id] || cat.items;

            const history = usedWords[cat.id] || [];
            const available = activeItems.filter(item => {
              const key = typeof item === 'string' ? item : item.en;
              return !history.includes(key);
            });

            const itemsToAdd = available.length > 0 ? available : activeItems;

            itemsToAdd.forEach(item => {
              pool.push({ item, categoryId: cat.id });
            });
          });
        }

        // Custom Words
        if (useCustom && settings.customWords.length > 0) {
          settings.customWords.forEach(w => {
            pool.push({ item: w, categoryId: 'custom' });
          });
        }

        if (pool.length === 0) return;

        const rand = Math.floor(Math.random() * pool.length);
        const candidate = pool[rand];

        selectedWord = candidate.item;
        const catId = candidate.categoryId;

        if (catId !== 'custom') {
          const key = typeof selectedWord === 'string' ? selectedWord : selectedWord.en;
          const currentCatHistory = usedWords[catId] || [];
          const newHistory = [...currentCatHistory, key];

          set(s => ({
            usedWords: { ...s.usedWords, [catId]: newHistory }
          }));
        }

        set({
          phase: GamePhase.HANDOVER,
          players: newPlayers,
          imposterIndex: Array.from(imposterIndices)[0],
          currentWord: selectedWord,
          currentPlayerIndex: 0,
          recentPlayers: newRecents
        });
      },

      nextPlayer: () => {
        const { currentPlayerIndex, players } = get();
        if (currentPlayerIndex < players.length - 1) {
          set({
            phase: GamePhase.HANDOVER,
            currentPlayerIndex: currentPlayerIndex + 1
          });
        } else {
          set({ phase: GamePhase.PLAYING });
        }
      },

      resetToLobby: () => set({
        phase: GamePhase.LOBBY,
        currentWord: null,
        imposterIndex: null,
        currentPlayerIndex: 0
      }),

      restartSameSettings: () => {
        get().startGame();
      },

      clearRecentPlayers: () => set({ recentPlayers: [] }),

      removeRecentPlayer: (name) => set((state) => ({
        recentPlayers: state.recentPlayers.filter(p => p !== name)
      }))
    }),
    {
      name: 'aeub-game-storage-v1', // New key to invalidate old storage
      partialize: (state) => ({
        // ONLY persist these fields
        players: state.players,
        settings: state.settings,
        usedWords: state.usedWords,
        packModifications: state.packModifications,
        recentPlayers: state.recentPlayers,
      }),
    }
  )
);