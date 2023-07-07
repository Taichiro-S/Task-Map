import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { UserData } from 'types/types'
import { getAuthUser } from 'hooks'

export const getUser = async () => {
  const authUser = await getAuthUser()
  if (!authUser) {
    throw new Error('User is not logged in')
  }
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single()
  if (error || !user) {
    throw new Error(`Error fetching user: ${error?.message}`)
  }
  return user as UserData
}
export const useQueryUser = () => {
  return useQuery<UserData | null | undefined, Error>(['user'], () => getUser(), {
    staleTime: Infinity,
  })
}
