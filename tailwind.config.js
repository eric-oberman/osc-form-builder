/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        osc: {
          navy: '#0f172a',
          'navy-light': '#1e3a8a',
          blue: '#1e40af',
          'blue-light': '#3b82f6',
          green: '#059669',
          'green-light': '#10b981',
          gold: '#f59e0b',
          red: '#ef4444',
          light: '#f8fafc',
          gray: '#64748b'
        },
        // Enhanced neutral palette
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontSize: {
        'display': ['48px', { lineHeight: '52px', fontWeight: '700' }],
        'heading-1': ['36px', { lineHeight: '40px', fontWeight: '700' }],
        'heading-2': ['24px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-3': ['20px', { lineHeight: '24px', fontWeight: '600' }],
        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(15, 23, 42, 0.08)',
        'soft-md': '0 4px 12px rgba(15, 23, 42, 0.12), 0 2px 4px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 8px 25px rgba(15, 23, 42, 0.15), 0 3px 10px rgba(15, 23, 42, 0.08)',
        'subtle': '0 1px 2px rgba(15, 23, 42, 0.1), 0 1px 3px rgba(15, 23, 42, 0.1)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}