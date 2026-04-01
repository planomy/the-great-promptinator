/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139, 92, 246, 0.25), 0 15px 35px rgba(15, 23, 42, 0.4)',
      },
      backgroundImage: {
        mesh:
          'radial-gradient(circle at 10% -10%, rgba(56, 189, 248, 0.25), transparent 30%), radial-gradient(circle at 90% 0%, rgba(167, 139, 250, 0.3), transparent 35%), radial-gradient(circle at 50% 120%, rgba(45, 212, 191, 0.2), transparent 40%)',
      },
    },
  },
  plugins: [],
}
