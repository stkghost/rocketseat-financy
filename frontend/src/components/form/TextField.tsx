import { useId, type ComponentProps, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Field } from './Field'
import { fieldBoxClass, fieldIconClass } from './field-styles'

export type TextFieldProps = Omit<ComponentProps<'input'>, 'children'> & {
  label?: string
  helper?: ReactNode
  icon?: LucideIcon
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  error?: boolean
  containerClassName?: string
}

export function TextField({
  label,
  helper,
  icon: Icon,
  startAdornment,
  endAdornment,
  error,
  disabled,
  id,
  placeholder,
  className,
  containerClassName,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helperId = `${inputId}-helper`

  return (
    <Field
      id={inputId}
      label={label}
      helper={helper}
      helperId={helperId}
      error={error}
      disabled={disabled}
      className={containerClassName}
    >
      <div className={fieldBoxClass}>
        {Icon && (
          <Icon
            aria-hidden
            className={cn(
              'size-4 shrink-0',
              fieldIconClass({
                error,
                disabled,
                emptyClass: 'group-has-[input:placeholder-shown]/field:text-gray-400',
              })
            )}
          />
        )}
        {startAdornment}
        <input
          id={inputId}
          disabled={disabled}
          placeholder={placeholder ?? ' '}
          aria-invalid={error || undefined}
          aria-describedby={helper ? helperId : undefined}
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent caret-brand-base outline-none placeholder:text-gray-400 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {endAdornment}
      </div>
    </Field>
  )
}
