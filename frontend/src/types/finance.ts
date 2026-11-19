export type CategoryColor = 'green' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow'

export type CategoryIcon =
  | 'briefcase'
  | 'car'
  | 'heart-pulse'
  | 'piggy-bank'
  | 'shopping-cart'
  | 'ticket'
  | 'tool-case'
  | 'utensils'
  | 'paw-print'
  | 'house'
  | 'gift'
  | 'dumbbell'
  | 'book-open'
  | 'baggage-claim'
  | 'mailbox'
  | 'receipt'

export type Category = {
  id: string
  title: string
  description?: string | null
  color: CategoryColor
  icon: CategoryIcon
  transactionsCount?: number
  totalAmount?: number
}

export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: string
  category: Category
}

export type TransactionsSummary = {
  balance: number
  monthIncome: number
  monthExpense: number
}

export type TransactionFilters = {
  search?: string | null
  type?: TransactionType | null
  categoryId?: string | null
  year?: number | null
  month?: number | null
}
