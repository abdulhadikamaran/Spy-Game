import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'بەڵێ',
    cancelText = 'نەخێر',
    variant = 'danger',
    onConfirm,
    onCancel
}) => {
    const variantStyles = {
        danger: {
            iconBg: 'bg-red-500/20',
            iconColor: 'text-red-400',
            icon: 'warning',
            confirmBg: 'bg-red-500 hover:bg-red-600',
        },
        warning: {
            iconBg: 'bg-yellow-500/20',
            iconColor: 'text-yellow-400',
            icon: 'info',
            confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
        },
        info: {
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400',
            icon: 'help',
            confirmBg: 'bg-blue-500 hover:bg-blue-600',
        },
    };

    const styles = variantStyles[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" dir="rtl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-[#1E1E1E] rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 pb-4 flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
                                <Icon name={styles.icon} className={`text-4xl ${styles.iconColor}`} />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">{title}</h3>
                            <p className="text-text-muted text-sm leading-relaxed">{message}</p>
                        </div>

                        {/* Actions */}
                        <div className="p-4 pt-2 flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all active:scale-95"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 py-3 px-4 rounded-xl ${styles.confirmBg} text-white font-bold text-sm transition-all active:scale-95 shadow-lg`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
