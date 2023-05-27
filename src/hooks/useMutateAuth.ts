import { supabase } from '../utils/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { toastSettings } from 'utils/authToast'
import {
  LOGIN_SUCCESS,
  INVALID_LOGIN_CREDENTIALS,
  LOGIN_ERROR,
  SIGNUP_SUCCESS,
  USER_ALREADY_REGISTERED,
  SIGNUP_ERROR,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
} from 'constants/authMessages'

export const useMutateAuth = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const successToast = (message: string) => {
    toast.success(message, toastSettings)
  }
  const errorToast = (message: string) => {
    toast.error(message, toastSettings)
  }

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          errorToast(INVALID_LOGIN_CREDENTIALS)
        } else {
          errorToast(LOGIN_ERROR)
        }
        throw new Error('Failed to login', error)
      }
      if (!data) {
        errorToast(LOGIN_ERROR)
        throw new Error('Failed to login')
      }
    },
    onSuccess: async (_, variables: { email: string; password: string }) => {
      const user = (await supabase.auth.getUser()).data.user
      queryClient.setQueryData(['sessionUser'], user)
      successToast(LOGIN_SUCCESS)
      router.push('/')
    },
    onError: (error: Error) => {
      throw new Error('Failed to login', error)
    },
  })

  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        if (error.message.includes('User already registered')) {
          errorToast(USER_ALREADY_REGISTERED)
        } else {
          errorToast(SIGNUP_ERROR)
        }
        throw new Error('Failed to register')
      }
      if (!data) {
        errorToast(SIGNUP_ERROR)
        throw new Error('Failed to register')
      }
    },
    onSuccess: async () => {
      const user = (await supabase.auth.getUser()).data.user
      queryClient.setQueryData(['sessionUser'], user)
      successToast(SIGNUP_SUCCESS)
      router.push('/')
    },
    onError: (error: Error) => {
      throw new Error('Failed to register', error)
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
      queryClient.setQueryData(['sessionUser'], null)
      successToast(LOGOUT_SUCCESS)
      router.push('/login')
    },
    onError: (error: Error) => {
      throw new Error('Failed to logout', error)
    },
  })
  return {
    loginMutation,
    registerMutation,
    logoutMutation,
  }
}
