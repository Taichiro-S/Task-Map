import { memo } from 'react'
import { Handle, Position, NodeResizer, NodeProps } from 'reactflow'

const ResizableNode = (props: NodeProps) => {
  return (
    <>
      <NodeResizer minWidth={100} minHeight={30} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{props.data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  )
}

export default memo(ResizableNode)
