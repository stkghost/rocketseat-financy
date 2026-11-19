import {
  Arg,
  FieldResolver,
  Float,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'
import { CurrentUserId } from '../graphql/decorators/user.decorator'
import { IsAuth } from '../middlewares/auth.middleware'
import { CategoryModel } from '../models/category.model'
import { CategoryService } from '../services/category.service'

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()

  @Query(() => [CategoryModel])
  async categories(@CurrentUserId() userId: string): Promise<CategoryModel[]> {
    return this.categoryService.list(userId)
  }

  @Query(() => CategoryModel)
  async category(
    @CurrentUserId() userId: string,
    @Arg('id', () => ID) id: string
  ): Promise<CategoryModel> {
    return this.categoryService.findOwned(id, userId)
  }

  @Mutation(() => CategoryModel)
  async createCategory(
    @CurrentUserId() userId: string,
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput
  ): Promise<CategoryModel> {
    return this.categoryService.create(userId, data)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @CurrentUserId() userId: string,
    @Arg('id', () => ID) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput
  ): Promise<CategoryModel> {
    return this.categoryService.update(id, userId, data)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @CurrentUserId() userId: string,
    @Arg('id', () => ID) id: string
  ): Promise<boolean> {
    return this.categoryService.delete(id, userId)
  }

  @FieldResolver(() => Int)
  async transactionsCount(@Root() category: CategoryModel): Promise<number> {
    return this.categoryService.countTransactions(category.id)
  }

  @FieldResolver(() => Float)
  async totalAmount(@Root() category: CategoryModel): Promise<number> {
    return this.categoryService.totalAmount(category.id)
  }
}
