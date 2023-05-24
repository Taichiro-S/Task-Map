import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { WorkspaceData } from 'types/types'
export const useQueryWorkspace = (userId: string | undefined) => {
  const getWorkspaces = async () => {
    if (!userId) {
      throw new Error('UserNotFound')
    }
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
    if (error) {
      throw new Error(`${error.message}: ${error.details}`)
    }
    if (!data) {
      throw new Error('No notes found')
    }
    const workspaces = data.map((workspace) => {
      return {
        id: workspace.id,
        user_id: workspace.user_id,
        created_at: workspace.created_at,
        title: workspace.title,
      }
    })
    return workspaces as WorkspaceData[]
  }

  return useQuery<WorkspaceData[], Error>(
    ['workspaces', userId],
    getWorkspaces,
    {
      staleTime: Infinity,
      enabled: !!userId,
    },
  )
}
