import jwt from 'jsonwebtoken'

export type JwtPayload = {
  id: string
  email: string
}

const EXPIRES_IN = '7d'

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return secret
}

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: EXPIRES_IN })
}

export function verifyJwt(token: string) {
  return jwt.verify(token, getSecret()) as JwtPayload
}
