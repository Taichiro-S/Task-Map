import React from 'react'
import axios from 'axios'
import { Layout } from 'components'
import { NextPage } from 'next'

const Mocktest: NextPage = () => {
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
      <Layout title="Mocktest">
        <button className="cursor-pointer hover:text-emerald-400" onClick={() => login()}>
          ログイン
        </button>
        <button className="cursor-pointer hover:text-red-400" onClick={() => logout()}>
          ログアウト
        </button>
        <button className="cursor-pointer hover:text-blue-400" onClick={() => getUser()}>
          ユーザ取得
        </button>
      </Layout>
    </div>
  )
}

export default Mocktest
