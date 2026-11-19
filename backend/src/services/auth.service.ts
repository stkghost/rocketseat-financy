import { GraphQLError } from 'graphql'
import type { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import type { AuthOutput } from '../dtos/output/auth.output'
import { prisma } from '../lib/prisma'
import type { User } from '../generated/prisma/client'
import { comparePassword, hashPassword } from '../utils/hash'
import { signJwt } from '../utils/jwt'

export class AuthService {
  async register({ name, email, password }: RegisterInput): Promise<AuthOutput> {
    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      throw new GraphQLError('Este e-mail já está cadastrado', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: await hashPassword(password),
      },
    })

    return this.buildAuthOutput(user)
  }

  async login({ email, password }: LoginInput): Promise<AuthOutput> {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!user || !(await comparePassword(password, user.password))) {
      throw new GraphQLError('E-mail ou senha inválidos', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    return this.buildAuthOutput(user)
  }

  private buildAuthOutput({ password: _password, ...user }: User): AuthOutput {
    return {
      token: signJwt({ id: user.id, email: user.email }),
      user,
    }
  }
}
