import React, { FC, memo } from 'react'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { charLengthCalc } from 'utils/charLengthCalc'
import { NodeInputProps } from 'types/types'
import Tooltip from '@mui/material/Tooltip'
import {
  ASCIIWidthForGroupingNode,
  japaneseWidthForGroupingNode,
  emptyWidthForGroupingNode,
} from 'constants/charLength'
const GroupingNodeInput: FC<NodeInputProps> = (props) => {
  const { label, id } = props
  const updateNodeLabel = useFlowStore((state) => state.updateNodeLabel)
  const [tooltipOpen, setTooltipOpen] = React.useState<boolean>(false)

  const inputWidth = charLengthCalc(
    label,
    ASCIIWidthForGroupingNode,
    japaneseWidthForGroupingNode,
    emptyWidthForGroupingNode,
  )
  return (
    <Tooltip open={tooltipOpen} title="Max 50 characters" placement="top">
      <input
        onChange={(e) => {
          updateNodeLabel(id, e.target.value)
          if (e.target.value.length === 50) setTooltipOpen(true)
          setTimeout(() => {
            setTooltipOpen(false)
          }, 2000)
        }}
        defaultValue={label}
        placeholder="New Group"
        className="bg-transparent w-6 h-4 outline-none border-slate-600 text-xs font-mono mx-1"
        style={{ width: inputWidth }}
        maxLength={50}
      />
    </Tooltip>
  )
}

export default memo(GroupingNodeInput)
