import { GraphQLError } from 'graphql'
import type {
  CreateTransactionInput,
  TransactionFiltersInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import type { Prisma, Transaction } from '../generated/prisma/client'
import { prisma } from '../lib/prisma'
import { TransactionType, type TransactionModel } from '../models/transaction.model'
import { CategoryService } from './category.service'

const toCents = (amount: number) => Math.round(amount * 100)

function toModel({ amount, type, ...transaction }: Transaction): TransactionModel {
  return {
    ...transaction,
    amount: amount / 100,
    type: type as TransactionType,
  }
}

export class TransactionService {
  private categoryService = new CategoryService()

  async list(userId: string, limit?: number | null) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: limit ?? undefined,
    })

    return transactions.map(toModel)
  }

  async paginate(
    userId: string,
    filters: TransactionFiltersInput = {},
    page = 1,
    perPage = 10
  ) {
    const safePerPage = Math.min(Math.max(perPage, 1), 100)
    const where = this.buildWhere(userId, filters)
    const total = await prisma.transaction.count({ where })
    const totalPages = Math.max(Math.ceil(total / safePerPage), 1)
    const currentPage = Math.min(Math.max(page, 1), totalPages)

    const items = await prisma.transaction.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: (currentPage - 1) * safePerPage,
      take: safePerPage,
    })

    return {
      items: items.map(toModel),
      total,
      page: currentPage,
      perPage: safePerPage,
      totalPages,
    }
  }

  async months(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'desc' },
    })

    const months = transactions.map(({ date }) => date.toISOString().slice(0, 7))
    return [...new Set(months)]
  }

  private buildWhere(userId: string, filters: TransactionFiltersInput) {
    const where: Prisma.TransactionWhereInput = { userId }
    const search = filters.search?.trim()

    if (search) where.description = { contains: search }
    if (filters.type) where.type = filters.type
    if (filters.categoryId) where.categoryId = filters.categoryId

    if (filters.year) {
      const start = filters.month
        ? new Date(Date.UTC(filters.year, filters.month - 1, 1))
        : new Date(Date.UTC(filters.year, 0, 1))
      const end = filters.month
        ? new Date(Date.UTC(filters.year, filters.month, 1))
        : new Date(Date.UTC(filters.year + 1, 0, 1))
      where.date = { gte: start, lt: end }
    }

    return where
  }

  async summary(userId: string, year?: number | null, month?: number | null) {
    const now = new Date()
    const targetYear = year ?? now.getUTCFullYear()
    const targetMonth = month ?? now.getUTCMonth() + 1

    if (targetMonth < 1 || targetMonth > 12) {
      throw new GraphQLError('Mês inválido', { extensions: { code: 'BAD_USER_INPUT' } })
    }

    const monthStart = new Date(Date.UTC(targetYear, targetMonth - 1, 1))
    const nextMonthStart = new Date(Date.UTC(targetYear, targetMonth, 1))

    const [totals, monthTotals] = await Promise.all([
      prisma.transaction.groupBy({
        by: ['type'],
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ['type'],
        where: { userId, date: { gte: monthStart, lt: nextMonthStart } },
        _sum: { amount: true },
      }),
    ])

    const sumOf = (groups: typeof totals, type: TransactionType) =>
      (groups.find((group) => group.type === type)?._sum.amount ?? 0) / 100

    return {
      balance: sumOf(totals, TransactionType.income) - sumOf(totals, TransactionType.expense),
      monthIncome: sumOf(monthTotals, TransactionType.income),
      monthExpense: sumOf(monthTotals, TransactionType.expense),
    }
  }

  async findOwned(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({ where: { id, userId } })

    if (!transaction) {
      throw new GraphQLError('Transação não encontrada', {
        extensions: { code: 'NOT_FOUND' },
      })
    }

    return toModel(transaction)
  }

  async create(userId: string, data: CreateTransactionInput) {
    const description = this.requireDescription(data.description)
    await this.categoryService.findOwned(data.categoryId, userId)

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: toCents(data.amount),
        type: data.type,
        date: data.date,
        categoryId: data.categoryId,
        userId,
      },
    })

    return toModel(transaction)
  }

  async update(id: string, userId: string, data: UpdateTransactionInput) {
    await this.findOwned(id, userId)

    if (data.categoryId) {
      await this.categoryService.findOwned(data.categoryId, userId)
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        description:
          data.description === undefined ? undefined : this.requireDescription(data.description),
        amount: data.amount == null ? undefined : toCents(data.amount),
        type: data.type ?? undefined,
        date: data.date ?? undefined,
        categoryId: data.categoryId ?? undefined,
      },
    })

    return toModel(transaction)
  }

  async delete(id: string, userId: string) {
    await this.findOwned(id, userId)
    await prisma.transaction.delete({ where: { id } })
    return true
  }

  private requireDescription(description: string) {
    const trimmed = description.trim()

    if (!trimmed) {
      throw new GraphQLError('Informe uma descrição', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    return trimmed
  }
}
