import React from 'react';
import { WordItem } from '../../types';
import { Icon } from '../ui/Icon';

interface WordRowProps {
   item: WordItem;
   index: number;
   onRemove: (i: number) => void;
}

export const WordRow: React.FC<WordRowProps> = React.memo(({ item, index, onRemove }) => {
   return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors content-visibility-auto">
         {typeof item === 'string' ? (
            <span className="font-bold text-text-main">{item}</span>
         ) : (
            <div className="flex flex-col">
               {/* LINE 1 (TOP): ENGLISH - Dominant */}
               <span className="text-lg font-bold text-white tracking-wide font-sans text-left dir-ltr">{item.en}</span>
               {/* LINE 2 (BOTTOM): KURDISH - Secondary */}
               <span className="text-sm font-medium text-gray-400 mt-0.5">{item.ku}</span>
            </div>
         )}
         <button
            onClick={() => onRemove(index)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-red-500/20 hover:text-red-500 opacity-50 group-hover:opacity-100 transition-all active:scale-90"
         >
            <Icon name="delete" className="text-lg" />
         </button>
      </div>
   );
});