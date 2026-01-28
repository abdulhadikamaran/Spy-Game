# 🕵️‍♂️ Kurdspyy (Kurdish Spyfall)

**Kurdspyy** is a web-based social deduction game specifically tailored for Kurdish speakers. Inspired by the popular game *Spyfall*, it brings friends and family together to test their deception and deduction skills.

The game is built with a mobile-first approach, making it perfect for gatherings, parties, and casual hangouts.

![Kurdish Spyfall](https://placehold.co/1200x400/2563eb/ffffff?text=Kurdspyy+-+Kurdish+Spyfall)

---

## ✨ Features

- **🎲 Multiple Categories:** Choose from diverse word packs including:
  - **Football** (Legends, Modern Stars, Clubs)
  - **Movies & TV Shows** (Global Hits, Anime, Kurdish Favorites)
  - **Daily Life** (Jobs, Cars, Food/Meals)
  - **Gaming** (Clash Royale, PUBG, etc.)
  - **Famous People** (Kurdish Singers, Global Icons)
- **🌍 Bilingual Support:** Many categories (Movies, Games, Famous People) display items in both **Kurdish** and **English**, making it accessible to a wider audience.
- **📱 PWA Support:** Installable as a native-like app on your mobile device (iOS & Android).
- **🌗 Smooth UI:** Built with **Tailwind CSS** and **Framer Motion** for a modern, fluid user experience using a dark/light mode aesthetic.
- **⏱️ Game Timer:** Integrated countdown timer to keep the gameplay fast-paced.
- **👥 Flexible Roles:** Supports variable settings for number of spies and round duration.

---

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository** (or download usage files):
   ```bash
   git clone https://github.com/yourusername/kurdspyy.git
   cd kurdspyy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` (or the URL shown in your terminal).

---

## 🛠️ Tech Stack

This project is built using modern web technologies for performance and scalability:

- **Frontend Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🎮 How to Play

1. **Lobby:** One player creates a room or everyone gathers around one device. Configure settings (Timer, Number of Spies, Categories).
2. **Handover:** Pass the device around. Each player taps to see their role:
   - **Civilian:** You see the **Secret Word/Location**.
   - **Spy:** You see **"YOU ARE THE SPY"** (you don't know the word).
3. **Question Round:** Players take turns asking each other questions about the secret word.
   - *Civilian goal:* Identify the Spy without revealing the word too clearly.
   - *Spy goal:* Blend in, figure out the word, or survive until the timer ends.
4. **Voting/Guessing:**
   - At any time (or when the timer ends), players can vote to accuse someone of being the Spy.
   - The Spy can reveal themselves if they guess the word correctly to steal the win!

---

## 📂 Project Structure

```
src/
├── components/      # React components (Game, Lobby, UI)
├── data/            # Word packs and categories (wordPacks.ts)
├── store/           # Global state management (Zustand)
├── types.ts         # TypeScript definitions
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```

## 📜 License

This project is open-source and available for personal and educational use.
