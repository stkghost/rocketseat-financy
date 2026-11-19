import type { SelectOption } from '@/components/form'

export const ALL = 'all'

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' })

export function toPeriodValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function parsePeriodValue(value: string) {
  if (value === ALL) return { year: null, month: null }
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

function formatPeriodLabel(value: string) {
  const { year, month } = parsePeriodValue(value)
  if (!year || !month) return 'Todos os períodos'
  const name = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)))
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} / ${year}`
}

export function buildPeriodOptions(months: string[], current: string): SelectOption[] {
  const values = [...new Set([current, ...months])].sort((first, second) =>
    second.localeCompare(first)
  )

  return [
    { value: ALL, label: 'Todos os períodos' },
    ...values.map((value) => ({ value, label: formatPeriodLabel(value) })),
  ]
}
