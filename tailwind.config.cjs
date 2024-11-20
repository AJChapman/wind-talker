/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,md,svx}'],
  theme: {
    extend: {
        fontFamily: {
            'sans': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
        },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
