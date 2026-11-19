import { CategoryBadge } from '@/components/CategoryBadge'
import { formatCurrency } from '@/lib/format'
import type { Category } from '@/types/finance'
import { DashboardPanel } from './DashboardPanel'

type CategoriesOverviewProps = {
  categories: Category[]
  loading?: boolean
  className?: string
}

export function CategoriesOverview({ categories, loading, className }: CategoriesOverviewProps) {
  return (
    <DashboardPanel
      title="Categorias"
      linkLabel="Gerenciar"
      linkTo="/categories"
      className={className}
    >
      {categories.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-gray-500">
          {loading ? 'Carregando categorias...' : 'Nenhuma categoria criada ainda.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-5 p-6">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-4">
              <CategoryBadge name={category.title} color={category.color} className="mr-auto" />
              <span className="text-sm text-gray-600">
                {category.transactionsCount ?? 0}{' '}
                {category.transactionsCount === 1 ? 'item' : 'itens'}
              </span>
              <span className="w-24 text-right text-sm font-semibold text-gray-800">
                {formatCurrency(category.totalAmount ?? 0)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  )
}
