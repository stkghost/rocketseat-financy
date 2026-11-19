import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppHeader } from '@/components/AppHeader'

export function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="px-6 py-12 md:px-12">{children ?? <Outlet />}</main>
    </div>
  )
}
