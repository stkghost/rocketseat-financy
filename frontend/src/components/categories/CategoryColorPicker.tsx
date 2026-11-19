import { categoryColorClasses, categoryColorOptions } from '@/lib/category-styles'
import { cn } from '@/lib/utils'
import type { CategoryColor } from '@/types/finance'

type CategoryColorPickerProps = {
  value: CategoryColor
  onChange: (value: CategoryColor) => void
  labelId: string
}

export function CategoryColorPicker({ value, onChange, labelId }: CategoryColorPickerProps) {
  return (
    <div role="radiogroup" aria-labelledby={labelId} className="grid grid-cols-7 gap-2">
      {categoryColorOptions.map((option) => {
        const { swatch, label } = categoryColorClasses[option]
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
              'flex h-7.5 rounded-md border p-1 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand-base/30',
              selected
                ? 'border-brand-base bg-gray-100'
                : 'border-gray-300 bg-white hover:bg-gray-100'
            )}
          >
            <span aria-hidden className={cn('flex-1 rounded-sm', swatch)} />
          </button>
        )
      })}
    </div>
  )
}
