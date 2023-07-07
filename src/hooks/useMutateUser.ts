import { supabase } from '../utils/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdatedUserData } from 'types/types'
import { api } from 'utils/axios'

type Passwords = {
  password: string
  newPassword: string
}

type UploadedAvatar = {
  avatar: File
  filename: string
  userId: string
}
export const useMutateUser = () => {
  const queryClient = useQueryClient()
  const uploadAvatarMutation = useMutation({
    // TODO : トランザクション処理
    mutationFn: async (uploadedAvatar: UploadedAvatar) => {
      // 同じユーザが登録した画像があるか確認
      const { data: oldFilePath, error: oldFilePathError } = await supabase.storage
        .from('profiles')
        .list('avatars', {
          limit: 1,
          offset: 0,
          search: uploadedAvatar.userId,
        })

      if (oldFilePathError || !oldFilePath) {
        throw oldFilePathError || new Error('Error serching old file path')
      }

      const path = `avatars/${uploadedAvatar.filename}`
      // console.log(oldFilePath, uploadedAvatar.userId, path)

      if (oldFilePath.length === 0) {
        const { data: uploadedFile, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(path, uploadedAvatar.avatar, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError || !uploadedFile) {
          throw uploadError || new Error('Failed to upload avatar')
        }
      } else {
        const { data: updateFile, error: updateError } = await supabase.storage
          .from('profiles')
          .update(path, uploadedAvatar.avatar, {
            cacheControl: '3600',
            upsert: true,
          })

        if (updateError || !updateFile) {
          throw updateError || new Error('Failed to update avatar')
        }
      }

      // アップロードした画像のURL取得
      const { data: filepath, error: filePathError } = await supabase.storage
        .from('profiles')
        .createSignedUrl(path, 600)
      if (filePathError || !filepath) {
        throw filePathError || new Error('Failed to get avatar url')
      }
      const imageUrl = filepath.signedUrl

      // 画像のURLをDBに保存
      const { data: updatedUser, error: updatedUserError } = await supabase
        .from('users')
        .update({
          avatar_url: imageUrl,
        })
        .eq('auth_id', uploadedAvatar.userId)
        .select()

      if (updatedUserError || !updatedUser) {
        throw updatedUserError || new Error('Failed to update user')
      }
      return updatedUser
    },
    onSuccess: async (res: any) => {
      queryClient.invalidateQueries(['user'])
    },
    onError: (error: Error) => {
      throw error
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUserData: UpdatedUserData) => {
      // TODO ; トランザクション処理
      // auth schema と public schema を単一の Database Function で扱うことができないので保留
      const { data: user, error: userError } = await supabase
        .from('users')
        .update({
          name: updatedUserData.name || '',
          avatar_url: updatedUserData.avatar_url || '',
        })
        .eq('id', updatedUserData.user_id)
        .select()
      const { data: auth, error: authError } = await supabase.auth.updateUser({
        email: updatedUserData.email,
      })
      if (userError || !user || authError || !auth) {
        throw new Error(
          `Failed to update user: ${userError?.message}, Failed to update auth: ${authError?.message}`,
        )
      }
      return { user, auth }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        {
          queryKey: ['user', 'auth'],
          exact: true,
          refetchType: 'active',
        },
        { throwOnError: true, cancelRefetch: true },
      )
    },
    onError: (error: Error) => {
      throw new Error('Failed to update user info', error)
    },
  })

  const mailForResetPasswordMutation = useMutation({
    mutationFn: async (email: string | undefined) => {
      if (!email) {
        throw new Error('Email is required')
      }
      const appUrl = process.env.NEXT_PUBLIC_APP_URL as string
      console.log(appUrl)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/resetPassword`,
      })
      if (error) {
        throw error
      }
    },
    onSuccess: async () => {},
    onError: (error: Error) => {
      throw error
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: async (passwords: Passwords) => {
      const { data, error } = await supabase.rpc('update_password', {
        password: passwords.password,
        new_password: passwords.newPassword,
      })
      if (error || !data) {
        throw error || new Error('Failed to update password')
      }
    },
    onSuccess: async () => {},
    onError: (error: Error) => {
      throw error
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      const auth = localStorage.getItem('sb-abebjdrxsalsgwqupfyt-auth-token')
      if (!auth) {
        throw new Error('not-authenticated')
      }
      const authJson = JSON.parse(auth)
      const id = authJson?.user?.id
      try {
        await api
          .post(`/api/supabaseAdmin/resetPassword/${id}`, {
            newPassword: newPassword,
          })
          .then((res) => {
            // console.log(res)
            return res
          })
      } catch (e) {
        throw e
      }
      // const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      //   password: newPassword,
      // })
      // if (error || !data) {
      //   throw error || new Error('Failed to update password')
      // }
    },
    onSuccess: () => {},
    onError: (error: Error) => {
      throw error
    },
  })

  const deleteUserMutation = useMutation({
    // cascade delete で user も削除する
    mutationFn: async (id: string) => {
      const { data: avatar, error: avatarError } = await supabase.storage
        .from('profiles')
        .remove([`avatar/${id}`])

      if (avatarError || !avatar) {
        throw avatarError || new Error('Failed to delete avatar image')
      }
      await supabase.auth.signOut()
      try {
        await api.delete(`/api/supabaseAdmin/deleteUser/${id}`).then((res) => {
          return res
        })
      } catch (e) {
        throw e
      }
      // const { error: authUserError } = await supabaseAdmin.auth.admin.deleteUser(authId)
      // if (authUserError) {
      //   throw authUserError
      // }
    },
    onSuccess: () => {
      queryClient.clear()
    },
    onError: (error: Error) => {
      throw error
    },
  })
  return {
    updateUserMutation,
    deleteUserMutation,
    resetPasswordMutation,
    mailForResetPasswordMutation,
    updatePasswordMutation,
    uploadAvatarMutation,
  }
}
