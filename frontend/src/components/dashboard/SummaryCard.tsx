import type { LucideIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

type SummaryCardProps = {
  label: string
  value: number
  icon: LucideIcon
  iconClassName: string
}

export function SummaryCard({ label, value, icon: Icon, iconClassName }: SummaryCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="flex items-center gap-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
        <Icon aria-hidden className={cn('size-5', iconClassName)} />
        {label}
      </h2>
      <p className="text-3xl font-bold text-gray-800">{formatCurrency(value)}</p>
    </section>
  )
}
