import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { NodeData } from '@/types/types'
import { Node } from 'reactflow'
export const useQueryNode = (user_id: string | undefined) => {
  const getNodes = async () => {
    if (!user_id) {
      throw new Error('UserNotFound')
    }
    const { data, error } = await supabase
      .from('nodes')
      .select('*')
      .eq('user_id', user_id)
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
        data: { label: nodeData.label, color: nodeData.color },
      }
    })

    return nodes as Node[]
  }

  return useQuery<Node[], Error>(['nodes', user_id], getNodes, {
    staleTime: Infinity,
    enabled: !!user_id,
  })
}
