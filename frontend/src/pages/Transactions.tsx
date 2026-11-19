import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Plus } from '@/components/icons'
import { Pagination } from '@/components/Pagination'
import { TransactionDialog } from '@/components/transactions/TransactionDialog'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/graphql/errors'
import { DELETE_TRANSACTION } from '@/lib/graphql/mutations/transactions'
import { CATEGORIES } from '@/lib/graphql/queries/categories'
import {
  TRANSACTION_DEPENDENT_QUERIES,
  TRANSACTION_MONTHS,
  TRANSACTIONS_PAGE,
} from '@/lib/graphql/queries/transactions'
import { ALL, buildPeriodOptions, parsePeriodValue, toPeriodValue } from '@/lib/transaction-filters'
import type { Transaction, TransactionType } from '@/types/finance'

const PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 300

export function Transactions() {
  const [currentPeriod] = useState(() => toPeriodValue(new Date()))
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState(ALL)
  const [categoryId, setCategoryId] = useState(ALL)
  const [period, setPeriod] = useState(currentPeriod)
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const filters = useMemo(
    () => ({
      search: search || null,
      type: type === ALL ? null : (type as TransactionType),
      categoryId: categoryId === ALL ? null : categoryId,
      ...parsePeriodValue(period),
    }),
    [search, type, categoryId, period]
  )

  const { data, loading } = useQuery(TRANSACTIONS_PAGE, {
    variables: { filters, page, perPage: PER_PAGE },
    fetchPolicy: 'cache-and-network',
  })
  const { data: categoriesData } = useQuery(CATEGORIES, { fetchPolicy: 'cache-and-network' })
  const { data: monthsData } = useQuery(TRANSACTION_MONTHS, { fetchPolicy: 'cache-and-network' })

  const [deleteTransaction, { loading: deleting }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: TRANSACTION_DEPENDENT_QUERIES,
  })

  const result = data?.transactionsPage
  const transactions = result?.items ?? []

  const categoryOptions = useMemo(
    () =>
      (categoriesData?.categories ?? []).map((category) => ({
        value: category.id,
        label: category.title,
      })),
    [categoriesData]
  )

  const periodOptions = useMemo(
    () => buildPeriodOptions(monthsData?.transactionMonths ?? [], currentPeriod),
    [monthsData, currentPeriod]
  )

  function changeFilter(setter: (value: string) => void) {
    return (value: string) => {
      setter(value)
      setPage(1)
    }
  }

  function openCreate() {
    setEditingTransaction(null)
    setDialogOpen(true)
  }

  function openEdit(transaction: Transaction) {
    setEditingTransaction(transaction)
    setDialogOpen(true)
  }

  async function confirmDelete() {
    if (!deletingTransaction) return

    try {
      await deleteTransaction({ variables: { id: deletingTransaction.id } })
      toast.success('Transação excluída com sucesso!')
      setDeletingTransaction(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível excluir a transação'))
    }
  }

  const total = result?.total ?? 0
  const firstItem = total === 0 ? 0 : (result!.page - 1) * result!.perPage + 1
  const lastItem = total === 0 ? 0 : firstItem + transactions.length - 1
  const hasFilters = !!search || type !== ALL || categoryId !== ALL

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-gray-600">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus />
          Nova transação
        </Button>
      </header>

      <TransactionFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        type={type}
        onTypeChange={changeFilter(setType)}
        categoryId={categoryId}
        onCategoryChange={changeFilter(setCategoryId)}
        categoryOptions={categoryOptions}
        period={period}
        onPeriodChange={changeFilter(setPeriod)}
        periodOptions={periodOptions}
      />

      <TransactionsTable
        transactions={transactions}
        emptyMessage={
          loading && !data
            ? 'Carregando transações...'
            : hasFilters || period !== ALL
              ? 'Nenhuma transação encontrada para os filtros selecionados.'
              : 'Nenhuma transação registrada ainda.'
        }
        onEdit={openEdit}
        onDelete={setDeletingTransaction}
        footer={
          total > 0 && result ? (
            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 px-6 py-5">
              <p className="text-sm text-gray-700">
                {firstItem} a {lastItem} <span className="px-1 text-gray-300">|</span> {total}{' '}
                {total === 1 ? 'resultado' : 'resultados'}
              </p>
              <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
            </footer>
          ) : null
        }
      />

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editingTransaction}
      />

      <ConfirmDialog
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir a transação "${deletingTransaction?.description ?? ''}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
