import { useState } from 'react'
import { Eye, EyeClosed, Lock } from '@/components/icons'
import { TextField, type TextFieldProps } from './TextField'

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endAdornment'>

export function PasswordField({ icon = Lock, disabled, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const ToggleIcon = visible ? Eye : EyeClosed

  return (
    <TextField
      type={visible ? 'text' : 'password'}
      icon={icon}
      disabled={disabled}
      endAdornment={
        <button
          type="button"
          disabled={disabled}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="-mr-1 flex size-6 shrink-0 items-center justify-center rounded text-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-brand-base/50 disabled:text-gray-400"
        >
          <ToggleIcon aria-hidden className="size-4" />
        </button>
      }
      {...props}
    />
  )
}
