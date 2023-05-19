import {
  useCallback,
  ChangeEvent,
  useState,
  useRef,
  useLayoutEffect,
  memo,
} from 'react'
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow'
import useStore from '@/store'
import {
  TrashIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/solid'
import NodeInput from './NodeInput'
import CustomNodeToolBar from './CustomNodeToolBar'

// import _ from 'lodash'

const CustomNode = (props: NodeProps) => {
  // console.log('node')
  const { id, data, selected } = props
  const nodeColor = data.color || 'white'
  return (
    <>
      <CustomNodeToolBar {...props} />
      <div
        className={
          selected
            ? 'border-2 rounded-full  border-blue-400  relative justify-center items-center'
            : 'border-2 rounded-full border-transparent  relative justify-center items-center'
        }
      >
        <div
          className={`rounded-full border-2 border-stone-300 px-2 py-1 justify-center items-center`}
          style={{ backgroundColor: nodeColor }}
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
            <NodeInput label={data.label} id={id} />
            {/* <input
            defaultValue={data.label}
            className="nodrag customNodeInput"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateNodeLabel(id, e.target.value)
            }
            ref={inputRef}
            // onChange={handleChange}
          /> */}
            {/* <ArrowTopRightOnSquareIcon className="h-6 w-6 text-gray-500" /> */}
          </div>
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Bottom} />
        </div>
      </div>
    </>
  )
}

export default memo(CustomNode)
