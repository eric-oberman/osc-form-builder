import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

// Layout Components
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'

// Page Components
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { FormBuilderPage } from '@/pages/forms/FormBuilderPage'
import { FormListPage } from '@/pages/forms/FormListPage'
import { FormPreviewPage } from '@/pages/forms/FormPreviewPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { UserManagementPage } from '@/pages/admin/UserManagementPage'
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage'
import { PreferencesPage } from '@/pages/user/PreferencesPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { WelcomePage } from '@/pages/public/WelcomePage'
import { TutorialPage } from '@/pages/public/TutorialPage'
import { PublicFormPage } from '@/pages/public/PublicFormPage'
import { AIAssistantPage } from '@/pages/ai/AIAssistantPage'

// Route Guards
import { ProtectedRoute } from '@/components/navigation/ProtectedRoute'
import { AdminRoute } from '@/components/navigation/AdminRoute'

function App() {
  console.log('🔧 App component initializing...')

  const { user, checkAuth } = useAuthStore()
  const { theme, initializeTheme } = useThemeStore()

  console.log('👤 Current user state:', user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Not authenticated')
  console.log('🎨 Current theme:', theme)

  // Initialize authentication and theme on app start
  useEffect(() => {
    console.log('🔄 App useEffect: Initializing auth and theme...')
    try {
      checkAuth()
      console.log('✅ Auth check completed')
    } catch (error) {
      console.error('❌ Auth check failed:', error)
    }

    try {
      initializeTheme()
      console.log('✅ Theme initialization completed')
    } catch (error) {
      console.error('❌ Theme initialization failed:', error)
    }
  }, [checkAuth, initializeTheme])

  // Apply theme class to document
  useEffect(() => {
    console.log('🎨 Applying theme class to document:', theme)
    try {
      document.documentElement.className = theme
      console.log('✅ Theme applied successfully')
    } catch (error) {
      console.error('❌ Failed to apply theme:', error)
    }
  }, [theme])

  console.log('🚦 App render: Starting route resolution...')
  console.log('🚦 App render: User auth status:', user ? 'authenticated' : 'not authenticated')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-osc-navy-950">
      <Routes>
        {/* Public Routes */}
        <Route path="/tutorial" element={<TutorialPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/welcome" element={<WelcomePage />} />
        </Route>

        {/* Public Form Routes - No layout wrapper */}
        <Route path="/f/:id/:token" element={<PublicFormPage />} />
        <Route path="/f/:id" element={<PublicFormPage />} />

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* AI Assistant */}
            <Route path="/ai-assistant" element={<AIAssistantPage />} />

            {/* User Settings */}
            <Route path="/preferences" element={<PreferencesPage />} />

            {/* Form Management */}
            <Route path="/forms" element={<FormListPage />} />
            <Route path="/forms/new" element={<FormBuilderPage />} />
            <Route path="/forms/:id" element={<FormBuilderPage />} />
            <Route path="/forms/:id/preview" element={<FormPreviewPage />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
            </Route>
          </Route>
        </Route>

        {/* Root Route Logic */}
        <Route
          path="/"
          element={
            user ?
            <Navigate to="/dashboard" replace /> :
            <Navigate to="/welcome" replace />
          }
        />

        {/* Catch All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App