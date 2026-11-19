import { IsDate, IsIn, IsNotEmpty, IsOptional, IsPositive, Max, MaxLength, Min } from 'class-validator'
import { Field, Float, GraphQLISODateTime, ID, InputType, Int } from 'type-graphql'
import { TransactionType } from '../../models/transaction.model'

const MAX_AMOUNT = 999_999_999.99

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe uma descrição' })
  @MaxLength(100, { message: 'A descrição deve ter no máximo 100 caracteres' })
  description!: string

  @Field(() => Float)
  @IsPositive({ message: 'Informe um valor maior que zero' })
  @Max(MAX_AMOUNT, { message: 'Valor acima do permitido' })
  amount!: number

  @Field(() => TransactionType)
  @IsIn(Object.values(TransactionType), { message: 'Tipo inválido' })
  type!: TransactionType

  @Field(() => GraphQLISODateTime)
  @IsDate({ message: 'Informe uma data válida' })
  date!: Date

  @Field(() => ID)
  @IsNotEmpty({ message: 'Selecione uma categoria' })
  categoryId!: string
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Informe uma descrição' })
  @MaxLength(100, { message: 'A descrição deve ter no máximo 100 caracteres' })
  description?: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsPositive({ message: 'Informe um valor maior que zero' })
  @Max(MAX_AMOUNT, { message: 'Valor acima do permitido' })
  amount?: number

  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(TransactionType), { message: 'Tipo inválido' })
  type?: TransactionType

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate({ message: 'Informe uma data válida' })
  date?: Date

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Selecione uma categoria' })
  categoryId?: string
}

@InputType()
export class TransactionFiltersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100, { message: 'A busca deve ter no máximo 100 caracteres' })
  search?: string | null

  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(TransactionType), { message: 'Tipo inválido' })
  type?: TransactionType | null

  @Field(() => ID, { nullable: true })
  @IsOptional()
  categoryId?: string | null

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1900, { message: 'Ano inválido' })
  @Max(9999, { message: 'Ano inválido' })
  year?: number | null

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1, { message: 'Mês inválido' })
  @Max(12, { message: 'Mês inválido' })
  month?: number | null
}
