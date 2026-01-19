import React, { useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CATEGORIES } from '../../data/wordPacks';
import { WordItem } from '../../types';
import { WordRow } from './WordRow';
import { Icon } from '../ui/Icon';

interface PackEditorProps {
   categoryId: string;
   onBack: () => void;
}

export const PackEditor: React.FC<PackEditorProps> = ({ categoryId, onBack }) => {
   const packModifications = useGameStore(state => state.packModifications);
   const updatePack = useGameStore(state => state.updatePack);
   const resetPack = useGameStore(state => state.resetPack);

   const category = CATEGORIES.find(c => c.id === categoryId);

   const [kuVal, setKuVal] = useState('');
   const [enVal, setEnVal] = useState('');

   const currentItems = packModifications[categoryId] || (category ? category.items : []);

   const handleRemove = useCallback((index: number) => {
      const newList = [...currentItems];
      newList.splice(index, 1);
      updatePack(categoryId, newList);
   }, [categoryId, currentItems, updatePack]);

   if (!category) return null;
   const isModified = !!packModifications[categoryId];

   const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      let newItem: WordItem;

      if (category.isBilingual) {
         if (!kuVal.trim() || !enVal.trim()) return;
         newItem = { ku: kuVal.trim(), en: enVal.trim() };
      } else {
         if (!kuVal.trim()) return;
         newItem = kuVal.trim();
      }

      const newList = [newItem, ...currentItems];
      updatePack(categoryId, newList);
      setKuVal('');
      setEnVal('');
   };

   const handleReset = () => {
      if (confirm('دڵنیایت؟ هەموو گۆڕانکارییەکان دەسڕێتەوە و دەگەڕێتەوە دۆخی سیستەم.')) {
         resetPack(categoryId);
      }
   };

   return (
      <div className="absolute inset-0 bg-[#1A1A1A] flex flex-col z-20">
         <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface/50 backdrop-blur-md">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-white/5 active:scale-95 transition-all">
               <Icon name="arrow_forward" className="text-text-muted" />
            </button>
            <div className="text-center">
               <h3 className="text-lg font-black text-white">{category.name.split('(')[0]}</h3>
               {isModified && (
                  <span className="text-[10px] text-primary font-bold uppercase bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                     دەستکاری کراوە
                  </span>
               )}
            </div>
            <button
               onClick={handleReset}
               disabled={!isModified}
               className="p-2 rounded-full hover:bg-red-500/10 text-text-muted hover:text-red-500 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-text-muted transition-colors"
               title="گەڕاندنەوەی سەرەتا"
            >
               <Icon name="restart_alt" />
            </button>
         </div>

         <form onSubmit={handleAdd} className="p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex gap-2">
               {category.isBilingual ? (
                  <>
                     <input
                        value={kuVal}
                        onChange={e => setKuVal(e.target.value)}
                        placeholder="کوردی"
                        className="flex-1 h-12 rounded-xl bg-input-bg border border-white/10 px-4 text-sm font-bold outline-none focus:border-primary/50 text-white placeholder:text-text-muted/50"
                     />
                     <input
                        value={enVal}
                        onChange={e => setEnVal(e.target.value)}
                        placeholder="English"
                        className="flex-1 h-12 rounded-xl bg-input-bg border border-white/10 px-4 text-sm font-bold outline-none focus:border-primary/50 dir-ltr text-left text-white placeholder:text-text-muted/50 font-sans"
                        dir="ltr"
                     />
                  </>
               ) : (
                  <input
                     value={kuVal}
                     onChange={e => setKuVal(e.target.value)}
                     placeholder="وشەی نوێ زیاد بکە..."
                     className="flex-1 h-12 rounded-xl bg-input-bg border border-white/10 px-4 text-sm font-bold outline-none focus:border-primary/50 text-white placeholder:text-text-muted/50"
                  />
               )}
               <button
                  type="submit"
                  disabled={category.isBilingual ? (!kuVal.trim() || !enVal.trim()) : !kuVal.trim()}
                  className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-glow active:scale-95 transition-all disabled:opacity-50 disabled:bg-white/10"
               >
                  <Icon name="add" />
               </button>
            </div>
         </form>

         <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            <div className="flex items-center justify-between px-2 pb-2">
               <span className="text-xs font-bold text-text-muted uppercase">{currentItems.length} وشە</span>
            </div>

            {currentItems.map((item, idx) => (
               <WordRow key={idx} index={idx} item={item} onRemove={handleRemove} />
            ))}

            {currentItems.length === 0 && (
               <div className="flex flex-col items-center justify-center py-10 opacity-50 space-y-2">
                  <Icon name="inbox" className="text-4xl text-text-muted" />
                  <p className="text-text-muted text-sm italic">هیچ وشەیەک نییە</p>
               </div>
            )}
         </div>
      </div>
   );
};