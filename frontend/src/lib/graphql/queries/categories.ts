import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Category } from '@/types/finance'

export const CATEGORIES: TypedDocumentNode<{ categories: Category[] }> = gql`
  query Categories {
    categories {
      id
      title
      description
      icon
      color
      transactionsCount
    totalAmount
    }
  }
`
