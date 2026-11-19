import { gql, type TypedDocumentNode } from '@apollo/client'
import type { User } from '@/stores/auth'

export type UpdateProfileInput = {
  name: string
}

export const UPDATE_PROFILE: TypedDocumentNode<
  { updateProfile: User },
  { data: UpdateProfileInput }
> = gql`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      id
      name
      email
    }
  }
`
