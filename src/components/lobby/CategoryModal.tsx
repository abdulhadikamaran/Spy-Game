import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../../data/wordPacks';
import { PackEditor } from './PackEditor';
import { Icon } from '../ui/Icon';

const CATEGORY_ICONS: Record<string, string> = {
  football: 'sports_soccer',
  animals: 'pets',
  jobs: 'work',
  cars: 'directions_car',
  general: 'grid_view',
  movies: 'movie',
  clash: 'sports_esports',
  famous: 'star',
  games: 'videogame_asset',
  meals: 'restaurant',
};

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = React.memo(({ isOpen, onClose, selectedIds, onToggle }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Helper to extract English and Kurdish names from category name format: "کوردی (English)"
  const parseNames = (name: string) => {
    const match = name.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (match) {
      return { kurdish: match[1].trim(), english: match[2].trim() };
    }
    return { kurdish: name, english: null };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#1A1A1A] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden h-[90vh] sm:h-[80vh] flex flex-col"
          >
            <AnimatePresence mode="wait">
              {editingId ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute inset-0 z-20"
                >
                  <PackEditor categoryId={editingId} onBack={() => setEditingId(null)} />
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  className="flex flex-col h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 backdrop-blur-xl z-10">
                    <div>
                      <h3 className="text-xl font-black text-white">بابەت هەڵبژێرە</h3>
                      <p className="text-xs text-text-muted font-bold mt-1">
                        بابەتەکان دەستنیشان بکە بۆ یاری
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-colors"
                    >
                      تەواو
                    </button>
                  </div>

                  {/* Static Grid - No Drag and Drop */}
                  <div className="p-4 overflow-y-auto overflow-x-hidden scrollbar-hide grid grid-cols-2 gap-4 pb-12 flex-1 content-start">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedIds.includes(cat.id);
                      const icon = CATEGORY_ICONS[cat.id] || 'category';
                      const { kurdish, english } = parseNames(cat.name);

                      return (
                        <div
                          key={cat.id}
                          onClick={() => onToggle(cat.id)}
                          className={`group relative flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer active:scale-95 h-full select-none ${isSelected
                            ? 'bg-primary/15 border-primary shadow-[0_0_25px_rgba(255,51,51,0.2)]'
                            : 'bg-surface hover:bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                        >
                          {/* Edit Button - Top Left */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingId(cat.id); }}
                            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors z-10"
                            title="دەستکاری"
                          >
                            <Icon name="edit" className="text-sm" />
                          </button>

                          {/* Category Icon */}
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 mt-2 transition-all duration-200 ${isSelected
                            ? 'bg-primary text-white scale-110'
                            : 'bg-white/5 text-text-muted group-hover:text-white group-hover:bg-white/10'
                            }`}>
                            <Icon name={icon} className="text-3xl" />
                          </div>

                          {/* Category Names - ENGLISH ON TOP (Dominant), KURDISH BELOW (Secondary) */}
                          <div className="flex flex-col items-center">
                            {english ? (
                              <>
                                {/* LINE 1 (TOP): ENGLISH - text-2xl font-bold text-white tracking-wide */}
                                <h4 className="text-2xl font-bold text-white tracking-wide">
                                  {english}
                                </h4>
                                {/* LINE 2 (BOTTOM): KURDISH - text-sm font-medium text-gray-400 mt-1 */}
                                <span className="text-sm font-medium text-gray-400 mt-1">
                                  {kurdish}
                                </span>
                              </>
                            ) : (
                              /* Kurdish Only */
                              <h4 className="text-2xl font-bold text-white tracking-wide">
                                {kurdish}
                              </h4>
                            )}
                          </div>

                          {/* Word Count Badge */}
                          <div className="mt-3 text-xs font-medium text-text-muted/50 bg-black/20 px-3 py-1 rounded-full">
                            {cat.items.length} وشە
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1A1A1A] to-transparent pointer-events-none"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});