import { useQueryClient } from '@tanstack/react-query'
import { Layout } from 'components'
import { useQuerySessionUser } from 'hooks'
import { NextPage } from 'next'
import Image from 'next/image'
import { useEffect } from 'react'
import { useFlowStore } from 'stores/flowStore'

const Home: NextPage = () => {
  const queryClient = useQueryClient()
  const resetFlow = useFlowStore((state) => state.resetFlow)

  const {
    data: sessionUser,
    error: sessionUserError,
    isLoading: sessionUserIsLoading,
  } = useQuerySessionUser()
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['flows'], exact: true })
    queryClient.removeQueries({ queryKey: ['workspaces'], exact: true })
    resetFlow()
  }, [])
  return (
    <Layout title="Home">
      <div>Home</div>
      <p>準備中...</p>
    </Layout>
  )
}

export default Home
