import { FlowState, useFlowStore } from 'stores/flowStore'
import { FC, memo } from 'react'
import { EdgeText, BaseEdge, EdgeProps, getStraightPath } from 'reactflow'
import { EdgeInput } from 'components'

const CustomEdge: FC<EdgeProps> = (props) => {
  // console.log('edge')
  const updateEdgeAnimation = useFlowStore((state) => state.updateEdgeAnimation)
  const { sourceX, sourceY, targetX, targetY, data, selected, id } = props
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY: sourceY - 20,
    targetX,
    targetY,
  })
  return (
    <g onDoubleClick={() => updateEdgeAnimation(id)}>
      <BaseEdge path={edgePath} {...props} />
      <EdgeText
        x={sourceX + (targetX - sourceX) / 2}
        y={sourceY + (targetY - sourceY) / 2 - 10}
        label={data.label || ''}
        labelShowBg
        labelBgStyle={{ fill: 'white' }}
        labelBgPadding={[2, 4]}
        labelBgBorderRadius={2}
        style={{
          display: selected || !data.label || data.label == '' ? 'none' : 'block',
        }}
      />
      <EdgeInput {...props} />
    </g>
  )
}

export default memo(CustomEdge)
