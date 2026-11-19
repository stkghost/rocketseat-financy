import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { UpdateProfileInput } from '../dtos/input/user.input'
import { CurrentUserId } from '../graphql/decorators/user.decorator'
import { IsAuth } from '../middlewares/auth.middleware'
import { UserModel } from '../models/user.model'
import { UserService } from '../services/user.service'

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
  private userService = new UserService()

  @Query(() => UserModel)
  async me(@CurrentUserId() userId: string): Promise<UserModel> {
    return this.userService.findById(userId)
  }

  @Mutation(() => UserModel)
  async updateProfile(
    @CurrentUserId() userId: string,
    @Arg('data', () => UpdateProfileInput) data: UpdateProfileInput
  ): Promise<UserModel> {
    return this.userService.updateProfile(userId, data)
  }
}
