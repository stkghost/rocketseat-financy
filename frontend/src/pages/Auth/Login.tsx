import { useId } from 'react'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { PasswordField, TextField } from '@/components/form'
import { Mail, UserRoundPlus } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getErrorMessage } from '@/lib/graphql/errors'
import { LOGIN } from '@/lib/graphql/mutations/auth'
import { useAuthStore } from '@/stores/auth'

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('Informe um e-mail válido')),
  password: z.string().min(1, 'Informe sua senha'),
  remember: z.boolean(),
})

type LoginForm = z.infer<typeof loginSchema>

export function Login() {
  const rememberId = useId()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [login, { loading }] = useMutation(LOGIN)

  const {
    register: field,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  async function onSubmit({ remember, ...data }: LoginForm) {
    try {
      const { data: result } = await login({ variables: { data } })
      if (!result) return

      setAuth({ ...result.login, remember })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível entrar'))
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8 rounded-xl border border-gray-200 bg-white p-8">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold text-gray-800">Fazer login</h1>
        <p className="text-gray-600">Entre na sua conta para continuar</p>
      </header>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
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
            autoComplete="current-password"
            error={!!errors.password}
            helper={errors.password?.message}
            {...field('password')}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="remember"
                render={({ field: { value, onChange, ...rest } }) => (
                  <Checkbox
                    id={rememberId}
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked === true)}
                    {...rest}
                  />
                )}
              />
              <label htmlFor={rememberId} className="cursor-pointer text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            <button
              type="button"
              onClick={() => toast.info('Recuperação de senha em breve')}
              className="text-sm font-medium text-brand-base decoration-1 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Recuperar senha
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="h-px flex-1 bg-gray-300" />
        ou
        <span className="h-px flex-1 bg-gray-300" />
      </div>

      <div className="-mt-2 flex flex-col gap-4 text-center">
        <p className="text-sm text-gray-600">Ainda não tem uma conta?</p>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/signup">
            <UserRoundPlus />
            Criar conta
          </Link>
        </Button>
      </div>
    </div>
  )
}
