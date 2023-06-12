import { FlowState, useFlowStore } from 'stores/flowStore'
import { ChangeEvent, FC, memo, useState } from 'react'
import { EdgeProps, getStraightPath, getSimpleBezierPath, EdgeLabelRenderer } from 'reactflow'
import { charLengthCalc } from 'utils/charLengthCalc'
import Tooltip from '@mui/material/Tooltip'

const EdgeInput: FC<EdgeProps> = (props) => {
  const updateEdgeLabel = useFlowStore((state) => state.updateEdgeLabel)
  const { sourceX, sourceY, targetX, targetY, data, selected, id } = props
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY: sourceY - 20,
    targetX,
    targetY,
  })
  const inputWidth = charLengthCalc(data.label, 8, 13, 30)

  if (selected) {
    return (
      <>
        <path id={id} className="react-flow__edge-path" d={edgePath} />
        <EdgeLabelRenderer>
          <div>
            <Tooltip open={tooltipOpen} title="Max 20 characters" placement="top">
              <input
                className={`nodrag absolute z-10 text-center border-none outline-none bg-white text-black text-xs h-5 rounded-sm ${
                  selected ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
                style={{
                  transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                  width: `${inputWidth}px`,
                }}
                defaultValue={data.label}
                maxLength={20}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  updateEdgeLabel(id, e.target.value)
                  if (e.target.value.length >= 20) setTooltipOpen(true)
                  setTimeout(() => {
                    setTooltipOpen(false)
                  }, 2000)
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                }}
              />
            </Tooltip>
          </div>
        </EdgeLabelRenderer>
      </>
    )
  }
  return null
}

export default memo(EdgeInput)
