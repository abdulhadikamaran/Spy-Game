import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CATEGORIES } from '../../data/wordPacks';
import { motion, AnimatePresence } from 'framer-motion';
import { WordSource } from '../../types';
import { Toast } from '../ui/Toast';
import { Icon } from '../ui/Icon';
import { SpySelector } from './SpySelector';
import { CustomWordEditor } from './CustomWordEditor';
import { CategoryModal } from './CategoryModal';
import { RecentHistory } from './RecentHistory';
import { PlayerInput } from './PlayerInput';
import { PlayerList } from './PlayerList';

const CATEGORY_ICONS: Record<string, string> = {
  football: 'sports_soccer',
  animals: 'pets',
  jobs: 'work',
  cars: 'directions_car',
  general: 'grid_view',
  movies: 'movie',
  clash: 'sports_esports',
  famous: 'star',
};

export const Lobby: React.FC = () => {
  // --- OPTIMIZED SELECTORS ---
  const players = useGameStore(state => state.players);
  const recentPlayers = useGameStore(state => state.recentPlayers);
  const settings = useGameStore(state => state.settings);

  // Actions
  const addPlayer = useGameStore(state => state.addPlayer);
  const removePlayer = useGameStore(state => state.removePlayer);
  const removeRecentPlayer = useGameStore(state => state.removeRecentPlayer);
  const setSettings = useGameStore(state => state.setSettings);
  const addCustomWord = useGameStore(state => state.addCustomWord);
  const removeCustomWord = useGameStore(state => state.removeCustomWord);
  const startGame = useGameStore(state => state.startGame);

  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const triggerToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  const handleAddPlayer = useCallback((name: string) => {
    addPlayer(name);
  }, [addPlayer]);

  const availableRecentPlayers = recentPlayers.filter(
    name => !players.some(p => p.name === name)
  );

  const handleStart = useCallback(() => {
    if (players.length < 3) {
      triggerToast("تکایە لانی کەم ٣ یاریزان زیاد بکە");
      return;
    }

    // Check constraints for custom words
    const isCustom = settings.wordSource === 'CUSTOM' || settings.wordSource === 'MIXED';
    if (isCustom && settings.customWords.length < 2) {
      triggerToast("تکایە لانی کەم ٢ وشەی تایبەت زیاد بکە!");
      return;
    }

    startGame();
  }, [players.length, settings.wordSource, settings.customWords.length, startGame, triggerToast]);

  const adjustTime = useCallback((minutes: number) => {
    const currentMinutes = settings.timerDuration / 60;
    const newMinutes = Math.max(1, Math.min(15, currentMinutes + minutes));
    setSettings({ timerDuration: newMinutes * 60 });
  }, [settings.timerDuration, setSettings]);

  // Toggle logic for multiple categories
  const toggleCategory = useCallback((id: string) => {
    const current = settings.categoryIds;
    let updated: string[];

    if (current.includes(id)) {
      if (current.length === 1) return;
      updated = current.filter(c => c !== id);
    } else {
      updated = [...current, id];
    }
    setSettings({ categoryIds: updated });
  }, [settings.categoryIds, setSettings]);

  // Ensure spy count is valid
  const maxSpies = players.length < 5 ? 1 : players.length < 7 ? 2 : 3;
  useEffect(() => {
    if (settings.spiesCount > maxSpies) {
      setSettings({ spiesCount: maxSpies });
    }
  }, [maxSpies, settings.spiesCount, setSettings]);

  // UI Helpers
  const selectedCount = settings.categoryIds.length;
  const primaryCatId = settings.categoryIds[0];
  const primaryCatObj = CATEGORIES.find(c => c.id === primaryCatId);

  const setSource = useCallback((s: WordSource) => setSettings({ wordSource: s }), [setSettings]);

  const isReady = players.length >= 3;

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans text-text-main selection:bg-primary selection:text-white relative overflow-x-hidden">
      <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedIds={settings.categoryIds}
        onToggle={toggleCategory}
      />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]"></div>
      </div>

      <header className="flex-none pt-12 pb-4 px-6 z-10 flex flex-col items-center justify-center text-center">
        <h1 className="font-display font-black text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-text-muted drop-shadow-sm leading-tight">
          سیخوڕ
        </h1>
        <div className="flex items-center gap-3 mt-2 opacity-80">
          <span className="w-12 h-[2px] bg-gradient-to-r from-transparent to-primary rounded-full"></span>
          <p className="text-primary font-bold text-sm tracking-wide uppercase">
            یاری سیخوڕی کوردی
          </p>
          <span className="w-12 h-[2px] bg-gradient-to-l from-transparent to-primary rounded-full"></span>
        </div>
      </header>

      <main className="flex-grow w-full max-w-lg mx-auto px-4 flex flex-col gap-6 z-10 mt-6 pb-12">

        {/* SECTION 1: PLAYERS */}
        <section className="bg-surface-glass backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-glass flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Icon name="group" className="text-primary" />
              یاریزانەکان
            </h2>
            <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20 shadow-glow">
              {players.length}
            </span>
          </div>

          <PlayerInput onAdd={handleAddPlayer} />

          {/* RECENT PLAYERS LIST */}
          <RecentHistory
            names={availableRecentPlayers}
            onAdd={handleAddPlayer}
            onRemove={removeRecentPlayer}
          />

          <PlayerList players={players} onRemove={removePlayer} />
        </section>

        {/* SECTION 2: WORD SOURCE */}
        <section className="flex flex-col gap-4">
          {/* Source Tabs */}
          <div className="bg-surface-glass backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 flex">
            {(['SYSTEM', 'MIXED', 'CUSTOM'] as const).map((s) => {
              const active = settings.wordSource === s;
              return (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${active ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                >
                  {s === 'SYSTEM' ? 'سیستەم' : s === 'MIXED' ? 'تێکەڵ' : 'تایبەت'}
                </button>
              );
            })}
          </div>

          {/* Dynamic Content based on source */}
          <AnimatePresence mode="wait">
            {/* CATEGORY SELECTOR (Show for SYSTEM and MIXED) */}
            {(settings.wordSource === 'SYSTEM' || settings.wordSource === 'MIXED') && (
              <motion.div
                key="system-selector"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="w-full h-20 bg-surface-glass backdrop-blur-md rounded-3xl flex items-center justify-between px-6 border border-white/5 hover:border-primary/50 transition-all duration-300 group shadow-glass active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon name={selectedCount === 1 ? (CATEGORY_ICONS[primaryCatId] || 'grid_view') : 'layers'} className="text-2xl" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-text-muted font-bold uppercase tracking-wider">بابەت (سیستەم)</span>
                      <span className="font-black text-xl text-white group-hover:text-primary transition-colors">
                        {selectedCount === 1
                          ? (primaryCatObj?.name.split('(')[0] || 'هەڵبژاردن')
                          : `${selectedCount} بابەت`
                        }
                      </span>
                    </div>
                  </div>
                  <Icon name="chevron_left" className="text-text-muted text-2xl group-hover:translate-x-[-4px] transition-transform" />
                </button>
              </motion.div>
            )}

            {/* CUSTOM EDITOR (Show for CUSTOM and MIXED) */}
            {(settings.wordSource === 'CUSTOM' || settings.wordSource === 'MIXED') && (
              <motion.div
                key="custom-editor"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CustomWordEditor
                  words={settings.customWords}
                  onAdd={addCustomWord}
                  onRemove={removeCustomWord}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SECTION 3: COMMON SETTINGS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stepper Time Control */}
          <div className="md:col-span-1 bg-surface-glass backdrop-blur-md rounded-3xl p-5 border border-white/5 flex flex-col justify-between gap-6">
            <div className="flex justify-between items-center">
              <label className="text-text-muted text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Icon name="timer" className="text-sm" /> کات
              </label>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => adjustTime(-1)}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all shadow-tactile"
              >
                <Icon name="remove" />
              </button>

              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none">
                  {settings.timerDuration / 60}<span className="text-lg text-primary mr-3">خولەک</span>
                </span>
              </div>

              <button
                onClick={() => adjustTime(1)}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all shadow-tactile"
              >
                <Icon name="add" />
              </button>
            </div>
          </div>

          {/* Spy Selector */}
          <div className="md:col-span-1 bg-surface-glass backdrop-blur-md rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-text-muted text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Icon name="fingerprint" className="text-sm" /> ژمارەی سیخوڕ
              </label>
            </div>

            <SpySelector
              count={settings.spiesCount}
              playerCount={players.length}
              onChange={(n) => setSettings({ spiesCount: n })}
              onError={triggerToast}
            />
          </div>
        </section>

        {/* Start Button & Warnings */}
        <div className="w-full mt-4 flex flex-col items-center">

          <button
            onClick={handleStart}
            className={`group w-full h-20 rounded-3xl flex items-center justify-center px-6 transition-all ${isReady
                ? "bg-primary hover:bg-primary-hover active:scale-[0.98] shadow-glow"
                : "bg-white/10 shadow-none cursor-pointer"
              }`}
          >
            <span className={`text-2xl font-black tracking-wide ${isReady ? "text-white" : "text-text-muted/50"}`}>
              دەستپێکردن
            </span>
          </button>
        </div>

      </main>
    </div>
  );
};