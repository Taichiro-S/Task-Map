import { useForm } from 'react-hook-form'
import type { NextPage } from 'next'
import { useMutateAuth } from 'hooks/useMutateAuth'
import { Layout } from 'components'
import { signupUserData } from 'types/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { signupSchema } from 'schema/signupSchema'
import { TextField, Button, Card } from '@mui/material'
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home'

import { useRouter } from 'next/router'

const Signup: NextPage = () => {
  const router = useRouter()
  const { registerMutation } = useMutateAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupUserData>({
    mode: 'onChange',
    resolver: yupResolver(signupSchema),
  })
  const onSubmit = async (data: signupUserData) => {
    console.log('signup', data)
    registerMutation.mutate({ email: data.email, password: data.password })
  }
  return (
    <>
      <Layout title="Auth">
        <Card className="m-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="m-2">
              <TextField
                id="email"
                label="Email"
                {...register('email')}
                helperText={errors?.email?.message}
                error={!!errors?.email}
              />
            </div>
            <div className="m-2">
              <TextField
                id="password"
                label="Password"
                type="password"
                {...register('password')}
                helperText={errors?.password?.message || '8-20 characters'}
                error={!!errors?.password}
              />
            </div>
            <div className="m-2">
              <TextField
                id="repassword"
                label="Repassword"
                type="password"
                {...register('repassword')}
                helperText={errors?.repassword?.message || 'パスワードを再入力してください'}
                error={!!errors?.repassword}
              />
            </div>
            <div className="m-2 ">
              <Button variant="outlined" type="submit">
                登録
              </Button>
            </div>
          </form>
          <div className="m-2">
            <span>
              アカウントをお持ちの方は
              <Link href="/login">
                <span className="text-blue-400 hover:text-blue-600">こちら</span>
              </Link>
            </span>
          </div>
          <div className="m-2">
            <Button variant="outlined" color="primary" onClick={() => router.push('/')} startIcon={<HomeIcon />}>
              ホーム
            </Button>
          </div>
        </Card>
      </Layout>
    </>
  )
}

export default Signup
