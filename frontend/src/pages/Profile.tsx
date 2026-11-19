import { useApolloClient, useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { TextField } from '@/components/form'
import { LogOut, Mail, UserRound } from '@/components/icons'
import { UserAvatar } from '@/components/UserAvatar'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/graphql/errors'
import { UPDATE_PROFILE } from '@/lib/graphql/mutations/user'
import { useAuthStore } from '@/stores/auth'

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome completo'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function Profile() {
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const logout = useAuthStore((state) => state.logout)
  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE)

  const {
    register: field,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '' },
  })

  if (!user) return null

  async function onSubmit(data: ProfileForm) {
    try {
      const { data: result } = await updateProfile({ variables: { data } })
      if (!result) return

      updateUser({ name: result.updateProfile.name })
      reset({ name: result.updateProfile.name })
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível salvar as alterações'))
    }
  }

  async function handleLogout() {
    logout()
    await apolloClient.clearStore()
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-xl border border-gray-200 bg-white p-8">
      <header className="flex flex-col items-center gap-6 text-center">
        <UserAvatar name={user.name} size="lg" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-semibold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </header>

      <hr className="border-gray-200" />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
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
            value={user.email}
            disabled
            readOnly
            helper="O e-mail não pode ser alterado"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="text-danger" />
            Sair da conta
          </Button>
        </div>
      </form>
    </div>
  )
}
