import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { EdgeData } from '@/types/types'

export const useQueryEdge = () => {
  const getEdges = async () => {
    const { data, error } = await supabase.from('edges').select('*')
    if (error) {
      throw new Error(`${error.message}: ${error.details}`)
    }
    if (!data) {
      throw new Error('No edges found')
    }
    return data as EdgeData[]
  }

  return useQuery<EdgeData[], Error>(['nodes'], getEdges, {
    staleTime: Infinity,
  })
}
