import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe seu nome completo' })
  name!: string

  @Field(() => String)
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email!: string

  @Field(() => String)
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Informe sua senha' })
  password!: string
}
