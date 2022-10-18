/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
        fontFamily: {
            'sans': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
        },
    },
  },
  plugins: [],
}
