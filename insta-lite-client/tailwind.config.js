/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0096FF',
        secondary: '#FFC0CB',
        dark: '#2C2C2C',
        light: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
