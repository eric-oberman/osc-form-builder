import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
}

interface ThemeActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initializeTheme: () => void
  updateSystemTheme: () => void
}

type ThemeStore = ThemeState & ThemeActions

// Utility functions
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const resolveTheme = (theme: Theme, systemTheme: 'light' | 'dark'): 'light' | 'dark' => {
  if (theme === 'system') {
    return systemTheme
  }
  return theme
}

const applyTheme = (resolvedTheme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolvedTheme)

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0f172a' : '#ffffff')
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // State
      theme: 'system',
      resolvedTheme: 'light',
      systemTheme: 'light',

      // Actions
      setTheme: (theme: Theme) => {
        set((state) => ({
          ...state,
          theme: theme,
          resolvedTheme: resolveTheme(theme, state.systemTheme)
        }))

        const { resolvedTheme } = get()
        applyTheme(resolvedTheme)
      },

      toggleTheme: () => {
        const { theme } = get()

        if (theme === 'system') {
          // If currently system, toggle to opposite of current resolved theme
          const { resolvedTheme } = get()
          get().setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
        } else {
          // If currently light or dark, toggle to opposite
          get().setTheme(theme === 'light' ? 'dark' : 'light')
        }
      },

      initializeTheme: () => {
        const systemTheme = getSystemTheme()

        set((state) => ({
          ...state,
          systemTheme: systemTheme,
          resolvedTheme: resolveTheme(state.theme, systemTheme)
        }))

        const { resolvedTheme } = get()
        applyTheme(resolvedTheme)

        // Set up system theme change listener
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

          const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            get().updateSystemTheme()
          }

          // Use the modern API if available, fallback to deprecated one
          if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange)
          } else {
            // @ts-ignore - deprecated but needed for older browsers
            mediaQuery.addListener(handleSystemThemeChange)
          }

          // Store cleanup function if needed
          return () => {
            if (mediaQuery.removeEventListener) {
              mediaQuery.removeEventListener('change', handleSystemThemeChange)
            } else {
              // @ts-ignore - deprecated but needed for older browsers
              mediaQuery.removeListener(handleSystemThemeChange)
            }
          }
        }
      },

      updateSystemTheme: () => {
        const systemTheme = getSystemTheme()

        set((state) => ({
          ...state,
          systemTheme: systemTheme,
          resolvedTheme: state.theme === 'system' ? systemTheme : state.resolvedTheme
        }))

        const { theme, resolvedTheme } = get()
        if (theme === 'system') {
          applyTheme(resolvedTheme)
        }
      }
    }),
    {
      name: 'osc-theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme
      })
    }
  )
)

// Helper hooks and utilities
export const getThemeColors = (resolvedTheme: 'light' | 'dark') => {
  const colors = {
    light: {
      background: '#f8fafc',
      surface: '#ffffff',
      primary: '#0f172a',
      secondary: '#1e40af',
      accent: '#059669',
      text: {
        primary: '#0f172a',
        secondary: '#64748b',
        tertiary: '#94a3b8'
      },
      border: '#e2e8f0',
      shadow: 'rgba(15, 23, 42, 0.1)'
    },
    dark: {
      background: '#020617',
      surface: '#0f172a',
      primary: '#f8fafc',
      secondary: '#3b82f6',
      accent: '#10b981',
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        tertiary: '#94a3b8'
      },
      border: '#1e293b',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  }

  return colors[resolvedTheme]
}

export const useThemeColors = () => {
  const resolvedTheme = useThemeStore(state => state.resolvedTheme)
  return getThemeColors(resolvedTheme)
}