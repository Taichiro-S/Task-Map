import React, { ChangeEvent, FC, memo } from 'react'
import { NodeInputProps } from 'types/types'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { charLengthCalc } from 'utils/charLengthCalc'
import Tooltip from '@mui/material/Tooltip'
import {
  ASCIIWidthForTaskNode,
  japaneseWidthForTaskNode,
  emptyWidthForTaskNode,
} from 'constants/charLength'

const TaskNodeInput: FC<NodeInputProps> = (props) => {
  const { label, id } = props
  const updateNodeLabel = useFlowStore((state) => state.updateNodeLabel)
  const editedNodeId = useFlowStore((state) => state.editedNodeId)
  const setNodesUnselected = useFlowStore((state) => state.setNodesUnselected)
  const [tooltipOpen, setTooltipOpen] = React.useState<boolean>(false)
  const inputWidth = charLengthCalc(
    label,
    ASCIIWidthForTaskNode,
    japaneseWidthForTaskNode,
    emptyWidthForTaskNode,
  )

  return (
    <Tooltip open={tooltipOpen} title="Max 50 characters" placement="top">
      <input
        placeholder="New Task"
        defaultValue={label}
        value={editedNodeId === '' ? undefined : label}
        maxLength={50}
        className="resize-none nodrag border-none outline-none rounded-sm text-sm font-semibold bg-transparent h-full text-neutral-700 font-mono"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          updateNodeLabel(id, e.target.value)
          if (e.target.value.length >= 50) setTooltipOpen(true)
          setTimeout(() => {
            setTooltipOpen(false)
          }, 2000)
        }}
        max={50}
        style={{ width: `${inputWidth}px` }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setNodesUnselected()
        }}
        onMouseUp={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      />
    </Tooltip>
  )
}

export default memo(TaskNodeInput)
