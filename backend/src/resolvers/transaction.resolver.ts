import {
  Arg,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import {
  CreateTransactionInput,
  TransactionFiltersInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { CurrentUserId } from '../graphql/decorators/user.decorator'
import { IsAuth } from '../middlewares/auth.middleware'
import { CategoryModel } from '../models/category.model'
import { TransactionModel } from '../models/transaction.model'
import { TransactionsPageModel } from '../models/transactions-page.model'
import { TransactionsSummaryModel } from '../models/transactions-summary.model'
import { CategoryService } from '../services/category.service'
import { TransactionService } from '../services/transaction.service'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()
  private categoryService = new CategoryService()

  @Query(() => [TransactionModel])
  async transactions(
    @CurrentUserId() userId: string,
    @Arg('limit', () => Int, { nullable: true }) limit?: number | null
  ): Promise<TransactionModel[]> {
    return this.transactionService.list(userId, limit)
  }

  @Query(() => TransactionsPageModel)
  async transactionsPage(
    @CurrentUserId() userId: string,
    @Arg('filters', () => TransactionFiltersInput, { nullable: true })
    filters?: TransactionFiltersInput | null,
    @Arg('page', () => Int, { nullable: true }) page?: number | null,
    @Arg('perPage', () => Int, { nullable: true }) perPage?: number | null
  ): Promise<TransactionsPageModel> {
    return this.transactionService.paginate(userId, filters ?? {}, page ?? 1, perPage ?? 10)
  }

  @Query(() => [String])
  async transactionMonths(@CurrentUserId() userId: string): Promise<string[]> {
    return this.transactionService.months(userId)
  }

  @Query(() => TransactionsSummaryModel)
  async transactionsSummary(
    @CurrentUserId() userId: string,
    @Arg('year', () => Int, { nullable: true }) year?: number | null,
    @Arg('month', () => Int, { nullable: true }) month?: number | null
  ): Promise<TransactionsSummaryModel> {
    return this.transactionService.summary(userId, year, month)
  }

  @Query(() => TransactionModel)
  async transaction(
    @CurrentUserId() userId: string,
    @Arg('id', () => ID) id: string
  ): Promise<TransactionModel> {
    return this.transactionService.findOwned(id, userId)
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @CurrentUserId() userId: string,
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput
  ): Promise<TransactionModel> {
    return this.transactionService.create(userId, data)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @CurrentUserId() userId: string,
    @Arg('id', () => ID) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput
  ): Promise<TransactionModel> {
    return this.transactionService.update(id, userId, data)
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @CurrentUserId() userId: string,
    @Arg('id', () => ID) id: string
  ): Promise<boolean> {
    return this.transactionService.delete(id, userId)
  }

  @FieldResolver(() => CategoryModel)
  async category(
    @Root() transaction: TransactionModel,
    @CurrentUserId() userId: string
  ): Promise<CategoryModel> {
    return this.categoryService.findOwned(transaction.categoryId, userId)
  }
}
