import { Layout } from 'components'
import Link from 'next/link'
import React from 'react'

const Welcome = () => {
  return (
    <Layout title="Welcome">
      <div>
        <h1 className="text-3xl text-center mb-4 text-neutral-800">Welcome to TaskFolw 🎉</h1>
        <Link href="/dashboard">
          <p className="text-lg text-center mt-4 text-neutral-800 hover:text-blue-400">
            Go to dashboard
          </p>
        </Link>
      </div>
    </Layout>
  )
}

export default Welcome
