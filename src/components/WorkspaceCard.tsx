import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { FC, memo } from 'react'
import { WorkspaceData } from 'types/types'
import Link from 'next/link'
import { Spinner, WorkspaceFormDialog } from 'components'
import { User } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { getNodes, useQuerySessionUser } from 'hooks'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
type Props = {
  workspaceData: WorkspaceData
  // user?: User | null
}

const WorkspaceCard: FC<Props> = ({ workspaceData }) => {
  const router = useRouter()
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const queryClient = useQueryClient()
  const handleClick = async () => {
    // await queryClient.prefetchQuery(['nodes'], () => {
    //   return getNodes(sessionUser, workspaceData.id)
    // })
    router.push(`/workspace/${workspaceData.user_id}/${workspaceData.id}`)
  }
  if (sessionUserIsLoading) return <Spinner />
  if (sessionUserError) return <div>error</div>
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <h3 className="text-xl font-bold m-2">
          <span className="cursor-pointer hover:text-blue-600" onClick={handleClick}>
            {workspaceData.title}
          </span>
        </h3>
        <p className="p-2 border-2 m-2">{workspaceData.description}</p>
        {workspaceData.public ? (
          <div className="">
            <PublicIcon color="success" fontSize="small" className="ml-2" />
            <span className="text-sm ml-2 text-gray-600">公開されています</span>
          </div>
        ) : (
          <>
            <LockIcon color="secondary" fontSize="small" className="ml-2" />
            <span className="text-sm ml-2 text-gray-600">非公開です</span>
          </>
        )}
        <p className="text-sm text-gray-600 m-2">最終更新日: {workspaceData.updated_at}</p>
        <Stack direction="row-reverse" spacing={1}>
          <WorkspaceFormDialog workspaceData={workspaceData} isDelete={true} />
          <WorkspaceFormDialog workspaceData={workspaceData} isDelete={false} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default memo(WorkspaceCard)
