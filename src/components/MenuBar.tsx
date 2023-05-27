import { useMutateNode, useMutateEdge } from 'hooks'
import { DragEvent, FC, memo } from 'react'
import { User } from '@supabase/supabase-js'
import { toast } from 'react-toastify'

const MenuBar: FC<{ user: User | null | undefined }> = (props) => {
  const { user } = props
  const { saveNodeMutation } = useMutateNode()
  const { saveEdgeMutation } = useMutateEdge()
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-1/2 h-1/10 bg-white absolute bottom-20 right-20 z-50 rounded-2xl drop-shadow-md">
      <button
        className="w-10 h-10 bg-blue-500  text-white"
        onClick={() => {
          if (!user || user === null) return toast.error('セーブするためにはログインしてください')
          saveNodeMutation.mutate(user.id)
          saveEdgeMutation.mutate(user.id)
        }}
      >
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
