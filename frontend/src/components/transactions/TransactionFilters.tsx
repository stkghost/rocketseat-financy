import { SelectField, TextField, type SelectOption } from '@/components/form'
import { Search } from '@/components/icons'
import { ALL } from '@/lib/transaction-filters'

type TransactionFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  type: string
  onTypeChange: (value: string) => void
  categoryId: string
  onCategoryChange: (value: string) => void
  categoryOptions: SelectOption[]
  period: string
  onPeriodChange: (value: string) => void
  periodOptions: SelectOption[]
}

const typeOptions: SelectOption[] = [
  { value: ALL, label: 'Todos' },
  { value: 'income', label: 'Entrada' },
  { value: 'expense', label: 'Saída' },
]

export function TransactionFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  categoryId,
  onCategoryChange,
  categoryOptions,
  period,
  onPeriodChange,
  periodOptions,
}: TransactionFiltersProps) {
  return (
    <section className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
      <TextField
        label="Buscar"
        icon={Search}
        type="search"
        placeholder="Buscar por descrição"
        value={search}
        maxLength={100}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <SelectField label="Tipo" value={type} onValueChange={onTypeChange} options={typeOptions} />
      <SelectField
        label="Categoria"
        value={categoryId}
        onValueChange={onCategoryChange}
        options={[{ value: ALL, label: 'Todas' }, ...categoryOptions]}
      />
      <SelectField
        label="Período"
        value={period}
        onValueChange={onPeriodChange}
        options={periodOptions}
      />
    </section>
  )
}
