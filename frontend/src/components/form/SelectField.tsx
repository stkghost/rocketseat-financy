import { useId, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Select } from 'radix-ui'
import { Check, ChevronDown } from '@/components/icons'
import { cn } from '@/lib/utils'
import { Field } from './Field'
import { fieldBoxClass, fieldIconClass } from './field-styles'

export type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  options: SelectOption[]
  label?: string
  helper?: ReactNode
  icon?: LucideIcon
  error?: boolean
  disabled?: boolean
  placeholder?: string
  emptyMessage?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  required?: boolean
  id?: string
  containerClassName?: string
}

export function SelectField({
  options,
  label,
  helper,
  icon: Icon,
  error,
  disabled,
  placeholder = 'Selecione',
  emptyMessage = 'Nenhuma opção disponível',
  id,
  containerClassName,
  ...rootProps
}: SelectFieldProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const helperId = `${triggerId}-helper`

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
      <Select.Root disabled={disabled} {...rootProps}>
        <Select.Trigger
          id={triggerId}
          aria-invalid={error || undefined}
          aria-describedby={helper ? helperId : undefined}
          className={cn(
            fieldBoxClass,
            'group/trigger cursor-pointer text-left outline-none data-disabled:cursor-not-allowed data-placeholder:text-gray-400'
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
            <Select.Value placeholder={placeholder} />
          </span>
          <Select.Icon asChild>
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 text-gray-700 transition-transform group-data-disabled/trigger:text-gray-400 group-data-[state=open]/trigger:rotate-180"
            />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={8}
            className="z-50 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
          >
            <Select.Viewport className="p-1">
              {options.length === 0 && (
                <p className="px-2 py-2 text-sm text-gray-500">{emptyMessage}</p>
              )}
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex h-9 cursor-pointer items-center justify-between gap-2 rounded-md px-2 text-base text-gray-700 outline-none select-none data-highlighted:bg-gray-100 data-[state=checked]:font-medium data-[state=checked]:text-gray-800"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check aria-hidden className="size-4 text-success" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Field>
  )
}
