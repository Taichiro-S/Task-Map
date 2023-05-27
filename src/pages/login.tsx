import { useForm } from 'react-hook-form'
import type { NextPage } from 'next'
import { useMutateAuth } from 'hooks/useMutateAuth'
import { Layout } from 'components'
import { loginUserData } from 'types/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from 'schema/loginSchema'
import { TextField, Checkbox, FormControlLabel, Button, Card } from '@mui/material'
import Link from 'next/link'

const Login: NextPage = () => {
  const { loginMutation } = useMutateAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginUserData>({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  })
  const onSubmit = async (data: loginUserData) => {
    console.log('login', data)
    loginMutation.mutate({ email: data.email, password: data.password })
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
              <FormControlLabel control={<Checkbox {...register('remember')} value="on" />} label="Remember me" />
            </div>
            <div className="m-2 ">
              <Button type="submit">ログイン</Button>
            </div>
          </form>
          <div className="m-2">
            <span className="text-sm text-neutral-600">
              アカウントをお持ちでない方は
              <Link href="/signup">
                <span className="text-blue-300 hover:text-blue-600">こちら</span>
              </Link>
            </span>
          </div>
        </Card>
      </Layout>
    </>
  )
}

export default Login
