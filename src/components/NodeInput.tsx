import React, { ChangeEvent, FC, memo } from 'react'
import { NodeInputProps } from 'types/types'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { charLengthCalc } from 'utils/charLengthCalc'
import Tooltip from '@mui/material/Tooltip'

const NodeInput: FC<NodeInputProps> = (props) => {
  const { label, id } = props
  const updateNodeLabel = useFlowStore((state) => state.updateNodeLabel)
  const setNodesUnselected = useFlowStore((state) => state.setNodesUnselected)
  const [tooltipOpen, setTooltipOpen] = React.useState<boolean>(false)
  const inputWidth = charLengthCalc(label, 10, 17, 50)

  return (
    <Tooltip open={tooltipOpen} title="Max 30 characters" placement="top">
      <input
        defaultValue={label}
        maxLength={30}
        className="nodrag border-none outline-none rounded-sm font-semibold bg-transparent h-full text-neutral-700 font-mono"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          updateNodeLabel(id, e.target.value)
          if (e.target.value.length >= 30) setTooltipOpen(true)
          setTimeout(() => {
            setTooltipOpen(false)
          }, 2000)
        }}
        style={{ width: `${inputWidth}px` }}
        max={30}
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

export default memo(NodeInput)
