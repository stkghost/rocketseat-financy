import { categoryColorClasses } from '@/lib/category-styles'
import { cn } from '@/lib/utils'
import type { CategoryColor } from '@/types/finance'

type CategoryBadgeProps = {
  name: string
  color: CategoryColor
  className?: string
}

export function CategoryBadge({ name, color, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap',
        categoryColorClasses[color].badge,
        className
      )}
    >
      {name}
    </span>
  )
}
