import { GraphQLError } from 'graphql'
import type { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { prisma } from '../lib/prisma'

function normalizeDescription(description?: string | null) {
  const trimmed = description?.trim()
  return trimmed ? trimmed : null
}

export class CategoryService {
  async list(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { title: 'asc' },
    })
  }

  async countTransactions(categoryId: string) {
    return prisma.transaction.count({ where: { categoryId } })
  }

  async totalAmount(categoryId: string) {
    const result = await prisma.transaction.aggregate({
      where: { categoryId },
      _sum: { amount: true },
    })
    return (result._sum.amount ?? 0) / 100
  }

  async findOwned(id: string, userId: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } })

    if (!category) {
      throw new GraphQLError('Categoria não encontrada', {
        extensions: { code: 'NOT_FOUND' },
      })
    }

    return category
  }

  async create(userId: string, data: CreateCategoryInput) {
    const title = data.title.trim()
    await this.ensureTitleAvailable(userId, title)

    return prisma.category.create({
      data: {
        title,
        description: normalizeDescription(data.description),
        icon: data.icon,
        color: data.color,
        userId,
      },
    })
  }

  async update(id: string, userId: string, data: UpdateCategoryInput) {
    const category = await this.findOwned(id, userId)
    const title = data.title?.trim()

    if (title && title !== category.title) {
      await this.ensureTitleAvailable(userId, title, id)
    }

    return prisma.category.update({
      where: { id },
      data: {
        title: title || undefined,
        description:
          data.description === undefined ? undefined : normalizeDescription(data.description),
        icon: data.icon ?? undefined,
        color: data.color ?? undefined,
      },
    })
  }

  async delete(id: string, userId: string) {
    await this.findOwned(id, userId)

    const transactionsCount = await this.countTransactions(id)
    if (transactionsCount > 0) {
      throw new GraphQLError(
        'Esta categoria possui transações. Remova ou altere as transações antes de excluí-la',
        { extensions: { code: 'BAD_USER_INPUT' } }
      )
    }

    await prisma.category.delete({ where: { id } })
    return true
  }

  private async ensureTitleAvailable(userId: string, title: string, ignoreId?: string) {
    if (!title) {
      throw new GraphQLError('Informe o título da categoria', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const existing = await prisma.category.findFirst({
      where: { userId, title, NOT: ignoreId ? { id: ignoreId } : undefined },
    })

    if (existing) {
      throw new GraphQLError('Já existe uma categoria com este título', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }
  }
}
