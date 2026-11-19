import { IsIn, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/category-options'

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe o título da categoria' })
  @MaxLength(50, { message: 'O título deve ter no máximo 50 caracteres' })
  title!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(200, { message: 'A descrição deve ter no máximo 200 caracteres' })
  description?: string | null

  @Field(() => String)
  @IsIn(CATEGORY_ICONS, { message: 'Ícone inválido' })
  icon!: string

  @Field(() => String)
  @IsIn(CATEGORY_COLORS, { message: 'Cor inválida' })
  color!: string
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Informe o título da categoria' })
  @MaxLength(50, { message: 'O título deve ter no máximo 50 caracteres' })
  title?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(200, { message: 'A descrição deve ter no máximo 200 caracteres' })
  description?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(CATEGORY_ICONS, { message: 'Ícone inválido' })
  icon?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(CATEGORY_COLORS, { message: 'Cor inválida' })
  color?: string
}
