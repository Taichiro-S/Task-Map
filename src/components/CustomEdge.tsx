import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow'

export default function CustomEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY - 20,
    targetX,
    targetY,
  })

  return <BaseEdge path={edgePath} {...props} />
}

export const connectionLineStyle = { stroke: '#808080', strokeWidth: 1 }
export const defaultEdgeOptions = { style: connectionLineStyle, type: 'custom' }
