import useStore from 'stores/flowStore'
import { ChangeEvent, FC, memo } from 'react'
import { EdgeProps, getStraightPath, EdgeLabelRenderer } from 'reactflow'
import { charLengthCalc } from 'utils/charLengthCalc'

const EdgeInput: FC<EdgeProps> = (props) => {
  const updateEdgeLabel = useStore((state) => state.updateEdgeLabel)
  const { sourceX, sourceY, targetX, targetY, data, selected, id } = props
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY: sourceY - 20,
    targetX,
    targetY,
  })
  const inputWidth = charLengthCalc(data.label, 8, 10, 30)

  if (selected) {
    return (
      <>
        <path id={id} className="react-flow__edge-path" d={edgePath} />
        <EdgeLabelRenderer>
          <div>
            <input
              className={`nodrag absolute z-10 text-center border-none outline-none bg-white text-black text-xs h-5 rounded-sm ${
                selected ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                width: inputWidth,
              }}
              defaultValue={data.label}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateEdgeLabel(id, e.target.value)}
              onMouseDown={(e) => {
                e.stopPropagation()
              }}
            />
          </div>
        </EdgeLabelRenderer>
      </>
    )
  }
  return null
}

export default memo(EdgeInput)
