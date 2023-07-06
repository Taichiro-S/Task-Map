import { Card } from '@mui/material'
import { Layout, Spinner } from 'components'
import React from 'react'

const WaitingForVerification = () => {
  return (
    <Layout title="Waiting for verification">
      <Card>
        <p className="m-4">登録されたメールアドレスに確認用のメールを送信しました。</p>
      </Card>
      <div className="flex items-center">
        <div className=" mr-5">
          <Spinner />
        </div>
        <h1 className="text-sm text-center text-neutral-800">Waiting for verification .... </h1>
      </div>
    </Layout>
  )
}

export default WaitingForVerification
