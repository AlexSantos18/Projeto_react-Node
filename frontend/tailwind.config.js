/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fintech: {
          50: '#f6f7fb',
          100: '#eef2fb',
          300: '#7c3aed', // accent principal
          400: '#6d28d9',
          500: '#5b21b6',
          cyan: '#06b6d4',
          success: '#10b981',
          danger: '#ef4444'
        }
      },
      boxShadow: {
        'soft-lg': '0 8px 30px rgba(21,15,45,0.06)',
        'card': '0 10px 30px rgba(16,24,40,0.06)',
      },
      borderRadius: {
        xl2: '1rem',
      }
    }
  },
  plugins: []
}
