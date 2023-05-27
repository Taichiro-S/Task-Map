import React, { ChangeEvent, FC, memo } from 'react'
import { NodeInputProps } from 'types/types'
import useStore from 'stores/flowStore'
import { charLengthCalc } from 'utils/charLengthCalc'

const NodeInput: FC<NodeInputProps> = (props) => {
  const { label, id } = props
  const updateNodeLabel = useStore((state) => state.updateNodeLabel)
  const setNodesUnselected = useStore((state) => state.setNodesUnselected)

  const inputWidth = charLengthCalc(label, 10, 17, 50)

  return (
    <div>
      <input
        defaultValue={label}
        className="nodrag border-none outline-none rounded-sm font-bold bg-transparent h-full text-[#131313]"
        onChange={(e: ChangeEvent<HTMLInputElement>) => updateNodeLabel(id, e.target.value)}
        style={{ width: inputWidth }}
        onClick={() => setNodesUnselected()}
      />
    </div>
  )
}

export default memo(NodeInput)
