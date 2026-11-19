import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Category, CategoryColor, CategoryIcon } from '@/types/finance'

export type CategoryInput = {
  title: string
  description?: string | null
  icon: CategoryIcon
  color: CategoryColor
}

const CATEGORY_FIELDS = gql`
  fragment CategoryFields on CategoryModel {
    id
    title
    description
    icon
    color
    transactionsCount
    totalAmount
  }
`

export const CREATE_CATEGORY: TypedDocumentNode<
  { createCategory: Category },
  { data: CategoryInput }
> = gql`
  ${CATEGORY_FIELDS}
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      ...CategoryFields
    }
  }
`

export const UPDATE_CATEGORY: TypedDocumentNode<
  { updateCategory: Category },
  { id: string; data: Partial<CategoryInput> }
> = gql`
  ${CATEGORY_FIELDS}
  mutation UpdateCategory($id: ID!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      ...CategoryFields
    }
  }
`

export const DELETE_CATEGORY: TypedDocumentNode<{ deleteCategory: boolean }, { id: string }> = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`
