import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import logo from '@/assets/logo.svg'

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-4 py-12">
      <img src={logo} alt="Financy" className="h-8" />
      {children ?? <Outlet />}
    </div>
  )
}
