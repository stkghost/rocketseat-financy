import { cn } from '@/lib/utils'

type UserAvatarProps = {
  name: string
  size?: 'sm' | 'lg'
  className?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts.at(0)?.[0] ?? ''
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function UserAvatar({ name, size = 'sm', className }: UserAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gray-300 font-medium text-gray-800 select-none',
        size === 'sm' ? 'size-9 text-sm' : 'size-16 text-2xl',
        className
      )}
    >
      {getInitials(name)}
    </span>
  )
}
