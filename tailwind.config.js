/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🛑 THE CRITICAL FIX: Tell Tailwind to look for the 'dark' class on the HTML element
  darkMode: 'class', 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage-accent': '#A3B18A',
        'sage-dark': '#7D8B6E',
        'charcoal': '#333333',
        'light-gray': '#F8F8F8',
        // New: Adding amber to ensure it's processed alongside custom colors
        'app-amber': {
            '500': '#f59e0b', // Used as the main accent in HomePage/Navbar
            '600': '#d97706', // Used for hover state
        },
        // Defining softer dark mode colors
        'dark-bg': '#121212',
        'dark-text': '#F0F0F0',
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'], 
        'sans': ['Arial', 'sans-serif'],
      },
      boxShadow: {
        'recipe-premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
