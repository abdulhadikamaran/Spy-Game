import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';

interface CustomWordEditorProps {
   words: string[];
   onAdd: (w: string) => void;
   onRemove: (w: string) => void;
}

export const CustomWordEditor: React.FC<CustomWordEditorProps> = ({ words, onAdd, onRemove }) => {
   const [inputVal, setInputVal] = useState('');

   const handleAdd = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = inputVal.trim();
      if (trimmed && !words.includes(trimmed)) {
         onAdd(trimmed);
         setInputVal('');
      }
   };

   return (
      <div className="bg-surface-glass backdrop-blur-xl rounded-3xl p-5 border border-white/5 shadow-glass flex flex-col gap-4">
         <div className="flex items-center justify-between">
            <label className="text-text-muted text-xs font-bold uppercase tracking-wider flex items-center gap-1">
               <Icon name="edit_note" className="text-sm" /> وشەی تایبەت
            </label>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${words.length < 5 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
               {words.length} وشە
            </span>
         </div>

         <form onSubmit={handleAdd} className="relative flex gap-2">
            <input
               value={inputVal}
               onChange={e => setInputVal(e.target.value)}
               placeholder="وشەی نوێ بنووسە..."
               className="flex-1 h-12 rounded-xl bg-input-bg border border-white/10 px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all placeholder:text-text-muted/50"
            />
            <button
               type="submit"
               disabled={!inputVal.trim()}
               className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:bg-white/10"
            >
               <Icon name="add" />
            </button>
         </form>

         <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 scrollbar-hide">
            {words.map((w, i) => (
               <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={`${w}-${i}`}
                  className="bg-white/5 border border-white/10 rounded-lg pl-2 pr-3 py-1.5 flex items-center gap-2"
               >
                  <span className="text-sm font-bold">{w}</span>
                  <button
                     onClick={() => onRemove(w)}
                     className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-text-muted hover:text-red-400 transition-colors"
                  >
                     <Icon name="close" className="text-[14px]" />
                  </button>
               </motion.div>
            ))}
            {words.length === 0 && (
               <p className="text-text-muted text-xs italic opacity-50 w-full text-center py-2">
                  هیچ وشەیەک زیاد نەکراوە. نزیکەی ١٠ وشە زیاد بکە.
               </p>
            )}
         </div>
      </div>
   );
};