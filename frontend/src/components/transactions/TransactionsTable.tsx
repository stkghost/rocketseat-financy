import type { ReactNode } from 'react'
import { CategoryBadge } from '@/components/CategoryBadge'
import { CategoryIconBox } from '@/components/CategoryIconBox'
import { CircleArrowDown, CircleArrowUp, SquarePen, Trash } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types/finance'

type TransactionsTableProps = {
  transactions: Transaction[]
  emptyMessage: string
  footer?: ReactNode
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

const headerCell = 'py-5 text-xs font-medium tracking-wider text-gray-500 uppercase'

export function TransactionsTable({
  transactions,
  emptyMessage,
  footer,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] table-fixed">
          <colgroup>
            <col />
            <col className="w-30" />
            <col className="w-48" />
            <col className="w-35" />
            <col className="w-46" />
            <col className="w-34" />
          </colgroup>
          <thead className="border-b border-gray-200">
            <tr>
              <th className={cn(headerCell, 'pr-2 pl-6 text-left')}>Descrição</th>
              <th className={cn(headerCell, 'px-2 text-center')}>Data</th>
              <th className={cn(headerCell, 'px-2 text-center')}>Categoria</th>
              <th className={cn(headerCell, 'px-2 text-center')}>Tipo</th>
              <th className={cn(headerCell, 'px-2 text-right')}>Valor</th>
              <th className={cn(headerCell, 'pr-6 pl-2 text-right')}>Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer}
    </section>
  )
}

type TransactionRowProps = {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const { description, date, amount, type, category } = transaction
  const isIncome = type === 'income'
  const TypeIcon = isIncome ? CircleArrowUp : CircleArrowDown

  return (
    <tr>
      <td className="py-4 pr-2 pl-6">
        <div className="flex min-w-0 items-center gap-4">
          <CategoryIconBox icon={category.icon} color={category.color} />
          <span className="truncate text-gray-800">{description}</span>
        </div>
      </td>
      <td className="px-2 py-4 text-center text-sm text-gray-600">{formatShortDate(date)}</td>
      <td className="px-2 py-4 text-center">
        <CategoryBadge name={category.title} color={category.color} className="max-w-full truncate" />
      </td>
      <td className="px-2 py-4">
        <span
          className={cn(
            'flex items-center justify-center gap-2 text-sm',
            isIncome ? 'text-green-base' : 'text-red-base'
          )}
        >
          <TypeIcon aria-hidden className="size-4" />
          {isIncome ? 'Entrada' : 'Saída'}
        </span>
      </td>
      <td className="px-2 py-4 text-right text-sm font-semibold whitespace-nowrap text-gray-800">
        {isIncome ? '+' : '-'} {formatCurrency(amount)}
      </td>
      <td className="py-4 pr-6 pl-2">
        <div className="flex justify-end gap-2">
          <Button
            size="icon"
            variant="outline-danger"
            aria-label={`Excluir ${description}`}
            onClick={() => onDelete(transaction)}
          >
            <Trash />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label={`Editar ${description}`}
            onClick={() => onEdit(transaction)}
          >
            <SquarePen />
          </Button>
        </div>
      </td>
    </tr>
  )
}
