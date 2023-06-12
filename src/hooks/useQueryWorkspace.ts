import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { WorkspaceData } from 'types/types'
import { User } from '@supabase/supabase-js'
import { getSessionUser } from 'hooks'

export const getWorkspaces = async () => {
  const user = await getSessionUser()
  if (!user) {
    throw new Error('User is not logged in')
  }
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
  if (error) {
    throw new Error(`Error fetching workspaceData: ' ${error.message}`)
  }
  if (!data) {
    throw new Error('Failed to fetch workspaceData')
  }
  const workspaces = data.map((workspace) => {
    return {
      id: workspace.id,
      user_id: workspace.user_id,
      created_at: workspace.created_at,
      updated_at: workspace.updated_at,
      title: workspace.title,
      description: workspace.description,
      public: workspace.public,
    }
  })
  return workspaces as WorkspaceData[]
}

export const useQueryWorkspace = () => {
  return useQuery<WorkspaceData[], Error>(['workspaces'], getWorkspaces, {
    staleTime: Infinity,
  })
}
