# Aeub (سیخوڕ) - Kurdish Spyfall

> A local multiplayer social deduction game for Kurdish Sorani speakers.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Game Flow](#4-game-flow)
5. [Component Reference](#5-component-reference)
6. [State Management](#6-state-management)
7. [Design System](#7-design-system)
8. [Word Packs](#8-word-packs)
9. [Development Guide](#9-development-guide)
10. [Rules for AI Agents](#10-rules-for-ai-agents)

---

## 1. Project Overview

| Property | Value |
|----------|-------|
| **App Name** | Aeub / Sixur (سیخوڕ) |
| **Type** | Web-based Party Game (Spy vs. Civilian) |
| **Language** | **Kurdish Sorani** (Strictly) - No English text visible to users |
| **Players** | 3-15 players (local pass-and-play) |
| **Platform** | Mobile-first responsive web app |

### How the Game Works

1. **Setup**: Players enter their names in the Lobby
2. **Categories**: Choose word categories (Football, Animals, Movies, etc.)
3. **Reveal Phase**: Each player privately sees their role:
   - **Civilians** see the secret word
   - **Spies** see "تۆ سیخوڕیت" (You are a Spy)
4. **Discussion**: Players ask each other questions about the word
5. **Voting**: Everyone votes on who they think the spy is
6. **Result**: Reveal the spy and the secret word

---

## 2. Tech Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.3 | UI Framework |
| `react-dom` | ^19.2.3 | React DOM Renderer |
| `vite` | ^7.3.1 | Build Tool & Dev Server |
| `typescript` | ~5.8.2 | Type Safety |
| `zustand` | ^5.0.10 | State Management |
| `framer-motion` | ^12.26.2 | Animations |
| `lucide-react` | ^0.562.0 | Icons |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `@vitejs/plugin-react` | React Fast Refresh for Vite |
| `@types/node` | Node.js type definitions |

### Styling

- **Tailwind CSS**: Loaded via CDN in `index.html`
- **Google Fonts**: Vazirmatn, Noto Sans Arabic, Work Sans
- **Material Symbols**: Icons from Google Fonts

---

## 3. Project Structure

```
kurdspyy/
├── index.html              # Entry HTML with Tailwind config
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind configuration
│
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Main App component (phase router)
│   ├── types.ts            # TypeScript type definitions
│   │
│   ├── data/
│   │   └── wordPacks.ts    # All word categories (937 lines)
│   │
│   ├── store/
│   │   └── gameStore.ts    # Zustand store with persist
│   │
│   └── components/
│       ├── game/
│       │   ├── GameTimer.tsx    # Timer screen (242 lines)
│       │   ├── Handover.tsx     # Pass device screen
│       │   ├── RevealCard.tsx   # Show role/word screen
│       │   └── Result.tsx       # End game results
│       │
│       ├── lobby/
│       │   ├── Lobby.tsx           # Main lobby (308 lines)
│       │   ├── CategoryModal.tsx   # Category selection modal
│       │   ├── PackEditor.tsx      # Edit word packs
│       │   ├── CustomWordEditor.tsx # Add custom words
│       │   ├── SpySelector.tsx     # Choose spy count
│       │   ├── PlayerInput.tsx     # Player name input
│       │   ├── PlayerList.tsx      # List of players
│       │   ├── RecentHistory.tsx   # Recent players
│       │   └── WordRow.tsx         # Word list item
│       │
│       └── ui/
│           └── Toast.tsx           # Toast notifications
│
└── public/                 # Static assets
```

---

## 4. Game Flow

The app uses a **phase-based routing system** managed by Zustand:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   LOBBY ──────► HANDOVER ──────► REVEAL ──────► PLAYING     │
│     │             │                │               │        │
│     │             │                │               │        │
│     │             ▼                ▼               ▼        │
│     │         (Pass to         (Show role)    (Timer +      │
│     │          next player)                   Discussion)   │
│     │                                              │        │
│     │                                              ▼        │
│     │◄─────────────────────────────────────────  RESULT     │
│     │                                                       │
└─────────────────────────────────────────────────────────────┘
```

### Phase Definitions (`types.ts`)

```typescript
enum GamePhase {
  LOBBY = 'LOBBY',       // Setup players & settings
  HANDOVER = 'HANDOVER', // "Pass to [Name]" screen
  REVEAL = 'REVEAL',     // Show role (Spy/Civilian + word)
  PLAYING = 'PLAYING',   // Timer countdown
  RESULT = 'RESULT'      // Show who was spy + word
}
```

---

## 5. Component Reference

### Game Components (`src/components/game/`)

| Component | Lines | Description |
|-----------|-------|-------------|
| `GameTimer.tsx` | 242 | Main game screen with countdown timer, first speaker randomizer, player list |
| `Handover.tsx` | 88 | "Pass device to [Name]" screen with page-flip animation |
| `RevealCard.tsx` | 103 | Shows role (Spy) or secret word (Civilian) |
| `Result.tsx` | 114 | End screen showing spy identity and secret word |

### Lobby Components (`src/components/lobby/`)

| Component | Lines | Description |
|-----------|-------|-------------|
| `Lobby.tsx` | 308 | Main lobby with players, settings, word source |
| `CategoryModal.tsx` | 160 | Modal for selecting word categories |
| `PackEditor.tsx` | 130 | Edit/add/remove words in a category |
| `CustomWordEditor.tsx` | 52 | Add custom words for the game |
| `SpySelector.tsx` | 77 | Select 1, 2, or 3 spies (with player count validation) |
| `PlayerInput.tsx` | 42 | Text input for adding players |
| `PlayerList.tsx` | 50 | Display list of current players |
| `RecentHistory.tsx` | 45 | Show recently played names |
| `WordRow.tsx` | 36 | Single word row with delete button |

---

## 6. State Management

### Zustand Store (`src/store/gameStore.ts`)

The app uses **Zustand** with **persist** middleware to save game state to `localStorage`.

#### State Shape

```typescript
interface GameState {
  // Ephemeral (resets on reload)
  phase: GamePhase;
  currentWord: WordItem | null;
  imposterIndex: number | null;
  currentPlayerIndex: number;

  // Persisted
  players: Player[];
  settings: GameSettings;
  usedWords: Record<string, string[]>;
  packModifications: Record<string, WordItem[]>;
  recentPlayers: string[];
}
```

#### Key Actions

| Action | Description |
|--------|-------------|
| `addPlayer(name)` | Add a player to the lobby |
| `removePlayer(id)` | Remove a player by ID |
| `setSettings(settings)` | Update game settings |
| `addCustomWord(word)` | Add a custom word |
| `removeCustomWord(word)` | Remove a custom word |
| `updatePack(categoryId, words)` | Modify a word pack |
| `resetPack(categoryId)` | Reset pack to default |
| `startGame()` | Start game, pick spies and word |
| `nextPlayer()` | Move to next player reveal |
| `resetToLobby()` | Return to lobby |
| `restartSameSettings()` | Restart with same settings |
| `removeRecentPlayer(name)` | Remove from recent history |

#### Persistence

Data is saved to `localStorage` under key `aeub-game-storage-v1`:
- Players list
- Settings (categories, timer, spy count)
- Used words history
- Pack modifications
- Recent players

---

## 7. Design System

### "Earth & Ember" Theme

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#C0191F` | Buttons, spy indicators |
| `primary-hover` | `#9F151A` | Button hover states |
| `primary-dark` | `#7D1416` | Deep accents |
| `background` | `#282F32` | Main background |
| `surface` | `#4D474F` | Cards, panels |
| `surface-dark` | `#371211` | Handover screen |
| `text-main` | `#FDE3CF` | Primary text (Creamy Peach) |
| `text-heading` | `#E51E1B` | Headings (Bright Red) |
| `text-muted` | `rgba(253, 227, 207, 0.6)` | Secondary text |
| `accent` | `#E51E1B` | Bright red accent |

### Typography

```css
font-family: 'Vazirmatn', 'Noto Sans Arabic', 'Work Sans', sans-serif;
```

- **Vazirmatn**: Primary Kurdish/Persian font
- **Noto Sans Arabic**: Fallback Arabic font
- **Work Sans**: Latin character support

### Direction

All text is **RTL (Right-to-Left)**:
```html
<html lang="ckb" dir="rtl">
```

---

## 8. Word Packs

### Available Categories (`src/data/wordPacks.ts`)

| Category ID | Name | Items | Bilingual |
|-------------|------|-------|-----------|
| `football` | یاریزانی تۆپی پێ | 200+ | No |
| `animals` | ئاژەڵەکان | 150+ | No |
| `cars` | ئۆتۆمبێل | 100+ | No |
| `jobs` | پیشەکان | 150+ | No |
| `general` | گشتی | 400+ | No |
| `clash` | کلاش ڕۆیاڵ | 100+ | **Yes** (EN/KU) |
| `movies` | فیلم و زنجیرە | 200+ | **Yes** (EN/KU) |
| `famous` | کەسە ناسراوەکان | 150+ | **Yes** (EN/KU) |

### Word Item Types

```typescript
type WordItem = string | { en: string; ku: string };

// Example: Simple
"شێر"  // Lion

// Example: Bilingual
{ en: "The Godfather", ku: "گادفازەر" }
```

### Word Selection Logic

1. Filter by selected categories
2. Remove already-used words (stored in `usedWords`)
3. Merge with custom words if `MIXED` or `CUSTOM` mode
4. Random selection from pool

---

## 9. Development Guide

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (http://localhost:5173) |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build |

### Adding a New Word Pack

1. Open `src/data/wordPacks.ts`
2. Create a new array with words
3. Add to `CATEGORIES` export:

```typescript
const newCategory = ["word1", "word2", ...];

export const CATEGORIES: Category[] = [
  // ... existing categories
  {
    id: 'newcat',
    name: 'نازناو (Name in English)',
    items: newCategory,
    isBilingual: false
  }
];
```

4. Add icon mapping in `Lobby.tsx`:

```typescript
const CATEGORY_ICONS: Record<string, string> = {
  // ... existing
  newcat: 'icon_name'  // Material Symbols icon name
};
```

### Adding a New Game Phase

1. Add phase to `types.ts`:
```typescript
enum GamePhase {
  // ... existing
  NEW_PHASE = 'NEW_PHASE'
}
```

2. Create component in `src/components/game/`
3. Add case in `src/App.tsx`:
```typescript
case GamePhase.NEW_PHASE:
  return <NewPhaseComponent />;
```

---

## 10. Rules for AI Agents

### ⚠️ Critical Rules

1. **DO NOT change the UI design**
   - Colors, fonts, animations, and layout are intentional
   - Only modify if explicitly requested

2. **DO NOT change game logic**
   - Spy selection algorithm
   - Timer mechanics
   - Word selection logic
   - Voting/scoring systems

3. **DO NOT add features without request**
   - No "Online Multiplayer"
   - No "PWA / Service Worker"
   - No "Database / Backend"

4. **DO NOT break the build**
   - Run `npm run build` before completing any task
   - Verify app loads in browser

### ✅ Good Practices

1. **Keep components small**
   - Target: under 150 lines per component
   - Split large components into sub-components

2. **Use optimized selectors**
   ```typescript
   // Good: Select only what you need
   const players = useGameStore(state => state.players);
   
   // Bad: Select entire state
   const state = useGameStore();
   ```

3. **Memoize expensive components**
   ```typescript
   const ExpensiveComponent = React.memo(({ data }) => {
     // ...
   });
   ```

4. **Clean code**
   - Remove unused imports
   - Remove unused variables
   - Remove commented-out code

5. **Consistent naming**
   - Components: `PascalCase.tsx`
   - Functions: `camelCase`
   - Constants: `SCREAMING_SNAKE_CASE`

---

## 📄 License

Private project - All rights reserved.

---

## 📞 Contact

For questions about this project, refer to the source code and this documentation.

---

*Last updated: January 2026*