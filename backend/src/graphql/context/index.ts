import type { ExpressContextFunctionArgument } from '@as-integrations/express5'
import { verifyJwt } from '../../utils/jwt'

export type GraphqlContext = {
  userId?: string
  req: ExpressContextFunctionArgument['req']
  res: ExpressContextFunctionArgument['res']
}

export async function buildContext({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> {
  const authHeader = req.headers.authorization ?? ''
  let userId: string | undefined

  if (authHeader.startsWith('Bearer ')) {
    try {
      userId = verifyJwt(authHeader.slice('Bearer '.length)).id
    } catch {
      userId = undefined
    }
  }

  return { userId, req, res }
}
