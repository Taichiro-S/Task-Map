import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { EdgeData } from '@/types/types'
import { Edge } from 'reactflow'

export const useQueryEdge = () => {
  const getEdges = async () => {
    const { data, error } = await supabase.from('edges').select('*')

    if (error) {
      throw new Error(`${error.message}: ${error.details}`)
    }
    if (!data) {
      throw new Error('No edges found')
    }
    const edges = data.map((edgeData) => {
      return {
        id: edgeData.edge_nanoid,
        source: edgeData.source_node_id,
        target: edgeData.target_node_id,
        type: edgeData.type,
        data: { label: edgeData.label },
      }
    })

    return edges as Edge[]
  }

  return useQuery<Edge[], Error>(['edges'], getEdges, {
    staleTime: Infinity,
  })
}
