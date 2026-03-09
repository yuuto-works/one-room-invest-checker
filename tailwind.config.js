/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182233',
        navy: '#22314d',
        mist: '#f4f6fb',
        line: '#d9e1f0',
        softblue: '#dfe8fb',
        positive: '#d9f3eb',
        caution: '#fff1cc',
        danger: '#fee2e2',
      },
      boxShadow: {
        panel: '0 12px 32px rgba(24, 34, 51, 0.08)',
        soft: '0 10px 24px rgba(34, 49, 77, 0.16)',
      },
    },
  },
  plugins: [],
};
