import { NextPage } from 'next'
import React, { useEffect } from 'react'
import { useQuerySessionUser, useQueryNode } from 'hooks'
import { Layout, MenuBar, Spinner } from 'components'
import { useRouter } from 'next/router'

const Flow: NextPage = () => {
  const router = useRouter()
  const userId = router.query.userId as string
  const workspaceId = router.query.workspaceId as string
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const {
    data: nodeDatas,
    error: nodeError,
    isLoading: nodeIsLoading,
    refetch,
  } = useQueryNode(sessionUser, workspaceId)

  // console.log('userId', userId, 'workspaceId', workspaceId)
  // console.log('sessionUser', sessionUser)

  useEffect(() => {
    if (!sessionUser && !sessionUserIsLoading) {
      router.push('/login')
    } else if (sessionUser && sessionUser.id !== userId) {
      router.push('/dashboard')
    }
  }, [sessionUser, sessionUserIsLoading, router])

  useEffect(() => {
    refetch()
  }, [router.asPath])

  if (sessionUserError || nodeError) {
    console.log(sessionUserError, nodeError)
    return (
      <Layout title="Flow">
        <p>データ取得失敗</p>
      </Layout>
    )
  }

  if (sessionUserIsLoading || nodeIsLoading) {
    return (
      <Layout title="Flow">
        <Spinner />
      </Layout>
    )
  }

  console.log(nodeDatas)

  return (
    <Layout title="Flow">
      <div>データ取得成功</div>
      <div>
        <ul>
          {nodeDatas?.map((nodeData) => (
            <li key={nodeData.id}>{nodeData.id}</li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default Flow
