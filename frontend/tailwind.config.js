/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind to scan these files for class names
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Enable class-based dark mode
  darkMode: "class",
  theme: {
    extend: {
      // VYDHYA 2.0 custom color palette
      colors: {
        primary: {
          DEFAULT: "#0F4C81",
          light: "#1a5f9e",
          dark: "#0a3660",
        },
        secondary: "#4A90E2",
        accent: "#22C55E",
        danger: "#EF4444",
        background: {
          light: "#F8FAFC",
          dark: "#0F172A",
        },
      },
      // VYDHYA 2.0 custom fonts
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
