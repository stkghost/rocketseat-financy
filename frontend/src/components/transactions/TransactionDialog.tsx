import { useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { CurrencyField, DateField, SelectField, TextField } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { fromDateOnlyISOString, toDateOnlyISOString } from '@/lib/format'
import { getErrorMessage } from '@/lib/graphql/errors'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/lib/graphql/mutations/transactions'
import { CATEGORIES } from '@/lib/graphql/queries/categories'
import { TRANSACTION_DEPENDENT_QUERIES } from '@/lib/graphql/queries/transactions'
import type { Transaction } from '@/types/finance'
import { TransactionTypeToggle } from './TransactionTypeToggle'

const transactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  description: z
    .string()
    .trim()
    .min(1, 'Informe uma descrição')
    .max(100, 'A descrição deve ter no máximo 100 caracteres'),
  date: z.date({ error: 'Selecione uma data' }),
  amount: z.number().positive('Informe um valor maior que zero'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

type TransactionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
  onSaved?: () => void
}

function toFormValues(transaction?: Transaction | null): Partial<TransactionFormValues> {
  return {
    type: transaction?.type ?? 'expense',
    description: transaction?.description ?? '',
    date: transaction ? fromDateOnlyISOString(transaction.date) : undefined,
    amount: transaction?.amount ?? 0,
    categoryId: transaction?.category.id ?? '',
  }
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSaved,
}: TransactionDialogProps) {
  const isEditing = !!transaction

  const { data: categoriesData, loading: categoriesLoading } = useQuery(CATEGORIES, {
    skip: !open,
    fetchPolicy: 'cache-and-network',
  })
  const categories = categoriesData?.categories ?? []

  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: TRANSACTION_DEPENDENT_QUERIES,
  })
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: TRANSACTION_DEPENDENT_QUERIES,
  })

  const {
    register: field,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: toFormValues(transaction),
  })

  useEffect(() => {
    if (open) reset(toFormValues(transaction))
  }, [open, transaction, reset])

  async function submit({ date, ...values }: TransactionFormValues) {
    const data = { ...values, date: toDateOnlyISOString(date) }

    try {
      if (isEditing) {
        await updateTransaction({ variables: { id: transaction.id, data } })
      } else {
        await createTransaction({ variables: { data } })
      }
      toast.success(
        isEditing ? 'Transação atualizada com sucesso!' : 'Transação criada com sucesso!'
      )
      onSaved?.()
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível salvar a transação'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados da transação' : 'Registre sua despesa ou receita'}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
          <Controller
            control={control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <TransactionTypeToggle value={value} onChange={onChange} />
            )}
          />

          <div className="flex flex-col gap-4">
            <TextField
              label="Descrição"
              placeholder="Ex. Almoço no restaurante"
              maxLength={100}
              error={!!errors.description}
              helper={errors.description?.message}
              {...field('description')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <DateField
                    label="Data"
                    value={value}
                    onChange={onChange}
                    error={!!errors.date}
                    helper={errors.date?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="amount"
                render={({ field: { value, onChange, onBlur, name, ref } }) => (
                  <CurrencyField
                    label="Valor"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                    error={!!errors.amount}
                    helper={errors.amount?.message}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name="categoryId"
              render={({ field: { value, onChange, name } }) => (
                <SelectField
                  label="Categoria"
                  name={name}
                  value={value}
                  onValueChange={onChange}
                  options={categories.map((category) => ({
                    value: category.id,
                    label: category.title,
                  }))}
                  emptyMessage={
                    categoriesLoading && categories.length === 0
                      ? 'Carregando categorias...'
                      : 'Nenhuma categoria cadastrada'
                  }
                  error={!!errors.categoryId}
                  helper={errors.categoryId?.message}
                />
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
