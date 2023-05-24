import React from 'react'
import axios from 'axios'

const Mocktest = () => {
  const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const login = () => {
    apiClient
      .post('/login', {
        email: 'example@co.jp',
        password: 'password',
      })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const logout = () => {
    apiClient
      .post('/logout')
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const getUser = () => {
    apiClient
      .get('/user')
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <div>
      <button onClick={() => login()}>ログイン</button>
      <button onClick={() => logout()}>ログアウト</button>
      <button onClick={() => getUser()}>ユーザ取得</button>
    </div>
  )
}

export default Mocktest
