import { useMutateFlow, useQuerySessionUser } from 'hooks'
import { DragEvent, FC, memo, useEffect, useState } from 'react'
import { errorToast, updateWithSuccessToast, updateWithErrorToast } from 'utils/toast'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import Button from '@mui/material/Button'
import { useTemporalStore } from 'stores/temporalStore'
import Tooltip from '@mui/material/Tooltip'

const MenuBar: FC<{ workspaceId: string | null }> = ({ workspaceId }) => {
  const {
    data: sessionUser,
    error: sessionUserError,
    isLoading: sessionUserIsLoading,
  } = useQuerySessionUser()
  const { saveFlowMutation } = useMutateFlow()
  const { undo, redo, pause, resume, futureStates, pastStates, clear } = useTemporalStore(
    (state) => state,
  )
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
  // console.log(`past states: ${JSON.stringify(pastStates)}`)
  // console.log(`future states: ${JSON.stringify(futureStates)}`)

  const handleSave = () => {
    setIsSaving(true)
    if (!sessionUser || sessionUser === null || workspaceId === null) {
      setIsSaving(false)
      return errorToast('保存するためにはログインする必要があります')
    }
    saveFlowMutation.mutate(
      { user_id: sessionUser.id, workspaceId: workspaceId },
      {
        onSuccess: () => {
          updateWithSuccessToast('保存しました', 'flows')
          setIsSaving(false)
        },
        onError: () => {
          updateWithErrorToast('保存に失敗しました', 'flows')
          setIsSaving(false)
        },
      },
    )
  }

  return (
    <div className="max-w-lg min-w-fit h-1/10 p-2 bg-neutral-50 absolute bottom-20 rounded-2xl drop-shadow-md flex items-center justify-between">
      <Tooltip title="Drag to add TaskNode" placement="top">
        <div
          className="dndnode input cursor-grab rounded-lg border-2 h-8 ml-2 mr-2 border-neutral-300 hover:border-neutral-600 px-2 py-1 flex items-center"
          onDragStart={(event) => onDragStart(event, 'custom')}
          draggable
        >
          <div className="bg-transparent w-5 mr-0.5 h-full flex items-center">
            <svg viewBox="0 0 24 24">
              <path
                fill="#333"
                stroke="#333"
                strokeWidth="1"
                d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
              />
            </svg>
          </div>
          <div className="text-base text-neutral-800">Task</div>
        </div>
      </Tooltip>
      <Tooltip title="Drag to add GroupNode" placement="top">
        <div
          className="dndnode input cursor-grab rounded-lg border-2 h-8 mr-2 border-neutral-300 hover:border-neutral-600 px-2 py-1 flex items-center"
          onDragStart={(event) => onDragStart(event, 'grouping')}
          draggable
        >
          <div className="bg-transparent w-5 mr-0.5 h-full flex items-center">
            <svg viewBox="0 0 24 24">
              <path
                fill="#333"
                stroke="#333"
                strokeWidth="1"
                d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
              />
            </svg>
          </div>
          <div className="text-base text-neutral-800">Group</div>
        </div>
      </Tooltip>
      {/* <Button variant="outlined" color="primary" startIcon={<SkipPreviousOutlinedIcon />} onClick={() => undo()}>
        Undo
      </Button>
      <Button variant="outlined" color="primary" startIcon={<SkipNextOutlinedIcon />} onClick={() => redo()}>
        Redo
      </Button> */}
      {workspaceId && (
        <Button
          variant="outlined"
          color="primary"
          disabled={isSaving}
          size="small"
          startIcon={
            isSaving ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
            ) : (
              <SaveAltIcon />
            )
          }
          onClick={handleSave}
        >
          <p className="font-mono w-12">{isSaving ? '保存中' : '保存'}</p>
        </Button>
      )}
    </div>
  )
}
export default memo(MenuBar)
