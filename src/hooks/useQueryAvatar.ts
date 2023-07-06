import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { getUser } from 'hooks'

const getUserAvatar = async () => {
  const user = await getUser()
  if (!user) {
    throw new Error('User is not logged in')
  }
  const path = `avatar/${user.avatar_url}`
  const { data, error } = await supabase.storage.from('profiles').download(path)
  if (error || !data) {
    throw error || new Error('Error fetching user avatar')
  }
  return data
}
export const useQueryAvatar = () => {
  return useQuery<Blob | null | undefined, Error>(['avatar'], () => getUserAvatar(), {
    staleTime: Infinity,
  })
}
