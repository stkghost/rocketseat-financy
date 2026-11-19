import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { CategoriesOverview } from '@/components/dashboard/CategoriesOverview'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { CircleArrowDown, CircleArrowUp, Wallet } from '@/components/icons'
import { TransactionDialog } from '@/components/transactions/TransactionDialog'
import { CATEGORIES } from '@/lib/graphql/queries/categories'
import { TRANSACTIONS, TRANSACTIONS_SUMMARY } from '@/lib/graphql/queries/transactions'

const RECENT_TRANSACTIONS_LIMIT = 5
const CATEGORIES_OVERVIEW_LIMIT = 5

export function Dashboard() {
  const [newTransactionOpen, setNewTransactionOpen] = useState(false)
  const [today] = useState(() => new Date())

  const { data: summaryData } = useQuery(TRANSACTIONS_SUMMARY, {
    variables: { year: today.getFullYear(), month: today.getMonth() + 1 },
    fetchPolicy: 'cache-and-network',
  })
  const { data: transactionsData, loading: transactionsLoading } = useQuery(TRANSACTIONS, {
    variables: { limit: RECENT_TRANSACTIONS_LIMIT },
    fetchPolicy: 'cache-and-network',
  })
  const { data: categoriesData, loading: categoriesLoading } = useQuery(CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  })

  const summary = summaryData?.transactionsSummary
  const topCategories = useMemo(
    () =>
      [...(categoriesData?.categories ?? [])]
        .sort(
          (first, second) =>
            (second.transactionsCount ?? 0) - (first.transactionsCount ?? 0) ||
            first.title.localeCompare(second.title, 'pt-BR')
        )
        .slice(0, CATEGORIES_OVERVIEW_LIMIT),
    [categoriesData]
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <SummaryCard
        label="Saldo total"
        value={summary?.balance ?? 0}
        icon={Wallet}
        iconClassName="text-purple-base"
      />
      <SummaryCard
        label="Receitas do mês"
        value={summary?.monthIncome ?? 0}
        icon={CircleArrowUp}
        iconClassName="text-brand-base"
      />
      <SummaryCard
        label="Despesas do mês"
        value={summary?.monthExpense ?? 0}
        icon={CircleArrowDown}
        iconClassName="text-red-base"
      />

      <RecentTransactions
        className="self-start lg:col-span-2"
        transactions={transactionsData?.transactions ?? []}
        loading={transactionsLoading && !transactionsData}
        onNewTransaction={() => setNewTransactionOpen(true)}
      />
      <CategoriesOverview
        className="self-start"
        categories={topCategories}
        loading={categoriesLoading && !categoriesData}
      />

      <TransactionDialog open={newTransactionOpen} onOpenChange={setNewTransactionOpen} />
    </div>
  )
}
