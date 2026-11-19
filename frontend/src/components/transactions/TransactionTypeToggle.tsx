import { CircleArrowDown, CircleArrowUp } from '@/components/icons'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/types/finance'

type TransactionTypeToggleProps = {
  value: TransactionType
  onChange: (value: TransactionType) => void
}

const options = [
  {
    value: 'expense',
    label: 'Despesa',
    icon: CircleArrowDown,
    activeClass: 'border-red-base',
    activeIconClass: 'text-red-base',
  },
  {
    value: 'income',
    label: 'Receita',
    icon: CircleArrowUp,
    activeClass: 'border-brand-base',
    activeIconClass: 'text-brand-base',
  },
] as const

export function TransactionTypeToggle({ value, onChange }: TransactionTypeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Tipo da transação"
      className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 p-2"
    >
      {options.map((option) => {
        const selected = value === option.value
        const Icon = option.icon

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex h-11.5 items-center justify-center gap-3 rounded-lg border text-base transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand-base/30',
              selected
                ? cn('bg-gray-100 font-medium text-gray-800', option.activeClass)
                : 'border-transparent text-gray-600 hover:bg-gray-100'
            )}
          >
            <Icon
              aria-hidden
              className={cn('size-4', selected ? option.activeIconClass : 'text-gray-400')}
            />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
