import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FieldProps = {
  id: string
  label?: string
  helper?: ReactNode
  helperId: string
  error?: boolean
  disabled?: boolean
  className?: string
  children: ReactNode
}

export function Field({
  id,
  label,
  helper,
  helperId,
  error,
  disabled,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('group/field flex flex-col gap-2', className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-medium text-gray-700',
            error
              ? 'text-danger'
              : !disabled && 'group-focus-within/field:text-brand-base'
          )}
        >
          {label}
        </label>
      )}

      {children}

      {helper && (
        <p id={helperId} className="text-xs text-gray-500">
          {helper}
        </p>
      )}
    </div>
  )
}
