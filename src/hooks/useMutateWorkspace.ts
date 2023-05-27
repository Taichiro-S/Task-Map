import { useQueryClient, useMutation } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { WorkspaceData, NewWorkspace } from 'types/types'
import { toast } from 'react-toastify'
import { toastSettings } from 'utils/authToast'

export const useMutateWorkspace = () => {
  const queryClient = useQueryClient()
  const successToast = (message: string) => {
    toast.success(message, toastSettings)
  }
  const errorToast = (message: string) => {
    toast.error(message, toastSettings)
  }
  const createWorkspaceMutation: any = useMutation({
    mutationFn: async ({ newWorkspace, user_id }: { newWorkspace: NewWorkspace; user_id: string }) => {
      const newWorkspaceWithUserId = { ...newWorkspace, user_id }
      const { data, error } = await supabase.from('workspaces').insert(newWorkspaceWithUserId).select('*')
      if (error) {
        errorToast('ワークスペースの作成に失敗しました')
        throw new Error('Error creating workspace')
      }
      if (!data) {
        errorToast('ワークスペースの作成に失敗しました')
        throw new Error('Error creating workspace')
      }
    },
    onSuccess: (res: any) => {
      const previousWorkspace = queryClient.getQueryData<WorkspaceData[]>(['workspace'])
      if (previousWorkspace) {
        console.log(res)
        queryClient.setQueryData(['workspace'], [...previousWorkspace, res[0]])
        successToast('ワークスペースを作成しました')
      }
    },
    onError: (error: Error) => {
      throw new Error('Failed to create workspace', error)
    },
  })

  // const updateCommentMutation = useMutation(async (updatedComment: Omit<WorkspaceData, 'created_at'>) => {
  //   const previousComments = queryClient.getQueryData<WorkspaceData[]>(['comments'])
  //   if (previousComments) {
  //     queryClient.setQueryData(
  //       ['comments'],
  //       previousComments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
  //     )
  //   }
  // })

  // const deleteCommentMutation = useMutation(async (comment_nanoid: string) => {
  //   const previousComments = queryClient.getQueryData<Omit<WorkspaceData, 'id' | 'created_at'>[]>(['comments'])
  //   if (previousComments) {
  //     queryClient.setQueryData(
  //       ['comments'],
  //       previousComments.filter((comment) => comment.id !== id),
  //     )
  //   }
  // })

  return {
    createWorkspaceMutation,
  }
}
