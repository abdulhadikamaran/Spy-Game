import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../ui/Icon';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-10 left-1/2 z-50 flex w-max max-w-[90%] items-center justify-center gap-3 rounded-xl border border-primary bg-[#1A1A1A] px-6 py-3 text-center text-white shadow-2xl pointer-events-none"
        >
          <Icon name="info" className="text-primary text-xl" />
          <p className="text-sm font-bold leading-tight">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};