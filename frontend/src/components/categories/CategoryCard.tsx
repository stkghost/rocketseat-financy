import { CategoryBadge } from '@/components/CategoryBadge'
import { CategoryIconBox } from '@/components/CategoryIconBox'
import { SquarePen, Trash } from '@/components/icons'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types/finance'

type CategoryCardProps = {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const count = category.transactionsCount ?? 0

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <CategoryIconBox icon={category.icon} color={category.color} />
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline-danger"
            aria-label={`Excluir ${category.title}`}
            onClick={() => onDelete(category)}
          >
            <Trash />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label={`Editar ${category.title}`}
            onClick={() => onEdit(category)}
          >
            <SquarePen />
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1">
        <h3 className="truncate font-semibold text-gray-800">{category.title}</h3>
        {category.description && (
          <p className="line-clamp-2 text-sm text-gray-600">{category.description}</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
        <CategoryBadge name={category.title} color={category.color} className="min-w-0 truncate" />
        <span className="shrink-0 text-sm text-gray-600">
          {count} {count === 1 ? 'item' : 'itens'}
        </span>
      </div>
    </article>
  )
}
