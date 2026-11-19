import { CategoryBadge } from '@/components/CategoryBadge'
import { CategoryIconBox } from '@/components/CategoryIconBox'
import { CircleArrowDown, CircleArrowUp, Plus } from '@/components/icons'
import { formatCurrency, formatShortDate } from '@/lib/format'
import type { Transaction } from '@/types/finance'
import { DashboardPanel } from './DashboardPanel'

type RecentTransactionsProps = {
  transactions: Transaction[]
  loading?: boolean
  onNewTransaction: () => void
  className?: string
}

export function RecentTransactions({
  transactions,
  loading,
  onNewTransaction,
  className,
}: RecentTransactionsProps) {
  return (
    <DashboardPanel
      title="Transações recentes"
      linkLabel="Ver todas"
      linkTo="/transactions"
      className={className}
    >
      {transactions.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-gray-500">
          {loading ? 'Carregando transações...' : 'Nenhuma transação registrada ainda.'}
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onNewTransaction}
        className="flex h-15 items-center justify-center gap-2 border-t border-gray-200 text-sm font-medium text-brand-base outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
      >
        <Plus aria-hidden className="size-4" />
        Nova transação
      </button>
    </DashboardPanel>
  )
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const { description, date, amount, type, category } = transaction
  const isIncome = type === 'income'
  const DirectionIcon = isIncome ? CircleArrowUp : CircleArrowDown

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_9rem_8rem] items-center gap-4 px-6 py-4">
      <div className="flex min-w-0 items-center gap-4">
        <CategoryIconBox icon={category.icon} color={category.color} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-gray-800">{description}</p>
          <p className="text-sm text-gray-600">{formatShortDate(date)}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <CategoryBadge name={category.title} color={category.color} />
      </div>
      <p className="flex items-center justify-end gap-2 text-sm font-semibold text-gray-800">
        {isIncome ? '+' : '-'} {formatCurrency(amount)}
        <DirectionIcon
          aria-label={isIncome ? 'Receita' : 'Despesa'}
          className={isIncome ? 'size-4 text-brand-base' : 'size-4 text-red-base'}
        />
      </p>
    </li>
  )
}
