import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { NodeData } from '@/types/types'
import { Node } from 'reactflow'
export const useQueryNode = () => {
  const getNodes = async () => {
    const { data, error } = await supabase.from('nodes').select('*')
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
        data: { label: nodeData.label },
      }
    })

    return nodes as Node[]
  }

  return useQuery<Node[], Error>(['nodes'], getNodes, {
    staleTime: Infinity,
  })
}
