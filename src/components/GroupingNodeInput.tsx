import React, { FC, memo } from 'react'
import useStore from 'stores/flowStore'
import { charLengthCalc } from 'utils/charLengthCalc'
import { NodeInputProps } from 'types/types'

const GroupingNodeInput: FC<NodeInputProps> = (props) => {
  const { label, id } = props
  const updateNodeLabel = useStore((state) => state.updateNodeLabel)
  const inputWidth = charLengthCalc(label, 8, 12, 30)
  return (
    <input
      onChange={(e) => {
        updateNodeLabel(id, e.target.value)
      }}
      defaultValue={label}
      className="bg-transparent w-6 h-4 outline-none border-slate-600 text-xs font-mono mx-1"
      style={{ width: inputWidth }}
    />
  )
}

export default memo(GroupingNodeInput)
