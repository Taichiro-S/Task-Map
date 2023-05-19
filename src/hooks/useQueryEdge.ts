import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { EdgeData } from '@/types/types'
import { Edge } from 'reactflow'
import { useRouter } from 'next/router'

export const useQueryEdge = (user_id: string | undefined) => {
  const getEdges = async () => {
    if (!user_id) {
      throw new Error('UserNotFound')
    }
    const { data, error } = await supabase
      .from('edges')
      .select('*')
      .eq('user_id', user_id)

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

  return useQuery<Edge[], Error>(['edges', user_id], getEdges, {
    staleTime: Infinity,
    enabled: !!user_id,
  })
}
