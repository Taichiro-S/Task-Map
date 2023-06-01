import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { User } from '@supabase/supabase-js'

export const getSessionUser = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw new Error(error.message)
  }
  if (!data.session?.user) {
    console.log('no session user')
    return (await supabase.auth.getUser()).data?.user
  }
  return data.session?.user
}

export const useQuerySessionUser = () => {
  return useQuery<User | null, Error>(['sessionUser'], getSessionUser, {
    staleTime: Infinity,
  })
}
