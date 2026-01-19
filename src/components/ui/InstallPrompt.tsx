import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Detect platform
const isIOS = () => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

const isAndroid = () => {
    if (typeof window === 'undefined') return false;
    return /Android/.test(navigator.userAgent);
};

const isStandalone = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
};

export const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);
    const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Don't show if already installed or dismissed
        if (isStandalone()) return;

        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed, 10);
            // Allow re-prompt after 7 days
            if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
                return;
            }
        }

        // Handle Android/Chrome install prompt
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowAndroidPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        // Show iOS prompt after a delay if on iOS Safari
        if (isIOS() && !isStandalone()) {
            const timer = setTimeout(() => {
                setShowIOSPrompt(true);
            }, 3000);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            };
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowAndroidPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowIOSPrompt(false);
        setShowAndroidPrompt(false);
        setIsDismissed(true);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    // Don't render if already dismissed or nothing to show
    if (isDismissed || (!showIOSPrompt && !showAndroidPrompt)) {
        return null;
    }

    return (
        <AnimatePresence>
            {(showIOSPrompt || showAndroidPrompt) && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
                >
                    <div className="bg-surface rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-primary/10 p-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                                        <Icon name="fingerprint" className="text-white text-2xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">دامەزراندنی ئەپ</h3>
                                        <p className="text-xs text-text-muted">بەبێ ئینتەرنێت یاری بکە</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDismiss}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                                >
                                    <Icon name="close" className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {showIOSPrompt && (
                                <div className="space-y-4">
                                    <p className="text-sm text-text-main leading-relaxed">
                                        بۆ دامەزراندنی ئەم ئەپە لەسەر ئایفۆنەکەت:
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-400 font-bold">١</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-white">
                                                    لەسەر <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
                                                        </svg>
                                                        Share
                                                    </span> کلیک بکە
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-400 font-bold">٢</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-white">
                                                    "Add to Home Screen" هەڵبژێرە
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-400 font-bold">٣</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-white">
                                                    "Add" کلیک بکە بۆ تەواوکردن
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showAndroidPrompt && (
                                <div className="space-y-4">
                                    <p className="text-sm text-text-main leading-relaxed">
                                        ئەم ئەپە دامەزرێنە بۆ ئەوەی بەبێ ئینتەرنێت یاری بکەیت!
                                    </p>

                                    <button
                                        onClick={handleInstall}
                                        className="w-full h-14 bg-primary hover:bg-primary-hover rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-colors active:scale-[0.98]"
                                    >
                                        <Icon name="add" className="text-xl" />
                                        <span>دامەزراندن</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;
