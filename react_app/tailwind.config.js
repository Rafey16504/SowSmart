/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
    fontFamily:{
      'grotesk': ['"Familjen Grotesk"'],
      'ubuntu': ['"Ubuntu"'],
      'oswald': ['"Oswald"'],
      'inter': ['"Inter"'],
    },
  },
  plugins: [],
};
