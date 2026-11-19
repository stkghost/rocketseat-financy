import { CombinedGraphQLErrors } from '@apollo/client'

type ValidationError = {
  constraints?: Record<string, string>
}

export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  if (CombinedGraphQLErrors.is(error)) {
    const [first] = error.errors
    const validationErrors = first?.extensions?.validationErrors as ValidationError[] | undefined
    const validationMessage = validationErrors
      ?.flatMap((item) => Object.values(item.constraints ?? {}))
      .at(0)

    return validationMessage ?? first?.message ?? fallback
  }

  return fallback
}
