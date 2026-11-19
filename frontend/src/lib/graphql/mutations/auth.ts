import { gql, type TypedDocumentNode } from '@apollo/client'
import type { User } from '@/stores/auth'

export type AuthPayload = {
  token: string
  user: User
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}

export const LOGIN: TypedDocumentNode<
  { login: AuthPayload },
  { data: LoginInput }
> = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export const REGISTER: TypedDocumentNode<
  { register: AuthPayload },
  { data: RegisterInput }
> = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`
