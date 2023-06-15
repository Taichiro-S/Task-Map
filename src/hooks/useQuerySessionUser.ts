import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { User } from '@supabase/supabase-js'

export const getSessionUser = async () => {
  return (await supabase.auth.getUser()).data?.user
}

export const useQuerySessionUser = () => {
  return useQuery<User | null, Error>(['sessionUser'], getSessionUser, {
    staleTime: Infinity,
  })
}
