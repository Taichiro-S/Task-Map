import {
  CheckCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  NoSymbolIcon,
  ExclamationCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { FC, memo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { NodeInput, TaskNodeToolBarTop, TaskNodeToolBarBottom } from 'components'
import { statusList } from 'constants/statusList'
import { useFlowStore } from 'stores/flowStore'

const TaskNode: FC<NodeProps> = (props) => {
  // console.log('node')
  const { id, data, selected } = props
  const nodes = useFlowStore((state) => state.nodes)
  const setNodeOpen = useFlowStore((state) => state.setNodeOpen)
  const node = nodes.find((n) => n.id === id)
  if (!node) return null
  const noteStatusColorCode = statusList.find(
    (status) => status.statusName === node.data.status,
  )?.statusColorCode
  return (
    <>
      <TaskNodeToolBarTop {...props} />
      <TaskNodeToolBarBottom {...props} />
      <div
        className={
          selected
            ? `rounded-lg  border-2 border-blue-400 px-2 py-1}`
            : 'rounded-lg  border-2 border-neutral-400 px-2 py-1}'
        }
        style={{ backgroundColor: data.color }}
      >
        <div className="flex justify-center items-center h-6 relative z-10">
          <div className="bg-transparent w-3 h-full mr-0.5 flex items-center">
            <svg viewBox="0 0 24 24">
              <path
                fill="#333"
                stroke="#333"
                strokeWidth="1"
                d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
              />
            </svg>
          </div>
          <span className="my-auto mr-1">
            {node.data.status === 'doing' && (
              <PlayCircleIcon
                className={`h-4 w-4 text-white leading-none rounded-full`}
                style={{ backgroundColor: noteStatusColorCode }}
              />
            )}
            {node.data.status === 'done' && (
              <CheckCircleIcon
                className="h-4 w-4 text-white leading-none rounded-full"
                style={{ backgroundColor: noteStatusColorCode }}
              />
            )}
            {node.data.status === 'waiting' && (
              <NoSymbolIcon
                className="h-4 w-4 text-white leading-none rounded-full"
                style={{ backgroundColor: noteStatusColorCode }}
              />
            )}
            {node.data.status === 'pending' && (
              <PauseCircleIcon
                className="h-4 w-4 text-white leading-none rounded-full"
                style={{ backgroundColor: noteStatusColorCode }}
              />
            )}
            {node.data.status === 'FYA' && (
              <ExclamationCircleIcon
                className="h-4 w-4 text-white leading-none rounded-full"
                style={{ backgroundColor: noteStatusColorCode }}
              />
            )}
          </span>
          <NodeInput label={data.label} id={id} />
          {/* {data.open ? (
            <ChevronDownIcon
              className="text-gray-400 cursor-pointer hover:text-blue-700 h-4 w-4 nodrag"
              onClick={(e) => {
                e.stopPropagation()
                setNodeOpen(id)
              }}
            />
          ) : (
            <ChevronUpIcon
              className="text-gray-400 cursor-pointer hover:text-blue-700 h-4 w-4 nodrag"
              onClick={(e) => {
                e.stopPropagation()
                setNodeOpen(id)
              }}
            />
          )} */}
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
    </>
  )
}

export default memo(TaskNode)
