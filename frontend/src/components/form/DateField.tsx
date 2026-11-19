import { useId, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ptBR } from 'react-day-picker/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Field } from './Field'
import { fieldBoxClass, fieldIconClass } from './field-styles'

type DateFieldProps = {
  value?: Date
  onChange: (value: Date | undefined) => void
  label?: string
  helper?: ReactNode
  icon?: LucideIcon
  error?: boolean
  disabled?: boolean
  placeholder?: string
  id?: string
  containerClassName?: string
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR')

export function DateField({
  value,
  onChange,
  label,
  helper,
  icon: Icon,
  error,
  disabled,
  placeholder = 'Selecione',
  id,
  containerClassName,
}: DateFieldProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const helperId = `${triggerId}-helper`
  const [open, setOpen] = useState(false)

  return (
    <Field
      id={triggerId}
      label={label}
      helper={helper}
      helperId={helperId}
      error={error}
      disabled={disabled}
      className={containerClassName}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={triggerId}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helper ? helperId : undefined}
            data-placeholder={value ? undefined : ''}
            className={cn(
              fieldBoxClass,
              'text-left outline-none disabled:cursor-not-allowed data-placeholder:text-gray-400'
            )}
          >
            {Icon && (
              <Icon
                aria-hidden
                className={cn(
                  'size-4 shrink-0',
                  fieldIconClass({
                    error,
                    disabled,
                    emptyClass: 'group-has-data-placeholder/field:text-gray-400',
                  })
                )}
              />
            )}
            <span className="min-w-0 flex-1 truncate">
              {value ? dateFormatter.format(value) : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-auto p-0">
          <Calendar
            mode="single"
            locale={ptBR}
            selected={value}
            defaultMonth={value}
            onSelect={(date) => {
              onChange(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
