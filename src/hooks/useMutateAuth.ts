import { supabase } from '../utils/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { errorToast } from 'utils/toast'
import { LoginUserData, SignupUserData } from 'types/types'
import { LOGOUT_ERROR } from 'constants/authMessages'

export const useMutateAuth = () => {
  const queryClient = useQueryClient()
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: Omit<LoginUserData, 'remember' | 'showPassword'>) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        throw new Error(error.message)
      }
      if (!data) {
        throw new Error('Failed to login')
      }
    },
    onSuccess: async (_, variables: { email: string; password: string }) => {
      const user = (await supabase.auth.getUser()).data.user
      queryClient.setQueryData(['sessionUser'], user)
    },
    onError: (error: Error) => {
      throw new Error('Failed to login', error)
    },
  })

  const signupMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: Omit<SignupUserData, 'repassword' | 'showPassword'>) => {
      const { data: authUserData, error: authUserError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authUserError || !authUserData) {
        throw new Error(`Failed to signup : ${authUserError?.message}`)
      }
      await supabase.from('users').insert({ auth_id: authUserData.user?.id })
    },
    onSuccess: async () => {
      const user = (await supabase.auth.getUser()).data.user
      queryClient.setQueryData(['sessionUser'], user)
    },
    onError: (error: Error) => {
      throw new Error('Failed to signup', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        errorToast(LOGOUT_ERROR)
        throw new Error('Failed to logout', error)
      }
    },
    onSuccess: () => {
      queryClient.clear()
    },
    onError: (error: Error) => {
      throw new Error('Failed to logout', error)
    },
  })
  return {
    loginMutation,
    signupMutation,
    logoutMutation,
  }
}
