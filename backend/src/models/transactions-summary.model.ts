import { Field, Float, ObjectType } from 'type-graphql'

@ObjectType()
export class TransactionsSummaryModel {
  @Field(() => Float)
  balance!: number

  @Field(() => Float)
  monthIncome!: number

  @Field(() => Float)
  monthExpense!: number
}
