/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-light': '#F5F5F5',
        'foreground-light': '#212121',
        'primary-light': '#FFFFFF',
        'secondary-light': '#E0E0E0',
        'background-dark': '#121212',
        'foreground-dark': '#E0E0E0',
        'primary-dark': '#1E1E1E',
        'secondary-dark': '#2C2C2C',
      },
    },
  },
  plugins: [],
}
