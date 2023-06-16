import { useForm } from 'react-hook-form'
import type { NextPage } from 'next'
import { useMutateAuth } from 'hooks/useMutateAuth'
import { Layout } from 'components'
import { loginUserData } from 'types/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from 'schema/loginSchema'
import { TextField, Checkbox, FormControlLabel, Button, Card } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { successToast, errorToast } from 'utils/toast'
import { LOGIN_SUCCESS, INVALID_LOGIN_CREDENTIALS, LOGIN_ERROR } from 'constants/authMessages'
import LoginIcon from '@mui/icons-material/Login'
import { HomeIcon } from '@heroicons/react/24/outline'

import styled from '@emotion/styled'

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

const Login: NextPage = () => {
  const router = useRouter()
  const { loginMutation } = useMutateAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginUserData>({
    mode: 'onSubmit',
    resolver: yupResolver(loginSchema),
  })
  const onSubmit = async (data: loginUserData) => {
    // console.log('login', data)
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          successToast(LOGIN_SUCCESS)
        },
        onError: (error: Error) => {
          if (error.message.includes('Invalid login credentials')) {
            errorToast(INVALID_LOGIN_CREDENTIALS)
          } else {
            errorToast(LOGIN_ERROR)
          }
        },
      },
    )
  }
  return (
    <>
      <Layout title="Auth">
        <div>
          <h1 className="text-3xl text-center font-zenMaruGothic mb-4 text-neutral-800">
            ログイン
          </h1>
        </div>
        <CustomCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="m-2">
              <CustomTextField
                id="email"
                label="メールアドレス"
                {...register('email')}
                helperText={errors?.email?.message}
                error={!!errors?.email}
              />
            </div>
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
            <div className="m-2 mx-auto">
              <FormControlLabel
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                control={<Checkbox {...register('remember')} value="on" />}
                label="ログイン状態を保持する"
              />
            </div>
            <div className="m-2 flex justify-center">
              <Button
                startIcon={<LoginIcon />}
                variant="outlined"
                type="submit"
                style={{ width: '100%' }}
              >
                ログイン
              </Button>
            </div>
          </form>
        </CustomCard>
        <div className="m-2 mt-4">
          <span className="text-sm text-neutral-600">
            アカウントをお持ちでない方は
            <Link href="/signup">
              <span className="text-blue-400 hover:text-blue-600">こちら</span>
            </Link>
          </span>
        </div>

        <Link href="/">
          <HomeIcon className="h-6 w-6 m-2 mt-4 flex justify-center cursor-pointer text-gray-500 hover:text-blue-500" />
        </Link>
      </Layout>
    </>
  )
}

export default Login
