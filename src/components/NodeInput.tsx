import React, { useEffect } from 'react'
import {
  useCallback,
  ChangeEvent,
  useState,
  useRef,
  useLayoutEffect,
} from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import useStore from '@/store'
import {
  TrashIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/solid'
import { charLengthCalc } from '@/utils/charLengthCalc'

const NodeInput = (props: any) => {
  const { label, id } = props
  const updateNodeLabel = useStore((state) => state.updateNodeLabel)
  const setNodesUnselected = useStore((state) => state.setNodesUnselected)

  const inputWidth = charLengthCalc(label, 10, 17, 50)

  return (
    <div>
      <input
        defaultValue={label}
        className="nodrag border-none outline-none rounded-sm font-bold bg-transparent h-full text-[#131313]"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateNodeLabel(id, e.target.value)
        }
        style={{ width: inputWidth }}
        onClick={() => setNodesUnselected()}
      />
    </div>
  )
}

export default NodeInput
