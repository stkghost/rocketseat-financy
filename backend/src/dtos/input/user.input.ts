import { IsNotEmpty } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdateProfileInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe seu nome completo' })
  name!: string
}
