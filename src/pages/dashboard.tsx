import { useQueryClient } from '@tanstack/react-query'
import { Layout, Spinner, WorkspaceFormDialog, WorkspaceCard } from 'components'
import { useQuerySessionUser, useQueryWorkspace, useMutateWorkspace } from 'hooks'
import { NextPage } from 'next'
import router from 'next/router'
import React, { useEffect } from 'react'
import useStore from 'stores/flowStore'

const Dashboard: NextPage = () => {
  const queryClient = useQueryClient()
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const { data: workspaceDatas, error: workspaceError, isLoading: workspaceIsLoading } = useQueryWorkspace(sessionUser)
  const resetFlow = useStore((state) => state.resetFlow)
  useEffect(() => {
    if (!sessionUser && !sessionUserIsLoading) {
      router.push('/login')
    }
  }, [sessionUser, sessionUserIsLoading])

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['flows'], exact: true })
    resetFlow()
    console.log('nodes', useStore.getState().nodes)
  }, [])

  if (sessionUserIsLoading || workspaceIsLoading) {
    return (
      <Layout title="Dashboard">
        <Spinner />
      </Layout>
    )
  }

  if (sessionUserError || workspaceError) {
    return (
      <Layout title="Dashboard">
        <div>error</div>
      </Layout>
    )
  }

  return (
    <div>
      <Layout title="Dashboard">
        <div className="flex-wrap">
          <WorkspaceFormDialog workspaceData={undefined} isDelete={false} />
          <ul className="pl-0">
            {workspaceDatas?.map((workspaceData) => (
              <li className="list-none my-4" key={workspaceData.id}>
                <WorkspaceCard workspaceData={workspaceData} />
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </div>
  )
}

export default Dashboard
