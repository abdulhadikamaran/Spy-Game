/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // System fonts with Arabic support for offline mode
        sans: ['Vazirmatn', 'Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
        display: ['Work Sans', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      colors: {
        // Blood Red theme (from original index.html)
        primary: "#C0191F",
        "primary-hover": "#9F151A",
        "primary-dark": "#7D1416",
        background: "#282F32",
        surface: "#4D474F",
        "surface-dark": "#371211",
        "surface-glass": "rgba(77, 71, 79, 0.4)",
        text: {
          main: "#FDE3CF",
          heading: "#E51E1B",
          muted: "rgba(253, 227, 207, 0.6)",
          light: "#F3F4F6",
        },
        accent: "#E51E1B",
        "input-bg": "#282F32",
      },
      boxShadow: {
        tactile: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        ceramic: "0 20px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        "inner-depth": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px rgba(192, 25, 31, 0.3)",
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        full: "9999px",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
    },
  },
  plugins: [],
};