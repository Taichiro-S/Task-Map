import { FC, memo, use, useEffect, useState } from 'react'
import {
  NodeProps,
  NodeResizeControl,
  ResizeDragEvent,
  ResizeParamsWithDirection,
  ControlPosition,
  ResizeParams,
  Node,
} from 'reactflow'
import '@reactflow/node-resizer/dist/style.css'
import useStore from 'stores/flowStore'
import { GroupingNodeInput } from 'components'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

const GroupingNode: FC<NodeProps> = (props) => {
  const { id, data, selected } = props
  const [childNodes, setChildNodes] = useState<Node[]>([])
  const [prevChildNodes, setPrevChildNodes] = useState<Node[]>([])
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [resizeStart, setResizeStart] = useState<boolean>(false)
  const [resizeCount, setResizeCount] = useState<number>(0)

  useEffect(() => {
    const nodes = useStore.getState().nodes
    const child = nodes.filter((node) => node.parentNode === id)
    setChildNodes(child)
  }, [isResizing])
  useEffect(() => {
    const nodes = useStore.getState().nodes
    const child = nodes.filter((node) => node.parentNode === id)
    setPrevChildNodes(child)
  }, [resizeCount])
  useEffect(() => {
    if (resizeStart) {
      // console.log('resize start')
      // console.log(childNodes)
      setParentNodeOnNodeResizeStart(childNodes, id)
      setResizeStart(false)
    } else {
      // console.log('resize end')
      // console.log(prevChildNodes)
      setParentNodeOnNodeResizeEnd(prevChildNodes, id)
    }
  }, [childNodes])
  const setNodesUnselected = useStore((state) => state.setNodesUnselected)
  const setEdgesUnselected = useStore((state) => state.setEdgesUnselected)
  const setParentNodeOnNodeResizeStart = useStore((state) => state.setParentNodeOnNodeResizeStart)
  const resizeGroupingNode = useStore((state) => state.resizeGroupingNode)
  const setParentNodeOnNodeResizeEnd = useStore((state) => state.setParentNodeOnNodeResizeEnd)

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
        <GroupingNodeInput label={data.label} id={id} />
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
            onResizeStart={(event: ResizeDragEvent, params: ResizeParams) => {
              setIsResizing(true)
              setResizeStart(true)
              setResizeCount((prev) => prev + 1)
            }}
            onResize={(event: ResizeDragEvent, params: ResizeParamsWithDirection) => {
              resizeGroupingNode(id, params.width, params.height)
            }}
            onResizeEnd={(event: ResizeDragEvent, params: ResizeParams) => {
              setIsResizing(false)
              setParentNodeOnNodeResizeEnd(childNodes, id)
            }}
          />
        ))}
      </div>
    </>
  )
}

export default memo(GroupingNode)
