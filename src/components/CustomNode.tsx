import { memo } from 'react'
import { Handle, NodeProps, NodeToolbar, Position } from 'reactflow'

import NodeInput from './NodeInput'
import CustomNodeToolBarTop from './CustomNodeToolBarTop'
import CustomNodeToolBarBottom from './CustomNodeToolBarBottom'
import useStore from 'store'
import { statusList } from 'config/statusList'
import {
  CheckCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  HandRaisedIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

const CustomNode = (props: NodeProps) => {
  // console.log('node')
  const { id, data, selected } = props
  const nodes = useStore((state) => state.nodes)
  const nodeColor = data.color || '#ffffff'
  const node = nodes.find((n) => n.id === id)
  if (!node) return null
  const noteStatusColorCode = statusList.find(
    (status) => status.statusName === node.data.status,
  )?.statusColorCode
  return (
    <>
      <CustomNodeToolBarTop {...props} />
      <CustomNodeToolBarBottom {...props} />
      <div
        className={
          selected
            ? 'border-2 rounded-full  border-blue-400  relative justify-center items-center'
            : 'border-2 rounded-full border-transparent  relative justify-center items-center'
        }
      >
        <div
          className={`rounded-full  border-2 border-stone-300 px-2 py-1 justify-center items-center`}
          style={{ backgroundColor: nodeColor }}
        >
          {node.data.status === 'doing' && (
            <PlayCircleIcon
              className={`h-4 w-4 text-white leading-none rounded-full absolute -translate-y-3/2 -translate-x-4 left-auto top-0`}
              style={{ backgroundColor: noteStatusColorCode }}
            />
          )}
          {node.data.status === 'done' && (
            <CheckCircleIcon
              className={`h-4 w-4 text-white leading-none rounded-full absolute -translate-y-3/2 -translate-x-4 left-auto top-0`}
              style={{ backgroundColor: noteStatusColorCode }}
            />
          )}
          {node.data.status === 'waiting' && (
            <HandRaisedIcon
              className={`h-4 w-4 text-white leading-none rounded-full absolute -translate-y-3/2 -translate-x-4 float-left top-0`}
              style={{ backgroundColor: noteStatusColorCode }}
            />
          )}
          {node.data.status === 'pending' && (
            <PauseCircleIcon
              className={`h-4 w-4 text-white leading-none rounded-full absolute -translate-y-3/2 -translate-x-4 left-auto top-0`}
              style={{ backgroundColor: noteStatusColorCode }}
            />
          )}
          {node.data.status === 'FYA' && (
            <ExclamationCircleIcon
              className={`h-4 w-4 text-white leading-none rounded-full absolute -translate-y-3/2 -translate-x-4 left-auto top-0`}
              style={{ backgroundColor: noteStatusColorCode }}
            />
          )}
          <div className="flex h-5 relative z-10">
            <div className="bg-transparent w-3.5 h-full mr-1 flex items-center">
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
          </div>
          <Handle
            style={{
              top: '50%',
              pointerEvents: 'none',
              opacity: 0,
            }}
            type="target"
            position={Position.Top}
          />
          <Handle
            // className="handleSource"
            style={{
              opacity: 0,
              top: 0,
              left: 0,
              transform: 'none',
              background: '#ffffff',
              height: '100%',
              width: '100%',
              borderRadius: '2px',
              border: 'none',
            }}
            type="source"
            position={Position.Bottom}
          />
        </div>
      </div>
    </>
  )
}

export default memo(CustomNode)
