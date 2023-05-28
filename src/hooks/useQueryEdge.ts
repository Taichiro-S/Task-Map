import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { Edge } from 'reactflow'
import { User } from '@supabase/supabase-js'

export const getEdges = async (user: User | null | undefined, workspaceId: string) => {
  if (!user || user === null) {
    throw new Error('User is not logged in')
  }
  const { data, error } = await supabase
    .from('edges')
    .select('*')
    .eq('user_id', user.id)
    .eq('workspace_id', workspaceId)
  if (!data) {
    throw new Error('Failed to fetch edgeData')
  }
  if (error) {
    throw new Error('Error fetching edgeData')
  }
  const edges = data.map((edgeData) => {
    return {
      id: edgeData.edge_nanoid,
      source: edgeData.source_node_id,
      target: edgeData.target_node_id,
      type: edgeData.type,
      data: { label: edgeData.label },
      animated: edgeData.animated,
      zIndex: 5,
    }
  })

  return edges as Edge[]
}
export const useQueryEdge = (user: User | null | undefined, workspaceId: string) => {
  return useQuery<Edge[], Error>(['edges', user], () => getEdges(user, workspaceId), {
    staleTime: Infinity,
    enabled: !!user,
  })
}
