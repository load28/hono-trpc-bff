import type { LoginInput, RegisterInput } from '@memo/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { screenKeys } from '~/features/memo/queries'
import { type AuthResult, authApi } from './api'
import { authKeys, authMeQueryOptions } from './queries'

const useAuthSubmit = (submit: (input: LoginInput | RegisterInput) => Promise<AuthResult>) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: submit,
    onSuccess: async (result) => {
      if (!result.ok) return
      queryClient.setQueryData(authMeQueryOptions.queryKey, result.user)
      await router.invalidate()
    },
  })
}

export const useLoginMutation = () => useAuthSubmit(authApi.login)

export const useRegisterMutation = () => useAuthSubmit(authApi.register)

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: authKeys.all })
      queryClient.removeQueries({ queryKey: screenKeys.allMemoScreens })
      await router.invalidate()
    },
  })
}
