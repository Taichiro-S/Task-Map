import React, { FC, memo } from 'react'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { charLengthCalc } from 'utils/charLengthCalc'
import { NodeInputProps } from 'types/types'
import Tooltip from '@mui/material/Tooltip'

const GroupingNodeInput: FC<NodeInputProps> = (props) => {
  const { label, id } = props
  const updateNodeLabel = useFlowStore((state) => state.updateNodeLabel)
  const [tooltipOpen, setTooltipOpen] = React.useState<boolean>(false)

  const inputWidth = charLengthCalc(label, 8, 12, 30)
  return (
    <Tooltip open={tooltipOpen} title="Max 20 characters" placement="top">
      <input
        onChange={(e) => {
          updateNodeLabel(id, e.target.value)
          if (e.target.value.length === 20) setTooltipOpen(true)
          setTimeout(() => {
            setTooltipOpen(false)
          }, 2000)
        }}
        defaultValue={label}
        className="bg-transparent w-6 h-4 outline-none border-slate-600 text-xs font-mono mx-1"
        style={{ width: inputWidth }}
        maxLength={20}
      />
    </Tooltip>
  )
}

export default memo(GroupingNodeInput)
