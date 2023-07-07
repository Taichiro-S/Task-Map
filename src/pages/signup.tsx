import { useForm } from 'react-hook-form'
import type { NextPage } from 'next'
import { useMutateAuth } from 'hooks/useMutateAuth'
import { Layout } from 'components'
import { SignupUserData } from 'types/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { signupSchema } from 'schema/signupSchema'
import { TextField, Button, Card } from '@mui/material'
import Link from 'next/link'
import { HomeIcon } from '@heroicons/react/24/outline'
import { successToast, errorToast } from 'utils/toast'
import { SIGNUP_SUCCESS, USER_ALREADY_REGISTERED, SIGNUP_ERROR } from 'constants/authMessages'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import LoginIcon from '@mui/icons-material/Login'

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
const Signup: NextPage = () => {
  const router = useRouter()
  const { signupMutation } = useMutateAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupUserData>({
    mode: 'onSubmit',
    resolver: yupResolver(signupSchema),
  })
  const onSubmit = async (data: SignupUserData) => {
    // console.log('signup', data)
    signupMutation.mutate(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: () => {
          successToast(SIGNUP_SUCCESS)
          router.push('/waitingForVerification')
        },
        onError: (error: Error) => {
          console.log(error)
          if (error.message.includes('User already registered')) {
            errorToast(USER_ALREADY_REGISTERED)
          } else {
            errorToast(SIGNUP_ERROR)
          }
        },
      },
    )
  }
  return (
    <>
      <Layout title="Signup">
        <div>
          <h1 className="text-3xl text-center font-zenMaruGothic mb-4 text-neutral-800">
            ユーザー登録
          </h1>
        </div>
        <CustomCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="m-4">
              <CustomTextField
                id="name"
                label="ユーザ名"
                {...register('name')}
                helperText={errors?.name?.message}
                error={!!errors?.name}
              />
            </div>
            <div className="m-4">
              <CustomTextField
                id="email"
                label="メールアドレス"
                {...register('email')}
                helperText={errors?.email?.message}
                error={!!errors?.email}
              />
            </div>
            <div className="m-4">
              <CustomTextField
                id="password"
                label="パスワード"
                type="password"
                {...register('password')}
                helperText={errors?.password?.message || '8-20 文字で入力して下さい'}
                error={!!errors?.password}
              />
            </div>
            <div className="m-4">
              <CustomTextField
                id="repassword"
                label="パスワード再入力"
                type="password"
                {...register('repassword')}
                helperText={errors?.repassword?.message}
                error={!!errors?.repassword}
              />
            </div>
            <div className="m-4 ">
              <Button
                startIcon={<LoginIcon />}
                variant="outlined"
                type="submit"
                style={{ width: '100%' }}
              >
                登録
              </Button>
            </div>
          </form>
        </CustomCard>
        <div className="m-4 mt-4">
          <span className="text-sm text-neutral-600">
            アカウントをお持ちの方は
            <Link href="/login">
              <span className="text-blue-400 hover:text-blue-600">こちら</span>
            </Link>
          </span>
        </div>
        <Link href="/">
          <HomeIcon className="h-6 w-6 m-4 flex justify-center cursor-pointer text-gray-500 hover:text-blue-500" />
        </Link>
      </Layout>
    </>
  )
}

export default Signup
