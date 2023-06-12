import { useQuerySessionUser } from 'hooks'
import { FC, memo, useState } from 'react'
import { useFlowStore } from 'stores/flowStore'
import Card from '@mui/material/Card'
import SideBarAccordion from './SideBarAccordion'
import { motion } from 'framer-motion'
import { PlusSmallIcon } from '@heroicons/react/24/outline'
import Button from '@mui/material/Button'

const SideBar: FC<{ workspaceId: string | null }> = ({ workspaceId }) => {
  const nodes = useFlowStore((state) => state.nodes)
  const {
    data: sessionUser,
    error: sessionUserError,
    isLoading: sessionUserIsLoading,
  } = useQuerySessionUser()

  return (
    <div className="max-w-lg min-w-fit h-full p-2 bg-neutral-50 rounded-2xl drop-shadow-md overflow-auto">
      <p className="flex justify-center items-center text-md font-medium font-zenMaruGothic p-2 text-center border rounded-lg bg-slate-800 text-neutral-100 mb-2">
        タスク一覧
      </p>
      {nodes.map((node) => {
        if (node.type === 'custom' && node.parentNode === '') {
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
                if (node.type === 'custom' && node.parentNode === parentId) {
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
