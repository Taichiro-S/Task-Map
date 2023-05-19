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
import EdgeInput from './EdgeInput'

export default function CustomEdge(props: EdgeProps) {
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
  console
  return (
    <>
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
          display:
            selected || !data.label || data.label == '' ? 'none' : 'block',
        }}
      />
      <EdgeInput {...props} />
    </>
  )
}

export const connectionLineStyle = { stroke: '#808080', strokeWidth: 1 }
export const defaultEdgeOptions = { style: connectionLineStyle, type: 'custom' }
