import { categoryIconOptions, categoryIcons } from '@/lib/category-styles'
import { cn } from '@/lib/utils'
import type { CategoryIcon } from '@/types/finance'

type CategoryIconPickerProps = {
  value: CategoryIcon
  onChange: (value: CategoryIcon) => void
  labelId: string
}

export function CategoryIconPicker({ value, onChange, labelId }: CategoryIconPickerProps) {
  return (
    <div role="radiogroup" aria-labelledby={labelId} className="grid grid-cols-8 gap-2">
      {categoryIconOptions.map((option) => {
        const { icon: Icon, label } = categoryIcons[option]
        const selected = value === option

        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => onChange(option)}
            className={cn(
              'flex aspect-square items-center justify-center rounded-lg border transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand-base/30',
              selected
                ? 'border-brand-base bg-gray-100 text-gray-600'
                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100'
            )}
          >
            <Icon aria-hidden className="size-5" />
          </button>
        )
      })}
    </div>
  )
}
