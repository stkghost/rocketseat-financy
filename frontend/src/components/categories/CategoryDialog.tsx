import { useEffect, useId } from 'react'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TextField } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { categoryColorOptions, categoryIconOptions } from '@/lib/category-styles'
import { getErrorMessage } from '@/lib/graphql/errors'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/lib/graphql/mutations/categories'
import { CATEGORIES } from '@/lib/graphql/queries/categories'
import type { Category } from '@/types/finance'
import { CategoryColorPicker } from './CategoryColorPicker'
import { CategoryIconPicker } from './CategoryIconPicker'

const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Informe o título da categoria')
    .max(50, 'O título deve ter no máximo 50 caracteres'),
  description: z.string().trim().max(200, 'A descrição deve ter no máximo 200 caracteres'),
  icon: z.enum(categoryIconOptions as [Category['icon'], ...Category['icon'][]]),
  color: z.enum(categoryColorOptions as [Category['color'], ...Category['color'][]]),
})

type CategoryFormValues = z.infer<typeof categorySchema>

type CategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSaved?: (category: Category) => void
}

function toFormValues(category?: Category | null): CategoryFormValues {
  return {
    title: category?.title ?? '',
    description: category?.description ?? '',
    icon: category?.icon ?? categoryIconOptions[0],
    color: category?.color ?? categoryColorOptions[0],
  }
}

export function CategoryDialog({ open, onOpenChange, category, onSaved }: CategoryDialogProps) {
  const iconLabelId = useId()
  const colorLabelId = useId()
  const isEditing = !!category

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    update(cache, { data }) {
      const created = data?.createCategory
      if (!created) return

      cache.updateQuery({ query: CATEGORIES }, (current) =>
        current
          ? {
              categories: [...current.categories, created].sort((first, second) =>
                first.title.localeCompare(second.title, 'pt-BR')
              ),
            }
          : current
      )
    },
  })
  const [updateCategory] = useMutation(UPDATE_CATEGORY)

  const {
    register: field,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: toFormValues(category),
  })

  useEffect(() => {
    if (open) reset(toFormValues(category))
  }, [open, category, reset])

  async function onSubmit(values: CategoryFormValues) {
    const data = { ...values, description: values.description || null }

    try {
      const saved = isEditing
        ? (await updateCategory({ variables: { id: category.id, data } })).data?.updateCategory
        : (await createCategory({ variables: { data } })).data?.createCategory

      if (!saved) return

      toast.success(isEditing ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!')
      onSaved?.(saved)
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível salvar a categoria'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>Organize suas transações com categorias</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <TextField
              label="Título"
              placeholder="Ex. Alimentação"
              maxLength={50}
              error={!!errors.title}
              helper={errors.title?.message}
              {...field('title')}
            />
            <TextField
              label="Descrição"
              placeholder="Descrição da categoria"
              maxLength={200}
              error={!!errors.description}
              helper={errors.description?.message ?? 'Opcional'}
              {...field('description')}
            />

            <div className="flex flex-col gap-2">
              <span id={iconLabelId} className="text-sm font-medium text-gray-700">
                Ícone
              </span>
              <Controller
                control={control}
                name="icon"
                render={({ field: { value, onChange } }) => (
                  <CategoryIconPicker value={value} onChange={onChange} labelId={iconLabelId} />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span id={colorLabelId} className="text-sm font-medium text-gray-700">
                Cor
              </span>
              <Controller
                control={control}
                name="color"
                render={({ field: { value, onChange } }) => (
                  <CategoryColorPicker value={value} onChange={onChange} labelId={colorLabelId} />
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
