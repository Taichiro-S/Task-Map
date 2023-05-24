import { memo } from 'react'
import {
  NodeProps,
  NodeResizeControl,
  ResizeDragEvent,
  ResizeParamsWithDirection,
  ControlPosition,
  ResizeParams,
} from 'reactflow'
import '@reactflow/node-resizer/dist/style.css'
import useStore from 'store'
import GroupNodeInput from './GroupNodeInput'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
const GroupingNode = (props: NodeProps) => {
  const setNodesUnselected = useStore((state) => state.setNodesUnselected)
  const setEdgesUnselected = useStore((state) => state.setEdgesUnselected)

  const { id, data, selected } = props
  const resizePositions: ControlPosition[] = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'left',
    'right',
    'top',
    'bottom',
  ]
  const resizeGroupingNode = useStore((state) => state.resizeGroupingNode)
  const setParentNodeOnNodeResize = useStore(
    (state) => state.setParentNodeOnNodeResize,
  )
  return (
    <>
      <DragIndicatorIcon className="grouping-node-drag-handle text-white  bg-fuchsia-600 bg-opacity-40 rounded-l-lg border-y-2 border-l-2 border-slate-300 relative top-7 -left-6" />

      <div
        className={
          selected
            ? 'border-2 rounded-lg border-fuchsia-800  relative justify-center items-center bg-fuchsia-300 bg-opacity-40 nodrag grouping-node'
            : 'border-2 rounded-lg border-slate-300 relative justify-center items-center bg-fuchsia-300 bg-opacity-40 nodrag grouping-node'
        }
        style={{
          width: `${data.width}px`,
          height: `${data.height}px`,
          zIndex: 0,
        }}
        onClick={() => {
          setEdgesUnselected()
          setNodesUnselected()
        }}
      >
        <GroupNodeInput label={data.label} id={id} />
        {resizePositions.map((position) => (
          <NodeResizeControl
            key={position}
            position={position}
            minWidth={100}
            minHeight={100}
            style={{
              background: 'transparent',
              border: 'none',
            }}
            onResize={(
              event: ResizeDragEvent,
              params: ResizeParamsWithDirection,
            ) => {
              resizeGroupingNode(id, params.width, params.height)
            }}
            onResizeEnd={(event: ResizeDragEvent, params: ResizeParams) => {
              setParentNodeOnNodeResize(id)
            }}
          />
        ))}
      </div>
    </>
  )
}

export default memo(GroupingNode)
