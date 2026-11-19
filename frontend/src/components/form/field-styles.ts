import { cn } from '@/lib/utils'

export function fieldIconClass({
  error,
  disabled,
  emptyClass,
}: {
  error?: boolean
  disabled?: boolean
  emptyClass: string
}) {
  if (disabled) return 'text-gray-400'
  if (error) return 'text-danger'
  return cn('text-gray-700', emptyClass, 'group-focus-within/field:text-brand-base!')
}

export const fieldBoxClass =
  'flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-800 transition-colors ' +
  'has-disabled:border-gray-200 has-disabled:text-gray-400 data-disabled:border-gray-200 data-disabled:text-gray-400'
