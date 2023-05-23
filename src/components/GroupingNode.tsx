import { memo, useEffect, useState } from 'react'
import {
  Handle,
  NodeProps,
  NodeToolbar,
  NodeResizeControl,
  Position,
  ResizeDragEvent,
  ResizeParamsWithDirection,
  ControlPosition,
} from 'reactflow'
import LooksIcon from '@mui/icons-material/Looks'
import { NodeResizer } from '@reactflow/node-resizer'
import '@reactflow/node-resizer/dist/style.css'
import useStore from 'store'
import GroupNodeInput from './GroupNodeInput'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import PanToolIcon from '@mui/icons-material/PanTool'
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
  // const updateNodeZIndex = useStore((state) => state.updateNodeZIndex)

  // useEffect(() => {
  //   if (selected) {
  //     // Increase zIndex while node is selected (being dragged)
  //     updateNodeZIndex(id, 0)
  //   } else {
  //     // Reset zIndex after dragging
  //     updateNodeZIndex(id, data.zIndex)
  //   }
  // }, [selected])
  return (
    <>
      <DragIndicatorIcon className="grouping-node-drag-handle text-white  bg-fuchsia-600 bg-opacity-40 rounded-l-lg border-y-2 border-l-2 border-slate-300 relative top-7 -left-6" />
      {/* <span className="grouping-node-drag-handle block w-full h-1 rounded-md bg-slate-400 relative top-1 " /> */}

      <div
        className={
          selected
            ? 'border-2 rounded-lg border-fuchsia-800  relative justify-center items-center bg-fuchsia-300 bg-opacity-40 nodrag grouping-node'
            : 'border-2 rounded-lg border-slate-300 relative justify-center items-center bg-fuchsia-300 bg-opacity-40 nodrag grouping-node'
        }
        style={{
          width: data.width,
          height: data.height,
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
          ></NodeResizeControl>
        ))}
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </>
  )
}

export default memo(GroupingNode)
