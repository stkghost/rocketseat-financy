import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatCardProps = {
  icon: LucideIcon
  iconClassName?: string
  value: string | number
  label: string
}

export function StatCard({ icon: Icon, iconClassName, value, label }: StatCardProps) {
  return (
    <section className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <Icon aria-hidden className={cn('mt-1.5 size-6 shrink-0 text-gray-700', iconClassName)} />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-3xl font-bold text-gray-800">{value}</p>
        <h2 className="text-xs font-medium tracking-wider text-gray-500 uppercase">{label}</h2>
      </div>
    </section>
  )
}
