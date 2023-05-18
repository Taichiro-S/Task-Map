import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { NodeData } from '@/types/types'

export const useQueryNode = () => {
  const getNodes = async () => {
    const { data, error } = await supabase.from('nodes').select('*')
    if (error) {
      throw new Error(`${error.message}: ${error.details}`)
    }
    if (!data) {
      throw new Error('No nodes found')
    }
    return data as NodeData[]
  }

  return useQuery<NodeData[], Error>(['nodes'], getNodes, {
    staleTime: Infinity,
  })
}
