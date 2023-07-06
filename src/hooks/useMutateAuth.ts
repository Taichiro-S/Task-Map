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
      queryClient.setQueryData(['auth'], user)
    },
    onError: (error: Error) => {
      throw new Error('Failed to login', error)
    },
  })

  const signupMutation = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: Omit<SignupUserData, 'repassword' | 'showPassword'>) => {
      const { data: authUserData, error: authUserError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authUserError || !authUserData) {
        throw authUserError || new Error('Failed to signup')
      }
      const { error: userError } = await supabase
        .from('users')
        .insert({ auth_id: authUserData.user?.id, name: name })
      if (userError) {
        throw userError
      }
    },
    onSuccess: async () => {
      const user = (await supabase.auth.getUser()).data.user
      queryClient.setQueryData(['auth'], user)
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
