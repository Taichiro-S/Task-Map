import { useQuerySessionUser } from 'hooks'
import { FC, memo, useState } from 'react'
import { useFlowStore } from 'stores/flowStore'
import Card from '@mui/material/Card'
import SideBarAccordion from './SideBarAccordion'
import { motion } from 'framer-motion'
import { ChevronDoubleLeftIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import Button from '@mui/material/Button'

type Props = {
  workspaceId: string | null
  isSideBarOpen: boolean
  setIsSideBarOpen: (isSideBarOpen: boolean) => void
}

const SideBar: FC<Props> = (props) => {
  const { workspaceId, isSideBarOpen, setIsSideBarOpen } = props
  const nodes = useFlowStore((state) => state.nodes)
  const {
    data: sessionUser,
    error: sessionUserError,
    isLoading: sessionUserIsLoading,
  } = useQuerySessionUser()

  return (
    <div className="w-full h-full p-2 bg-neutral-50 rounded-2xl drop-shadow-md relative overflow-auto">
      {/* <div className="flex items-center w-full rounded-lg bg-slate-800 mb-2"> */}
      <div className="text-md font-medium font-zenMaruGothic p-2 text-center text-neutral-100 rounded-lg bg-slate-800 mb-2">
        タスク一覧
        {/* </div> */}
        <ChevronDoubleLeftIcon
          className="cursor-pointer hover:text-blue-500 h-5 w-5 text-gray-300"
          style={{
            position: 'absolute',
            top: workspaceId ? '18px' : '18px',
            left: workspaceId ? '290px' : '210px',
          }}
          onClick={() => setIsSideBarOpen(false)}
        />
      </div>

      {nodes.map((node) => {
        if (node.type === 'task' && node.parentNode === '') {
          return (
            <Card key={node.id} className="p-2 m-2">
              <div>{node.data.label === '' ? 'New Task' : node.data.label}</div>
            </Card>
          )
        } else if (node.type === 'grouping') {
          const parentId = node.id
          return (
            <SideBarAccordion key={node.id} title={node.data.label} color={node.data.colorCode}>
              {nodes.map((node) => {
                if (node.type === 'task' && node.parentNode === parentId) {
                  return (
                    <Card key={node.id} className="p-2 m-2">
                      <div>{node.data.label === '' ? 'New Task' : node.data.label}</div>
                    </Card>
                  )
                }
              })}
            </SideBarAccordion>
          )
        }
      })}
    </div>
  )
}
export default memo(SideBar)
