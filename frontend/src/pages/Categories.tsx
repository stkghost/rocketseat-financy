import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { CategoryDialog } from '@/components/categories/CategoryDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ArrowUpDown, Plus, Tag } from '@/components/icons'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/button'
import { categoryColorClasses, categoryIcons } from '@/lib/category-styles'
import { getErrorMessage } from '@/lib/graphql/errors'
import { DELETE_CATEGORY } from '@/lib/graphql/mutations/categories'
import { CATEGORIES } from '@/lib/graphql/queries/categories'
import type { Category } from '@/types/finance'

export function Categories() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const { data, loading } = useQuery(CATEGORIES, { fetchPolicy: 'cache-and-network' })
  const categories = useMemo(() => data?.categories ?? [], [data])

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    update(cache, _result, { variables }) {
      if (!variables) return
      cache.evict({ id: cache.identify({ __typename: 'CategoryModel', id: variables.id }) })
      cache.gc()
    },
  })

  const totalTransactions = categories.reduce(
    (total, category) => total + (category.transactionsCount ?? 0),
    0
  )

  const mostUsed = useMemo(
    () =>
      categories.reduce<Category | null>((best, category) => {
        const count = category.transactionsCount ?? 0
        if (count === 0) return best
        return !best || count > (best.transactionsCount ?? 0) ? category : best
      }, null),
    [categories]
  )

  function openCreate() {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  function openEdit(category: Category) {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  async function confirmDelete() {
    if (!deletingCategory) return

    try {
      await deleteCategory({ variables: { id: deletingCategory.id } })
      toast.success('Categoria excluída com sucesso!')
      setDeletingCategory(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível excluir a categoria'))
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-600">Organize suas transações por categorias</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus />
          Nova categoria
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon={Tag} value={categories.length} label="Total de categorias" />
        <StatCard
          icon={ArrowUpDown}
          iconClassName="text-purple-base"
          value={totalTransactions}
          label="Total de transações"
        />
        <StatCard
          icon={mostUsed ? categoryIcons[mostUsed.icon].icon : Tag}
          iconClassName={mostUsed ? categoryColorClasses[mostUsed.color].text : 'text-gray-400'}
          value={mostUsed?.title ?? '—'}
          label="Categoria mais utilizada"
        />
      </div>

      {categories.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          {loading ? 'Carregando categorias...' : 'Nenhuma categoria criada ainda.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={openEdit}
              onDelete={setDeletingCategory}
            />
          ))}
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />

      <ConfirmDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir a categoria "${deletingCategory?.title ?? ''}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
