import { useQueryClient } from '@tanstack/react-query'
import { Layout, Spinner, WorkspaceFormDialog, WorkspaceCard } from 'components'
import { useQuerySessionUser, useQueryWorkspace, useMutateWorkspace } from 'hooks'
import { NextPage } from 'next'
import router from 'next/router'
import React, { useEffect } from 'react'
import { useFlowStore } from 'stores/flowStore'
import { successToast } from 'utils/toast'

const Dashboard: NextPage = () => {
  const queryClient = useQueryClient()
  const {
    data: sessionUser,
    error: sessionUserError,
    isLoading: sessionUserIsLoading,
  } = useQuerySessionUser()
  const {
    data: workspaceDatas,
    error: workspaceError,
    isLoading: workspaceIsLoading,
    refetch: refetchWorkspace,
  } = useQueryWorkspace()
  const resetFlow = useFlowStore((state) => state.resetFlow)
  useEffect(() => {
    if (!sessionUserIsLoading && !sessionUser) {
      console.log('sessionUser', sessionUser)
      // successToast('セッションの有効期限が切れました')
      router.push('/')
    }
  }, [sessionUser, sessionUserIsLoading])

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['flows'], exact: true })
    resetFlow()
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
        <div>データの読み込みに失敗しました</div>
      </Layout>
    )
  }

  return (
    <div>
      <Layout title="Dashboard">
        <div className="mx-auto w-1/2 flex justify-center">
          <div>
            <div className="text-center">
              <WorkspaceFormDialog workspaceData={undefined} isDelete={false} />
            </div>
            <ul className="pl-0">
              {workspaceDatas?.map((workspaceData) => (
                <li className="list-none my-4 w-full" key={workspaceData.id}>
                  <WorkspaceCard workspaceData={workspaceData} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Dashboard
