import { Link, NavLink } from 'react-router'
import logo from '@/assets/logo.svg'
import { UserAvatar } from '@/components/UserAvatar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/transactions', label: 'Transações' },
  { to: '/categories', label: 'Categorias' },
]

export function AppHeader() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 md:px-12">
        <Link to="/" className="justify-self-start">
          <img src={logo} alt="Financy" className="h-6" />
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'text-sm text-gray-600 outline-none transition-colors hover:text-brand-base focus-visible:text-brand-base',
                  isActive && 'font-semibold text-brand-base'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <Link
            to="/profile"
            aria-label="Meu perfil"
            className="justify-self-end rounded-full outline-none focus-visible:ring-3 focus-visible:ring-brand-base/30"
          >
            <UserAvatar name={user.name} />
          </Link>
        )}
      </div>
    </header>
  )
}
