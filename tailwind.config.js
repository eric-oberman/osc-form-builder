/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // OSC Official Color Palette
      colors: {
        // Primary OSC Colors
        'osc-navy': {
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
          950: '#020617'
        },
        'osc-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        'osc-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        'osc-gold': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        // Government Semantic Colors
        'gov-primary': '#0f172a',
        'gov-secondary': '#1e40af',
        'gov-accent': '#059669',
        'gov-warning': '#f59e0b',
        'gov-error': '#ef4444',
        'gov-success': '#10b981'
      },

      // Government Typography
      fontFamily: {
        'gov': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', 'monospace']
      },

      // Professional Typography Scale
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', fontWeight: '700' }], // 48px
        'heading-1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }], // 36px
        'heading-2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }], // 30px
        'heading-3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }], // 24px
        'heading-4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }], // 20px
        'body-large': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
        'body-small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }], // 12px
        'overline': ['0.75rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase' }]
      },

      // Enhanced Spacing Scale
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem'
      },

      // Professional Border Radius
      borderRadius: {
        'gov': '0.5rem', // 8px - government standard
        'card': '0.75rem', // 12px - for cards
        'button': '0.5rem', // 8px - for buttons
        'input': '0.375rem' // 6px - for form inputs
      },

      // Professional Shadows
      boxShadow: {
        'gov-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'gov': '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px 0 rgba(15, 23, 42, 0.06)',
        'gov-md': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
        'gov-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
        'gov-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
        'professional': '0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.03)',
        'executive': '0 8px 25px rgba(15, 23, 42, 0.12), 0 4px 6px rgba(15, 23, 42, 0.06)'
      },

      // Animation & Transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out'
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' }
        }
      },

      // Professional Grid System
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(280px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(280px, 1fr))',
        'dashboard': 'repeat(auto-fit, minmax(300px, 1fr))',
        'cards': 'repeat(auto-fit, minmax(320px, 1fr))'
      },

      // Enhanced Z-index Scale
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080'
      },

      // Professional Container Sizes
      maxWidth: {
        'container': '1400px',
        'content': '1200px',
        'readable': '65ch'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('@tailwindcss/typography'),

    // Custom plugin for government utilities
    function({ addUtilities, addComponents, theme }) {
      // Government Button Components
      addComponents({
        '.btn-gov-primary': {
          '@apply bg-gov-primary text-white font-semibold py-3 px-6 rounded-button shadow-gov hover:bg-osc-navy-800 focus:outline-none focus:ring-2 focus:ring-osc-navy-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]': {}
        },
        '.btn-gov-secondary': {
          '@apply bg-white text-gov-primary font-semibold py-3 px-6 rounded-button border border-osc-navy-200 shadow-gov-sm hover:bg-osc-navy-50 focus:outline-none focus:ring-2 focus:ring-osc-navy-500 focus:ring-offset-2 transition-all duration-200': {}
        },
        '.btn-gov-success': {
          '@apply bg-gov-success text-white font-semibold py-3 px-6 rounded-button shadow-gov hover:bg-osc-green-700 focus:outline-none focus:ring-2 focus:ring-osc-green-500 focus:ring-offset-2 transition-all duration-200': {}
        },

        // Government Form Components
        '.form-gov-input': {
          '@apply block w-full rounded-input border border-osc-navy-200 px-3 py-2 text-osc-navy-900 shadow-gov-sm placeholder:text-osc-navy-400 focus:border-gov-secondary focus:outline-none focus:ring-1 focus:ring-gov-secondary transition-colors duration-200': {}
        },
        '.form-gov-select': {
          '@apply block w-full rounded-input border border-osc-navy-200 bg-white px-3 py-2 text-osc-navy-900 shadow-gov-sm focus:border-gov-secondary focus:outline-none focus:ring-1 focus:ring-gov-secondary transition-colors duration-200': {}
        },

        // Government Card Components
        '.card-gov': {
          '@apply bg-white rounded-card border border-osc-navy-200 shadow-gov p-6 hover:shadow-gov-md transition-shadow duration-200': {}
        },
        '.card-gov-executive': {
          '@apply bg-white rounded-card border border-osc-navy-200 shadow-executive p-8 hover:shadow-gov-xl transition-all duration-300': {}
        },

        // Government Layout Utilities
        '.container-gov': {
          '@apply max-w-container mx-auto px-4 sm:px-6 lg:px-8': {}
        },
        '.section-spacing': {
          '@apply py-16 lg:py-24': {}
        }
      });

      // Government Color Utilities
      addUtilities({
        '.text-gov-primary': { color: theme('colors.gov-primary') },
        '.text-gov-secondary': { color: theme('colors.gov-secondary') },
        '.bg-gov-primary': { backgroundColor: theme('colors.gov-primary') },
        '.bg-gov-secondary': { backgroundColor: theme('colors.gov-secondary') },
        '.border-gov-primary': { borderColor: theme('colors.gov-primary') },
        '.border-gov-secondary': { borderColor: theme('colors.gov-secondary') }
      });

      // Accessibility Utilities
      addUtilities({
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0'
        },
        '.not-sr-only': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: '0',
          margin: '0',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'normal'
        },
        '.focus-visible': {
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: theme('colors.gov-secondary'),
            outlineOffset: '2px'
          }
        }
      });
    }
  ],
}