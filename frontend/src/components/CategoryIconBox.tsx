import { categoryColorClasses, categoryIcons } from '@/lib/category-styles'
import { cn } from '@/lib/utils'
import type { CategoryColor, CategoryIcon } from '@/types/finance'

type CategoryIconBoxProps = {
  icon: CategoryIcon
  color: CategoryColor
  className?: string
}

export function CategoryIconBox({ icon, color, className }: CategoryIconBoxProps) {
  const Icon = categoryIcons[icon].icon

  return (
    <span
      aria-hidden
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg',
        categoryColorClasses[color].icon,
        className
      )}
    >
      <Icon className="size-4" />
    </span>
  )
}
