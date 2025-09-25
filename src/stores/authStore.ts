import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

// Mock user for development
const createMockUser = (role: UserRole = 'admin'): User => ({
  id: '1',
  email: 'john.doe@osc.ny.gov',
  firstName: 'John',
  lastName: 'Doe',
  role,
  department: 'Office of State Comptroller',
  title: 'Senior Form Builder',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    emailNotifications: true,
    dashboardLayout: 'grid',
    autoSave: true
  },
  permissions: [
    {
      id: '1',
      name: 'System Administration',
      resource: 'system',
      action: 'manage'
    },
    {
      id: '2',
      name: 'User Management',
      resource: 'users',
      action: 'manage'
    },
    {
      id: '3',
      name: 'Form Management',
      resource: 'forms',
      action: 'manage'
    },
    {
      id: '4',
      name: 'Analytics Management',
      resource: 'analytics',
      action: 'manage'
    }
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  isActive: true
})

const createAdminUser = (): User => ({
  ...createMockUser('admin'),
  email: 'admin@osc.ny.gov',
  firstName: 'Admin',
  lastName: 'User',
  title: 'System Administrator',
  permissions: [
    {
      id: '1',
      name: 'System Administration',
      resource: 'system',
      action: 'manage'
    },
    {
      id: '2',
      name: 'User Management',
      resource: 'users',
      action: 'manage'
    },
    {
      id: '3',
      name: 'Form Management',
      resource: 'forms',
      action: 'manage'
    },
    {
      id: '4',
      name: 'Analytics Management',
      resource: 'analytics',
      action: 'manage'
    }
  ]
})

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        console.log('🔐 Starting login process for:', email)

        set((state) => ({
          ...state,
          isLoading: true,
          error: null
        }))

        try {
          // Validate basic input
          if (!email || !password) {
            throw new Error('Email and password are required')
          }

          console.log('⏳ Simulating API call...')
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Mock authentication logic - accepts any email/password combination
          // All demo users are now admins by default
          console.log('👑 Creating admin user for demo')
          const mockUser: User = createMockUser()
          // Update email to match what user entered
          mockUser.email = email

          const mockToken = `mock_token_${Date.now()}`

          console.log('✅ Authentication successful, updating state...')
          set((state) => {
            console.log('📝 Before state update:', {
              isAuthenticated: state.isAuthenticated,
              user: state.user?.email,
              token: state.token
            })

            const newState = {
              ...state,
              user: mockUser,
              token: mockToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            }

            console.log('📝 After state update:', {
              isAuthenticated: newState.isAuthenticated,
              user: newState.user?.email,
              token: newState.token
            })

            return newState
          })

          // Update last login time
          set((state) => ({
            ...state,
            user: state.user ? {
              ...state.user,
              lastLoginAt: new Date().toISOString()
            } : null
          }))

          console.log('🎉 Login completed successfully!')
          console.log('User:', mockUser.firstName, mockUser.lastName)
          console.log('Role:', mockUser.role)

          // Verify final state after all updates
          const finalState = get()
          console.log('🔍 Final auth state:', {
            isAuthenticated: finalState.isAuthenticated,
            user: finalState.user?.email,
            token: finalState.token ? 'present' : 'missing'
          })

        } catch (error) {
          console.error('❌ Login failed:', error)
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed'

          set((state) => ({
            ...state,
            isLoading: false,
            error: errorMessage
          }))
          throw error
        }
      },

      logout: () => {
        set(() => ({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        }))
      },

      checkAuth: () => {
        const { token } = get()
        if (token && !get().isAuthenticated) {
          // In a real app, you'd verify the token with the server
          // For now, we'll assume a valid token means authenticated
          set((state) => ({
            ...state,
            isAuthenticated: true
          }))
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        set((state) => ({
          ...state,
          isLoading: true,
          error: null
        }))

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))

          set((state) => ({
            ...state,
            user: state.user ? {
              ...state.user,
              ...updates,
              updatedAt: new Date().toISOString()
            } : null,
            isLoading: false
          }))

        } catch (error) {
          set((state) => ({
            ...state,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Profile update failed'
          }))
          throw error
        }
      },

      clearError: () => {
        set((state) => ({
          ...state,
          error: null
        }))
      },

      setLoading: (loading: boolean) => {
        set((state) => ({
          ...state,
          isLoading: loading
        }))
      }
    }),
    {
      name: 'osc-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Helper functions
export const hasPermission = (user: User | null, resource: string, action: string): boolean => {
  if (!user) return false

  // Admins have all permissions
  if (user.role === 'admin') return true

  return user.permissions.some(permission =>
    permission.resource === resource &&
    (permission.action === action || permission.action === 'manage')
  )
}

export const hasRole = (user: User | null, roles: UserRole | UserRole[]): boolean => {
  if (!user) return false

  const roleArray = Array.isArray(roles) ? roles : [roles]
  return roleArray.includes(user.role)
}

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin')
}

export const canAccessAdmin = (user: User | null): boolean => {
  return hasRole(user, ['admin', 'manager'])
}