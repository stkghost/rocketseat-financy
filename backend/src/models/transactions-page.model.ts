import { Field, Int, ObjectType } from 'type-graphql'
import { TransactionModel } from './transaction.model'

@ObjectType()
export class TransactionsPageModel {
  @Field(() => [TransactionModel])
  items!: TransactionModel[]

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  perPage!: number

  @Field(() => Int)
  totalPages!: number
}
