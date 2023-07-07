import { Layout } from 'components'
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { HomeIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { resetPasswordSchema } from 'schema/resetPasswordSchema'
import { useMutateUser, useQueryAuth } from 'hooks'
import { errorToast, successToast } from 'utils/toast'
import { useRouter } from 'next/router'
import { supabase } from 'utils/supabase'

const CustomCard = styled(Card)`
  width: 330px;
  background-color: #fafafa;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 0.5rem;
`

const CustomTextField = styled(TextField)`
  width: 100%;
`

type Password = {
  password: string
}

const ResetPassword = () => {
  const router = useRouter()
  const [resetDisabled, setResetDisabled] = useState<boolean>(false)
  const { resetPasswordMutation } = useMutateUser()
  // const { data: authUser, error: authUserError, isLoading: authUserIsLoading } = useQueryAuth()
  // // const [ email, setEmail ] = useState<string | undefined>('')
  // useEffect(() => {
  //   if (!authUserIsLoading && authUser) {
  //     // successToast('セッションの有効期限が切れました')
  //     router.push('/dashboard')
  //   }
  // }, [authUser, authUserIsLoading])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Password>({
    mode: 'onSubmit',
    resolver: yupResolver(resetPasswordSchema),
  })
  const onSubmit = async (data: Password) => {
    setResetDisabled(true)
    // console.log('login', data)
    const { password } = data
    resetPasswordMutation.mutate(password, {
      onSuccess: () => {
        setResetDisabled(false)
        successToast('パスワードをリセットしました')
        return router.push('/dashboard')
      },
      onError: (error: Error) => {
        setResetDisabled(false)
        errorToast('パスワードのリセットに失敗しました')
      },
    })
  }
  return (
    <Layout title="Password Reset">
      <div>
        <h1 className="text-3xl text-center font-zenMaruGothic mb-4 text-neutral-800">
          パスワードリセット
        </h1>
      </div>
      <CustomCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="">新しいパスワードを入力してください</p>
          <div className="m-2">
            <CustomTextField
              id="password"
              label="パスワード"
              type="password"
              {...register('password')}
              helperText={errors?.password?.message || '8-20 文字で入力してください'}
              error={!!errors?.password}
            />
          </div>
          <div className="m-2 flex justify-center">
            <Button
              startIcon={<SaveAltIcon />}
              variant="outlined"
              type="submit"
              style={{ width: '100%' }}
              disabled={resetDisabled}
            >
              パスワードをリセットする
            </Button>
          </div>
        </form>
      </CustomCard>

      <div className="m-2 mt-4">
        <Link href="/">
          <HomeIcon className="h-6 w-6 m-2 mt-4 flex justify-center cursor-pointer text-gray-500 hover:text-blue-500" />
        </Link>
      </div>
    </Layout>
  )
}

export default ResetPassword
