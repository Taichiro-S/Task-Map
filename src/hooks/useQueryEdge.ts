import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { Edge } from 'reactflow'

export const useQueryEdge = (userId: string | undefined) => {
  const getEdges = async () => {
    if (!userId) {
      throw new Error('UserNotFound')
    }
    const { data, error } = await supabase
      .from('edges')
      .select('*')
      .eq('user_id', userId)

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
        animated: edgeData.animated,
        zIndex: 5,
      }
    })

    return edges as Edge[]
  }

  return useQuery<Edge[], Error>(['edges', userId], getEdges, {
    staleTime: Infinity,
    enabled: !!userId,
  })
}
