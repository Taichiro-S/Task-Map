import type { NextPage } from 'next'
import { useState } from 'react'
import { supabase } from 'utils/supabase'

type Data = {
  email: string
  password: string
}

const LoginForTest: NextPage = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const onSubmit = async ({ email, password }: Data) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log(data, error)
    if (error) {
      setMessage(error.message)
    }
    if (!error && data) {
      setMessage('ログインしました。')
    }
  }
  return (
    <>
      <form method="POST" onSubmit={() => onSubmit({ email, password })}>
        <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p id="message">{message}</p>
    </>
  )
}

export default LoginForTest
