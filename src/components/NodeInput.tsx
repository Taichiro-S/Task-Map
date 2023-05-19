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
  //   console.log('input')
  const { label, id } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const updateNodeLabel = useStore((state) => state.updateNodeLabel)
  //   useLayoutEffect(() => {
  //     if (inputRef.current) {
  //       inputRef.current.style.width = charLengthCalc(label, 10, 17)
  //     }
  //   }, [label])
  const inputWidth = charLengthCalc(label, 10, 17, 50)

  return (
    <div>
      <input
        defaultValue={label}
        className="nodrag customNodeInput"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateNodeLabel(id, e.target.value)
        }
        // ref={inputRef}
        style={{ width: inputWidth }}
      />
    </div>
  )
}

export default NodeInput
