import type { ChangeEvent } from 'react'
import { TextField, type TextFieldProps } from './TextField'

type CurrencyFieldProps = Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'startAdornment'
> & {
  value: number
  onChange: (value: number) => void
}

const amountFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function CurrencyField({ value, onChange, ...props }: CurrencyFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 12)
    onChange(Number(digits || '0') / 100)
  }

  return (
    <TextField
      {...props}
      type="text"
      inputMode="numeric"
      value={amountFormatter.format(value)}
      onChange={handleChange}
      startAdornment={<span className="text-base font-medium text-gray-800">R$</span>}
    />
  )
}
