import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { User } from '@supabase/supabase-js'

export const useQueryUser = () => {
  const getUser = async () => {
    const sessionUser = (await supabase.auth.getSession()).data.session?.user
    if (sessionUser && sessionUser !== null) {
      return sessionUser
    }
    const user = (await supabase.auth.getUser()).data.user
    return user
  }

  return useQuery<User | null | undefined, Error>(['user'], getUser, {
    staleTime: Infinity,
  })
}
