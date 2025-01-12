/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
 theme: {
      extend: {
         colors:{
            'background': '#fafafa',
            'primary': '#006CE6',
            'secondary': '#D1D5D8',
            'primarydark': '#0054B3',
            'primarylight':'#cae1fa',
         }

      },
   },
  plugins: [],
}
