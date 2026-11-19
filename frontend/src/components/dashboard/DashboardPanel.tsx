import type { ReactNode } from 'react'
import { ChevronRight } from '@/components/icons'
import { TextLink } from '@/components/TextLink'
import { cn } from '@/lib/utils'

type DashboardPanelProps = {
  title: string
  linkLabel: string
  linkTo: string
  className?: string
  children: ReactNode
}

export function DashboardPanel({ title, linkLabel, linkTo, className, children }: DashboardPanelProps) {
  return (
    <section
      className={cn('flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white', className)}
    >
      <header className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-5">
        <h2 className="text-xs font-medium tracking-wider text-gray-500 uppercase">{title}</h2>
        <TextLink to={linkTo} className="flex items-center gap-1">
          {linkLabel}
          <ChevronRight aria-hidden className="size-4" />
        </TextLink>
      </header>
      {children}
    </section>
  )
}
