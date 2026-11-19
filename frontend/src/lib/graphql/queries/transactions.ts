import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Transaction, TransactionFilters, TransactionsSummary } from '@/types/finance'

export const TRANSACTION_DEPENDENT_QUERIES = [
  'Transactions',
  'TransactionsPage',
  'TransactionMonths',
  'TransactionsSummary',
  'Categories',
]

const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on TransactionModel {
    id
    description
    amount
    type
    date
    category {
      id
      title
      icon
      color
    }
  }
`

export const TRANSACTIONS: TypedDocumentNode<
  { transactions: Transaction[] },
  { limit?: number }
> = gql`
  ${TRANSACTION_FIELDS}
  query Transactions($limit: Int) {
    transactions(limit: $limit) {
      ...TransactionFields
    }
  }
`

export type TransactionsPage = {
  items: Transaction[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export const TRANSACTIONS_PAGE: TypedDocumentNode<
  { transactionsPage: TransactionsPage },
  { filters: TransactionFilters; page: number; perPage: number }
> = gql`
  ${TRANSACTION_FIELDS}
  query TransactionsPage($filters: TransactionFiltersInput, $page: Int, $perPage: Int) {
    transactionsPage(filters: $filters, page: $page, perPage: $perPage) {
      total
      page
      perPage
      totalPages
      items {
        ...TransactionFields
      }
    }
  }
`

export const TRANSACTION_MONTHS: TypedDocumentNode<{ transactionMonths: string[] }> = gql`
  query TransactionMonths {
    transactionMonths
  }
`

export const TRANSACTIONS_SUMMARY: TypedDocumentNode<
  { transactionsSummary: TransactionsSummary },
  { year: number; month: number }
> = gql`
  query TransactionsSummary($year: Int, $month: Int) {
    transactionsSummary(year: $year, month: $month) {
      balance
      monthIncome
      monthExpense
    }
  }
`
