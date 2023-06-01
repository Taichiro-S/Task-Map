import { useQueryClient, useMutation } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { NewWorkspace } from 'types/types'
import { toast } from 'react-toastify'
import { successToast, errorToast } from 'utils/toast'

export const useMutateWorkspace = () => {
  const queryClient = useQueryClient()
  const createWorkspaceMutation = useMutation({
    mutationFn: async ({ newWorkspace, user_id }: { newWorkspace: NewWorkspace; user_id: string }) => {
      const newWorkspaceWithUserId = { ...newWorkspace, user_id }
      const { data, error } = await supabase.from('workspaces').insert(newWorkspaceWithUserId).select('*')
      if (error) {
        throw new Error(error.message)
      }
      if (!data) {
        throw new Error('Error creating workspace')
      }
    },
    onSuccess: async (res: any, variables: any) => {
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (error: Error) => {
      throw new Error('Failed to create workspace', error)
    },
  })

  const updateWorkspaceMutation = useMutation({
    mutationFn: async ({ updatedWorkspace, id }: { updatedWorkspace: NewWorkspace; id: string }) => {
      const { data, error } = await supabase
        .from('workspaces')
        .update({
          title: updatedWorkspace.title,
          description: updatedWorkspace.description,
          public: updatedWorkspace.public,
        })
        .eq('id', id)
        .select()
      if (error) {
        throw new Error(error.message)
      }
      if (!data) {
        throw new Error('Error updating workspace')
      }
    },
    onSuccess: async (res: any, variables: any) => {
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (error: Error) => {
      throw new Error('Failed to update workspace', error)
    },
  })

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from('workspaces').delete().eq('id', id)
      if (error) {
        errorToast('ワークスペースの削除に失敗しました')
        throw new Error('Error deleting workspace')
      }
    },
    onSuccess: async (_, variables: any) => {
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (error: Error) => {
      throw new Error('Failed to delete workspace', error)
    },
  })

  return {
    createWorkspaceMutation,
    updateWorkspaceMutation,
    deleteWorkspaceMutation,
  }
}
