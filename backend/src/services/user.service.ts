import { GraphQLError } from 'graphql'
import type { UpdateProfileInput } from '../dtos/input/user.input'
import { prisma } from '../lib/prisma'

export class UserService {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    })

    if (!user) {
      throw new GraphQLError('Usuário não encontrado', {
        extensions: { code: 'NOT_FOUND' },
      })
    }

    return user
  }

  async updateProfile(id: string, { name }: UpdateProfileInput) {
    const trimmedName = name.trim()

    if (!trimmedName) {
      throw new GraphQLError('Informe seu nome completo', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    await this.findById(id)

    return prisma.user.update({
      where: { id },
      data: { name: trimmedName },
      omit: { password: true },
    })
  }
}
