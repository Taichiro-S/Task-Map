import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { Node } from 'reactflow'
import { User } from '@supabase/supabase-js'

export const getNodes = async (user: User | null | undefined, workspaceId: string) => {
  if (!user || user === null) {
    throw new Error('User is not logged in')
  }
  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('user_id', user.id)
    .eq('workspace_id', workspaceId)
  if (!data) {
    throw new Error('Failed to fetch nodeData')
  }
  if (error) {
    throw new Error('Error fetching nodeData')
  }
  console.log('data', data, 'userId', user.id, 'workspaceId', workspaceId)
  const nodes = data.map((nodeData) => {
    return {
      id: nodeData.node_nanoid,
      type: nodeData.type,
      position: { x: nodeData.position_X, y: nodeData.position_Y },
      data: {
        label: nodeData.label,
        color: nodeData.color,
        index_in_nodes_array: nodeData.index_in_nodes_array,
        height: nodeData.height,
        width: nodeData.width,
        memo: nodeData.memo,
        status: nodeData.status,
      },
      parentNode: nodeData.parent_node_id,
      zIndex: nodeData.type === 'grouping' ? 0 : 10,
    }
  })
  const sortedNodes = [...nodes].sort((a, b) => {
    return a.data.index_in_nodes_array - b.data.index_in_nodes_array
  })

  return sortedNodes as Node[]
}

export const useQueryNode = (user: User | null | undefined, workspaceId: string) => {
  return useQuery<Node[], Error>(['nodes', user], () => getNodes(user, workspaceId), {
    staleTime: Infinity,
    enabled: !!user,
  })
}
