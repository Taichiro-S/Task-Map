import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { FC, memo } from 'react'
import { WorkspaceData } from 'types/types'
import { Spinner, WorkspaceFormDialog } from 'components'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useQueryAuth, useQueryWorkspace } from 'hooks'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import { formatDateTime } from 'utils/dateTimeFormat'
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline'

type Props = {
  workspaceData: WorkspaceData
  // user?: User | null
}

const WorkspaceCard: FC<Props> = ({ workspaceData }) => {
  const router = useRouter()
  const { data: authUser, error: authUserError, isLoading: authUserIsLoading } = useQueryAuth()
  const queryClient = useQueryClient()
  const handleClick = async () => {
    router.push(`/workspace/${workspaceData.user_id}/${workspaceData.id}`)
  }
  const update_at = formatDateTime(workspaceData.updated_at)
  if (authUserIsLoading) return <Spinner />
  if (authUserError) return <div>error</div>
  // console.log(workspaceData)
  return (
    <Card sx={{ width: '100%', maxWidth: 600, minWidth: 400 }}>
      <CardContent>
        <h3 className="text-xl font-bold m-2 flex items-center " onClick={handleClick}>
          <span className="cursor-pointer hover:text-blue-600 mr-2">{workspaceData.title}</span>
          <ArrowRightCircleIcon className="h-6 w-6 text-blue-600 font-semibold cursor-pointer" />
        </h3>
        <p className="p-0.5 m-2 font-zenMaruGothicMono">{workspaceData.description}</p>
        {workspaceData.public ? (
          <div className="bg-neutral-100 rounded-md p-0.5 ml-2 w-44">
            <PublicIcon color="success" fontSize="small" className="ml-2" />
            <span className="text-sm ml-2 text-gray-600">公開されています</span>
          </div>
        ) : (
          <div className="bg-neutral-100 rounded-md p-0.5 ml-2 w-32">
            <LockIcon color="secondary" fontSize="small" className="ml-2" />
            <span className="text-sm ml-2 text-gray-600">非公開です</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="pt-1 text-sm text-gray-600 m-2">最終更新日: {update_at}</span>
          <div className="flex justify-end">
            <WorkspaceFormDialog workspaceData={workspaceData} isDelete={false} />
            <WorkspaceFormDialog workspaceData={workspaceData} isDelete={true} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default memo(WorkspaceCard)
