import { Layout } from 'components'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useQueryAuth, useQueryUser, useMutateUser } from 'hooks'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { forgotPasswordSchema } from 'schema/forgotPasswordSchema'
import { errorToast, successToast } from 'utils/toast'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import Link from 'next/link'
import { HomeIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline'

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

type UserInput = {
  email: string
}

const ForgotPassword: NextPage = () => {
  const router = useRouter()
  const { mailForResetPasswordMutation } = useMutateUser()
  const { data: authUser, error: authUserError, isLoading: authUserIsLoading } = useQueryAuth()
  const [buttonDiasbled, setButtonDisabled] = useState(false)
  // const [ email, setEmail ] = useState<string | undefined>('')
  useEffect(() => {
    if (!authUserIsLoading && authUser) {
      // successToast('セッションの有効期限が切れました')
      router.push('/dashboard')
    }
  }, [authUser, authUserIsLoading])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    mode: 'onSubmit',
    resolver: yupResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: UserInput) => {
    const { email } = data
    // console.log(email)
    setButtonDisabled(true)
    mailForResetPasswordMutation.mutate(email, {
      onSuccess: () => {
        setButtonDisabled(false)
        successToast('パスワード再設定用のメールを送信しました。')
      },
      onError: (error: Error) => {
        setButtonDisabled(false)
        errorToast('メールを送信できませんでした。')
      },
    })
  }

  return (
    <Layout title="Forgot Password">
      <h1 className="text-3xl font-semibold font-zenMaruGothic my-8 text-neutral-800">
        パスワードリセットの設定
      </h1>
      <CustomCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-2 my-4">
            <CustomTextField
              id="email"
              label="メールアドレス"
              type="email"
              {...register('email')}
              helperText={errors?.email?.message}
              error={!!errors?.email}
            />
          </div>
          <div className="mx-2 my-4">
            <Button
              startIcon={<MailOutlineIcon />}
              variant="outlined"
              type="submit"
              color="primary"
              style={{ width: '100%' }}
              disabled={buttonDiasbled}
            >
              パスワードをリセットする
            </Button>
          </div>
        </form>
        <p className="text-xs text-center font-zenMaruGothic mt-4 text-neutral-600">
          入力されたメールアドレスにパスワードリセット用のメールが送信されます。
        </p>
      </CustomCard>
      <div className="m-2 mt-4 ">
        <Link href="/login">
          <div className="flex items-center  text-gray-500 hover:text-blue-500">
            <p className="text-md text-neutral-600">ログインページへ戻る</p>
            <ArrowRightCircleIcon className="h-5 w-5 m-2 cursor-pointer" />
          </div>
        </Link>
      </div>
      <div className="m-2 mt-4">
        <Link href="/dashboard">
          <HomeIcon className="h-6 w-6 cursor-pointer text-gray-500 hover:text-blue-500" />
        </Link>
      </div>
    </Layout>
  )
}

export default ForgotPassword
