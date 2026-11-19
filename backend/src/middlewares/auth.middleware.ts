import { GraphQLError } from 'graphql'
import type { MiddlewareFn } from 'type-graphql'
import type { GraphqlContext } from '../graphql/context'

export const IsAuth: MiddlewareFn<GraphqlContext> = ({ context }, next) => {
  if (!context.userId) {
    throw new GraphQLError('Usuário não autenticado', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }
  return next()
}
