import { useMutateNode, useMutateEdge, useMutateFlow, useQuerySessionUser } from 'hooks'
import { DragEvent, FC, memo, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { toastSettings } from 'utils/authToast'
import Spinner from './Spinner'

const MenuBar: FC<{ workspaceId: string | null }> = ({ workspaceId }) => {
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const { saveNodeMutation } = useMutateNode()
  const { saveEdgeMutation } = useMutateEdge()
  const { saveFlowMutation } = useMutateFlow()
  const successToast = (message: string) => {
    toast.success(message, toastSettings)
  }
  const errorToast = (message: string) => {
    toast.error(message, toastSettings)
  }
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleSave = () => {
    if (!sessionUser || sessionUser === null || workspaceId === null) {
      return errorToast('保存するためにはログインする必要があります')
    }
    saveFlowMutation.mutate(
      { user_id: sessionUser.id, workspaceId: workspaceId },
      {
        onSuccess: () => {
          successToast('保存しました')
        },
        onError: () => {
          errorToast('保存に失敗しました')
        },
      },
    )
    // saveNodeMutation.mutate(
    //   { user_id: sessionUser.id, workspaceId: workspaceId },
    //   {
    //     onSuccess: () => {
    //       saveEdgeMutation.mutate(
    //         { user_id: sessionUser.id, workspaceId: workspaceId },
    //         {
    //           onSuccess: () => {
    //             successToast('保存しました')
    //           },
    //           onError: () => {
    //             errorToast('保存に失敗しました')
    //           },
    //         },
    //       )
    //     },
    //     onError: () => {
    //       errorToast('保存に失敗しました')
    //     },
    //   },
    // )
  }

  return (
    <div className="w-1/2 h-1/10 bg-white absolute bottom-20 right-20 z-50 rounded-2xl drop-shadow-md">
      <button className="w-10 h-10 bg-blue-500  text-white" onClick={handleSave}>
        Save
      </button>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'custom')} draggable>
        Normal Node
      </div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'grouping')} draggable>
        Grouping Node
      </div>
    </div>
  )
}
export default memo(MenuBar)
