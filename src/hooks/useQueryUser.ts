import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'

export const useQueryUser = () => {
  const getUserId = async () => {
    const userId = (await supabase.auth.getUser()).data?.user?.id
    if (!userId) {
      throw new Error('UserNotFound')
    }
    return userId
  }

  return useQuery<string | undefined, Error>(['userId'], getUserId, {
    staleTime: Infinity,
  })
}
