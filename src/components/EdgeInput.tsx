import useStore from '@/store'
import { ChangeEvent, useLayoutEffect, useRef, useState } from 'react'
import {
  EdgeText,
  BaseEdge,
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
} from 'reactflow'
import { charLengthCalc } from '@/utils/charLengthCalc'

export default function EdgeInput(props: EdgeProps) {
  // console.log('edge')
  const updateEdgeLabel = useStore((state) => state.updateEdgeLabel)
  const { sourceX, sourceY, targetX, targetY, data, selected, id } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY: sourceY - 20,
    targetX,
    targetY,
  })
  const inputWidth = charLengthCalc(data.label, 7, 10, 30)

  if (selected) {
    return (
      <>
        <path id={id} className="react-flow__edge-path" d={edgePath} />
        <EdgeLabelRenderer>
          <div>
            <input
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                zIndex: 10,
                textAlign: 'center',
                border: 'none',
                outline: 'none',
                background: 'white',
                color: 'black',
                fontSize: '10px',
                height: '20px',
                borderRadius: '2px',
                width: inputWidth,
                pointerEvents: selected ? 'auto' : 'none',
              }}
              defaultValue={data.label}
              className="nodrag"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateEdgeLabel(id, e.target.value)
              }
              onMouseDown={(e) => {
                e.stopPropagation()
              }}
              ref={inputRef}
              autoFocus
              // className="nodrag nopan"
            />
          </div>
        </EdgeLabelRenderer>
      </>
    )
  }
  return null
}
