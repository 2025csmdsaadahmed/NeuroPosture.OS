/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060911',
          900: '#0a0f1d',
          850: '#0e1529',
          800: '#141d38',
          700: '#1e294b',
          600: '#2b3a67',
          500: '#41558f',
        },
        deskcore: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          teal: '#0ea5e9',
          accent: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.15)',
        },
        posture: {
          optimal: '#10b981',
          caution: '#f59e0b',
          critical: '#ef4444',
          unavailable: '#64748b'
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.45)',
        'glow-cyan': '0 0 20px -2px rgba(6, 182, 212, 0.35)',
        'glow-optimal': '0 0 20px -2px rgba(16, 185, 129, 0.35)',
        'glow-caution': '0 0 20px -2px rgba(245, 158, 11, 0.35)',
        'glow-critical': '0 0 20px -2px rgba(239, 68, 68, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
