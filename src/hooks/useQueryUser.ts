import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { User } from '@supabase/supabase-js'

export const useQueryUser = () => {
  const getUser = async () => {
    const sessionUser = (await supabase.auth.getSession()).data.session?.user
    if (sessionUser && sessionUser !== null) {
      console.log('sessionUser', sessionUser)
      return sessionUser
    }
    const user = (await supabase.auth.getUser()).data.user
    // if (
    //   !user &&
    //   (router.pathname === '/login' || router.pathname === '/signup')
    // ) {
    //   return null
    // }
    // if (
    //   (!user || user === null) &&
    //   router.pathname !== '/login' &&
    //   router.pathname !== '/signup'
    // ) {
    //   throw new Error('User is not logged in')
    // }
    return user
  }

  return useQuery<User | null | undefined, Error>(['user'], getUser, {
    staleTime: Infinity,
  })
}
