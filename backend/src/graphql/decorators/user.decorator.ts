import { createParameterDecorator, type ResolverData } from 'type-graphql'
import type { GraphqlContext } from '../context'

export function CurrentUserId() {
  return createParameterDecorator(
    ({ context }: ResolverData<GraphqlContext>) => context.userId
  )
}
