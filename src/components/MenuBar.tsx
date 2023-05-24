import useStore, { RFState } from 'store'
import { useMutateNode } from 'hooks/useMutateNode'
import { useMutateEdge } from 'hooks/useMutateEdge'
import { useEffect, useState, DragEvent } from 'react'
import { supabase } from 'utils/supabase'
import Link from 'next/link'

const MenuBar = (userId: any) => {
  const { saveNodeMutation } = useMutateNode()
  const { saveEdgeMutation } = useMutateEdge()
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
  const addNewNode = useStore((state) => state.addNewNode)

  return (
    <div className="w-1/2 h-1/10 bg-white absolute bottom-20 right-20 z-50 rounded-2xl drop-shadow-md">
      <button
        className="w-10 h-10 bg-blue-500  text-white"
        onClick={() => {
          saveNodeMutation.mutate(userId.userId)
          saveEdgeMutation.mutate(userId.userId)
        }}
      >
        Save
      </button>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'custom')}
        draggable
      >
        Normal Node
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'grouping')}
        draggable
      >
        Groupin Node
      </div>
    </div>
  )
}
export default MenuBar
