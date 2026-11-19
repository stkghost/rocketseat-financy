import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { PasswordField, TextField } from '@/components/form'
import { LogIn, Mail, UserRound } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/graphql/errors'
import { REGISTER } from '@/lib/graphql/mutations/auth'
import { useAuthStore } from '@/stores/auth'

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome completo'),
  email: z.string().trim().pipe(z.email('Informe um e-mail válido')),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type SignupForm = z.infer<typeof signupSchema>

export function Signup() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [register, { loading }] = useMutation(REGISTER)

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(data: SignupForm) {
    try {
      const { data: result } = await register({ variables: { data } })
      if (!result) return

      setAuth(result.register)
      toast.success('Conta criada com sucesso!')
      navigate('/')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível criar a conta'))
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-gray-200 bg-white p-8">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold text-gray-800">Criar conta</h1>
        <p className="text-gray-600">Comece a controlar suas finanças ainda hoje</p>
      </header>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <TextField
            label="Nome completo"
            icon={UserRound}
            placeholder="Seu nome completo"
            autoComplete="name"
            error={!!errors.name}
            helper={errors.name?.message}
            {...field('name')}
          />
          <TextField
            label="E-mail"
            icon={Mail}
            type="email"
            placeholder="mail@exemplo.com"
            autoComplete="email"
            error={!!errors.email}
            helper={errors.email?.message}
            {...field('email')}
          />
          <PasswordField
            label="Senha"
            placeholder="Digite sua senha"
            autoComplete="new-password"
            error={!!errors.password}
            helper={errors.password?.message ?? 'A senha deve ter no mínimo 8 caracteres'}
            {...field('password')}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="h-px flex-1 bg-gray-300" />
        ou
        <span className="h-px flex-1 bg-gray-300" />
      </div>

      <div className="-mt-2 flex flex-col gap-4 text-center">
        <p className="text-sm text-gray-600">Já tem uma conta?</p>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/">
            <LogIn />
            Fazer login
          </Link>
        </Button>
      </div>
    </div>
  )
}
