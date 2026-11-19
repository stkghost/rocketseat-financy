import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/utils'

export function TextLink({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        'text-sm font-medium text-brand-base decoration-1 underline-offset-4 outline-none hover:underline focus-visible:underline',
        className
      )}
      {...props}
    />
  )
}
