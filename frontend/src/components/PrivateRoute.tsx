import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/auth'

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}
