import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { User } from '@supabase/supabase-js'

export const getAuthUser = async () => {
  return (await supabase.auth.getUser()).data?.user
}

export const useQueryAuth = () => {
  return useQuery<User | null, Error>(['auth'], getAuthUser, {
    staleTime: Infinity,
  })
}
