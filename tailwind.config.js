/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: "class",
  content: [
    './pages/**/*.{html,js}',
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})
