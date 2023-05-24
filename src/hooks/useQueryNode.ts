import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { Node } from 'reactflow'

export const useQueryNode = (userId: string | undefined) => {
  const getNodes = async () => {
    if (!userId) {
      throw new Error('UserNotFound')
    }
    const { data, error } = await supabase
      .from('nodes')
      .select('*')
      .eq('user_id', userId)
    if (error) {
      throw new Error(`${error.message}: ${error.details}`)
    }
    if (!data) {
      throw new Error('No nodes found')
    }
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

  return useQuery<Node[], Error>(['nodes', userId], getNodes, {
    staleTime: Infinity,
    enabled: !!userId,
  })
}
