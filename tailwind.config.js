/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}', // Inclua todos os arquivos que usarão Tailwind
    './node_modules/@mui/joy/**/*.{js,ts,jsx,tsx}', // Adiciona o Joy UI
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          900: '#18181b', // Cor de fundo personalizada zinc-900
        },
      },
    },
  },
  plugins: [],
}