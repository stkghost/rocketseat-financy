import { gql, type TypedDocumentNode } from '@apollo/client'
import type { TransactionType } from '@/types/finance'

export type TransactionInput = {
  description: string
  amount: number
  type: TransactionType
  date: string
  categoryId: string
}

export const CREATE_TRANSACTION: TypedDocumentNode<
  { createTransaction: { id: string } },
  { data: TransactionInput }
> = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      id
    }
  }
`

export const UPDATE_TRANSACTION: TypedDocumentNode<
  { updateTransaction: { id: string } },
  { id: string; data: Partial<TransactionInput> }
> = gql`
  mutation UpdateTransaction($id: ID!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      id
    }
  }
`

export const DELETE_TRANSACTION: TypedDocumentNode<
  { deleteTransaction: boolean },
  { id: string }
> = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
