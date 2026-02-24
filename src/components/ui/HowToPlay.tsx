import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Icon } from './Icon';

interface HowToPlayProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Slide {
    icon: string;
    title: string;
    description: string;
    color: string;
}

const SLIDES: Slide[] = [
    {
        icon: 'lock_open',
        title: 'وشەکە',
        description: 'هەموو یاریزانەکان یەک وشە دەبینن... جگە لە سیخوڕەکە',
        color: '#3B82F6',
    },
    {
        icon: 'fingerprint',
        title: 'سیخوڕ',
        description: 'سیخوڕەکە نازانێت وشەکە چییە. دەبێت خۆی بشارێتەوە',
        color: '#C0191F',
    },
    {
        icon: 'group',
        title: 'پرسیار',
        description: 'بە نۆبە پرسیار لە یەکتری بکەن دەربارەی وشەکە',
        color: '#10B981',
    },
    {
        icon: 'visibility',
        title: 'دەنگدان',
        description: 'کاتەکە تەواو بوو؟ دەنگ بدەن بۆ ئەوەی کێ سیخوڕە!',
        color: '#F59E0B',
    },
];

const swipeThreshold = 50;

export const HowToPlay: React.FC<HowToPlayProps> = ({ isOpen, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);
    const constraintsRef = useRef(null);

    const isLastSlide = currentSlide === SLIDES.length - 1;

    const goTo = (index: number) => {
        if (index < 0 || index >= SLIDES.length) return;
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    const handleDragEnd = (_: any, info: PanInfo) => {
        // RTL: swipe right = next, swipe left = previous
        if (info.offset.x > swipeThreshold) {
            goTo(currentSlide + 1);
        } else if (info.offset.x < -swipeThreshold) {
            goTo(currentSlide - 1);
        }
    };

    const handleClose = () => {
        setCurrentSlide(0);
        setDirection(0);
        onClose();
    };

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
    };

    const slide = SLIDES[currentSlide];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-sm bg-surface rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 left-4 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <Icon name="close" className="text-sm text-white/70" />
                        </button>

                        {/* Header */}
                        <div className="pt-5 pb-2 text-center">
                            <h2 className="text-lg font-black text-white/90">چۆن یاری بکەم؟</h2>
                            <p className="text-xs text-text-muted mt-1">
                                {currentSlide + 1} / {SLIDES.length}
                            </p>
                        </div>

                        {/* Slide Content */}
                        <div
                            ref={constraintsRef}
                            className="relative w-full overflow-hidden"
                            style={{ minHeight: '320px' }}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentSlide}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.3}
                                    onDragEnd={handleDragEnd}
                                    className="flex flex-col items-center justify-center px-8 py-6 cursor-grab active:cursor-grabbing"
                                    style={{ minHeight: '320px' }}
                                >
                                    {/* Icon Circle */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                                        className="w-28 h-28 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10 shadow-lg"
                                        style={{ backgroundColor: `${slide.color}15` }}
                                    >
                                        <div style={{ color: slide.color }}>
                                            <Icon
                                                name={slide.icon}
                                                size={56}
                                                className=""
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Title */}
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="text-3xl font-black text-white mb-4 text-center"
                                    >
                                        {slide.title}
                                    </motion.h3>

                                    {/* Description */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-base text-text-muted text-center leading-relaxed max-w-[280px] font-medium"
                                    >
                                        {slide.description}
                                    </motion.p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Bottom Section */}
                        <div className="px-6 pb-6 pt-2 flex flex-col items-center gap-5">
                            {/* Dot Indicators */}
                            <div className="flex items-center justify-center gap-2">
                                {SLIDES.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => goTo(idx)}
                                        className="p-1"
                                    >
                                        <motion.div
                                            animate={{
                                                width: idx === currentSlide ? 24 : 8,
                                                backgroundColor: idx === currentSlide ? slide.color : 'rgba(255,255,255,0.2)',
                                            }}
                                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                            className="h-2 rounded-full"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Action Button */}
                            {isLastSlide ? (
                                <motion.button
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    onClick={handleClose}
                                    className="w-full h-14 bg-primary hover:bg-primary-hover rounded-2xl flex items-center justify-center gap-2 text-white font-black text-lg transition-colors active:scale-[0.97] shadow-glow"
                                >
                                    <Icon name="check_circle" className="text-xl text-white" />
                                    <span>فێربووم!</span>
                                </motion.button>
                            ) : (
                                <button
                                    onClick={() => goTo(currentSlide + 1)}
                                    className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-base transition-colors active:scale-[0.97]"
                                >
                                    <span>دواتر</span>
                                    <Icon name="chevron_left" className="text-lg text-white" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HowToPlay;
