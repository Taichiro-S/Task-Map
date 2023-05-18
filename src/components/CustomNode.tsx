import {
  useCallback,
  ChangeEvent,
  useState,
  useRef,
  useLayoutEffect,
} from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { NodeDataType } from '@/types/types'
import useStore from '@/store'
import {
  TrashIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/solid'

type EventNodeProps = {
  id: string
  data: NodeDataType
  selected: boolean
}

export default function CustomNode({ id, data, selected }: EventNodeProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const updateNodeLabel = useStore((state) => state.updateNodeLabel)

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width =
        data.label.length * 10 < 30 ? ' 30px' : `${data.label.length * 10}px`
    }
  }, [data.label.length])
  return (
    <div
      className={
        selected
          ? 'border-2 border-blue-400 p-1 relative justify-center items-center'
          : 'border-2 border-transparent p-1 relative justify-center items-center'
      }
    >
      <div
        className={`rounded-full bg-white border-2 px-2 py-1 justify-center items-center`}
        style={{ borderColor: data.color }}
      >
        <div className="customNodeInputWrapper">
          <div className="customNodeDragHandle">
            {/* icon taken from grommet https://icons.grommet.io */}
            <svg viewBox="0 0 24 24">
              <path
                fill="#333"
                stroke="#333"
                strokeWidth="1"
                d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
              />
            </svg>
          </div>
          <input
            defaultValue={data.label}
            className="nodrag customNodeInput"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateNodeLabel(id, e.target.value)
            }
            ref={inputRef}
          />
          <ArrowTopRightOnSquareIcon className="h-6 w-6 text-gray-500" />
        </div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </div>
  )
}
