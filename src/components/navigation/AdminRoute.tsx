import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, canAccessAdmin } from '@/stores/authStore'

export function AdminRoute() {
  const { user } = useAuthStore()

  if (!canAccessAdmin(user)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}