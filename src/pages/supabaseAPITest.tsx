import React from 'react'
import { supabase } from '../utils/supabase'
import { NextPage } from 'next'

const singnInWIthPassword = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@test',
    password: 'password',
  })
  if (error) {
    throw new Error(error.message)
  }
  if (!data) {
    throw new Error('Failed to login')
  }
}
const supabaseAPITest: NextPage = () => {
  return (
    <>
      <h1>supabaseAPITest</h1>
      <button onClick={singnInWIthPassword}>Sign in with password</button>
    </>
  )
}

export default supabaseAPITest
