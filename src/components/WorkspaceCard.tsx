import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { FC, memo } from 'react'
import { WorkspaceData } from 'types/types'
import Link from 'next/link'
import { WorkspaceFormDialog } from 'components'

const WorkspaceCard: FC<{ workspaceData: WorkspaceData }> = (props) => {
  const { workspaceData } = props
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <h3 className="text-xl font-bold m-2">
          <Link href={`/workspace/${workspaceData.id}`}>
            <span>{workspaceData.title}</span>
          </Link>
        </h3>
        <p className="p-2 border-2 m-2">{workspaceData.description}</p>
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
