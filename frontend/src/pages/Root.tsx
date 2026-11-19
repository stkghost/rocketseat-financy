import { AuthLayout } from '@/components/AuthLayout'
import { Layout } from '@/components/Layout'
import { Login } from '@/pages/Auth/Login'
import { Dashboard } from '@/pages/Dashboard'
import { useAuthStore } from '@/stores/auth'

export function Root() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Login />
      </AuthLayout>
    )
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}
