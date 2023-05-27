import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { User } from '@supabase/supabase-js'

export const useQuerySessionUser = () => {
  const getSessionUser = async () => {
    return (await supabase.auth.getUser()).data.user
  }
  return useQuery<User | null, Error>(['sessionUser'], getSessionUser, {
    staleTime: Infinity,
  })
}
