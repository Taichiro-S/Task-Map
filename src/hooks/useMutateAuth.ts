import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const useMutateAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const reset = () => {
    setEmail('')
    setPassword('')
  }
  const authSuccessToast = (toastMessage: string) => toast.success(toastMessage)
  const authErrorToast = (toastMessage: string) => toast.error(toastMessage)

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      authSuccessToast('ログインしました')
      reset()
    },
    onError: (error: Error) => {
      authErrorToast('ログインに失敗しました')
      console.log(error.message)
      reset()
    },
  })

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      authSuccessToast('ユーザ登録しました')
      reset()
    },
    onError: (error: Error) => {
      authErrorToast('登録に失敗しました')
      reset()
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      authSuccessToast('ログアウトしました')
      reset()
    },
    onError: (error: Error) => {
      alert(error.message)
    },
  })

  return {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
    logoutMutation,
  }
}
