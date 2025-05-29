/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: '#E5E7EB',      // Light gray border
        background: '#FFFFFF',  // White background
        foreground: '#111111',  // Dark text
      },
    },
  },
  plugins: [],
};
