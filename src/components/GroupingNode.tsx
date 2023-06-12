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
// import '@reactflow/node-resizer/dist/style.css'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { GroupingNodeInput, GroupingNodeToolBarTop } from 'components'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { nodeColorList } from 'hoge/nodeColorList'

const GroupingNode: FC<NodeProps> = (props) => {
  const { id, data, selected } = props
  const [childNodes, setChildNodes] = useState<Node[]>([])
  const [prevChildNodes, setPrevChildNodes] = useState<Node[]>([])
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [resizeStart, setResizeStart] = useState<boolean>(false)
  const [resizeCount, setResizeCount] = useState<number>(0)

  useEffect(() => {
    const nodes = useFlowStore.getState().nodes
    const child = nodes.filter((node) => node.parentNode === id)
    setChildNodes(child)
  }, [isResizing])
  useEffect(() => {
    const nodes = useFlowStore.getState().nodes
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
  const setNodesUnselected = useFlowStore((state) => state.setNodesUnselected)
  const setEdgesUnselected = useFlowStore((state) => state.setEdgesUnselected)
  const setParentNodeOnNodeResizeStart = useFlowStore(
    (state) => state.setParentNodeOnNodeResizeStart,
  )
  const resizeGroupingNode = useFlowStore((state) => state.resizeGroupingNode)
  const setParentNodeOnNodeResizeEnd = useFlowStore((state) => state.setParentNodeOnNodeResizeEnd)
  const borderColor = nodeColorList.find((color) => color.colorCode === data.color)?.borderColorCode
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
      <GroupingNodeToolBarTop {...props} />
      <DragIndicatorIcon
        className="grouping-node-drag-handle text-white rounded-l-lg border-y-2 border-l-2 border-neutral-400 relative top-7 -left-6"
        style={{
          backgroundColor: data.color,
          opacity: 0.5,
        }}
      />

      <div
        className={
          selected
            ? 'border-2 rounded-lg h-full relative justify-center items-center bg-opacity-40 nodrag grouping-node'
            : 'border-2 rounded-lg h-full relative justify-center items-center bg-opacity-40 nodrag grouping-node'
        }
        style={{
          width: `${data.width}px`,
          height: `${data.height}px`,
          backgroundColor: data.color,
          borderColor: selected ? borderColor : '#a3a3a3',
          opacity: 0.5,
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
