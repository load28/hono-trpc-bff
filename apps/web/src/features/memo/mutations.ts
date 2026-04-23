import type { CreateMemoInput } from '@memo/shared'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { trpc } from '~/shared/trpc'
import { screenKeys } from './queries'

export const useCreateMemo = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: CreateMemoInput) => trpc.memo.create.mutate(input),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: screenKeys.allMemoScreens })
      await router.invalidate()
    },
  })
}

export const useDeleteMemo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => trpc.memo.delete.mutate({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: screenKeys.allMemoScreens })
    },
  })
}
