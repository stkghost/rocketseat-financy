import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/auth'

export function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}
