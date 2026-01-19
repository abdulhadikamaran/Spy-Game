import React from 'react';
import {
    Plus,
    Minus,
    X,
    Trash2,
    Clock,
    Fingerprint,
    ChevronLeft,
    LayoutGrid,
    Layers,
    PenLine,
    History,
    ArrowRight,
    RotateCcw,
    Inbox,
    Circle,
    PawPrint,
    Briefcase,
    Car,
    Film,
    Gamepad2,
    Star,
    Pencil,
    Check,
    User,
    Users,
    AlertTriangle,
    Hand,
    Eye,
    LockOpen,
    Lock,
    CheckCircle,
    BadgeCheck,
    Home,
    Play,
    Pause,
    Info,
    FolderOpen,
    type LucideIcon,
} from 'lucide-react';

// Map Material Symbols names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
    // Actions
    add: Plus,
    remove: Minus,
    close: X,
    delete: Trash2,
    edit: Pencil,
    edit_note: PenLine,
    check: Check,
    check_circle: CheckCircle,

    // Navigation
    chevron_left: ChevronLeft,
    arrow_forward: ArrowRight,
    home: Home,

    // Status
    visibility: Eye,
    lock: Lock,
    lock_open: LockOpen,
    verified: BadgeCheck,
    info: Info,
    priority_high: AlertTriangle,

    // People
    person: User,
    group: Users,
    fingerprint: Fingerprint,

    // Media/Control
    play_arrow: Play,
    pause: Pause,
    timer: Clock,
    replay: RotateCcw,
    restart_alt: RotateCcw,
    history: History,

    // Layout
    grid_view: LayoutGrid,
    layers: Layers,
    inbox: Inbox,
    category: FolderOpen,

    // Categories
    sports_soccer: Circle,
    pets: PawPrint,
    work: Briefcase,
    directions_car: Car,
    movie: Film,
    sports_esports: Gamepad2,
    star: Star,

    // Gestures
    touch_app: Hand,
};

interface IconProps {
    name: string;
    className?: string;
    size?: number;
}

/**
 * Offline-safe Icon component using lucide-react.
 * Maps Material Symbols names to bundled Lucide SVG icons.
 */
export const Icon: React.FC<IconProps> = ({ name, className = '', size }) => {
    const LucideIconComponent = iconMap[name];

    if (!LucideIconComponent) {
        // Fallback: return empty icon placeholder (will not break layout)
        console.warn(`Icon "${name}" not found in iconMap`);
        return <span className={`inline-flex items-center justify-center ${className}`} style={{ width: size || 24, height: size || 24 }} />;
    }

    // Extract size from className if not provided (e.g., text-2xl = 24px, text-3xl = 30px, etc.)
    let computedSize = size;
    if (!computedSize) {
        if (className.includes('text-7xl')) computedSize = 72;
        else if (className.includes('text-6xl')) computedSize = 60;
        else if (className.includes('text-5xl')) computedSize = 48;
        else if (className.includes('text-4xl')) computedSize = 36;
        else if (className.includes('text-3xl')) computedSize = 30;
        else if (className.includes('text-2xl')) computedSize = 24;
        else if (className.includes('text-xl')) computedSize = 20;
        else if (className.includes('text-lg')) computedSize = 18;
        else if (className.includes('text-sm')) computedSize = 14;
        else if (className.includes('text-[14px]')) computedSize = 14;
        else if (className.includes('text-[16px]')) computedSize = 16;
        else computedSize = 24; // default
    }

    // Filter out text-* classes since we're using SVG sizing
    const filteredClassName = className
        .split(' ')
        .filter(c => !c.startsWith('text-') || c.includes('text-primary') || c.includes('text-white') || c.includes('text-text-') || c.includes('text-red-') || c.includes('text-green-') || c.includes('text-yellow-') || c.includes('text-gray-'))
        .join(' ');

    return (
        <LucideIconComponent
            size={computedSize}
            className={`inline-flex shrink-0 ${filteredClassName}`}
            strokeWidth={2}
        />
    );
};

export default Icon;
