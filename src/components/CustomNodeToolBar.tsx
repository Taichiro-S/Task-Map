import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import React, { memo } from 'react'
import { NodeProps, NodeToolbar } from 'reactflow'
import useStore from '@/store'

const CustomNodeToolBar = (props: NodeProps) => {
  const { data, id } = props
  const updateColor = useStore((state) => state.updateNodeColor)
  const setEditedNoteId = useStore((state) => state.setEditedNoteId)
  const nodeColor = data.color || 'white'
  return (
    <NodeToolbar
      isVisible={data.toolbarVisible}
      position={data.toolbarPosition}
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        borderRadius: '5px',
        padding: '5px',
      }}
    >
      <button
        className="w-6 h-6 bg-blue-500 rounded-md text-white"
        onClick={() => setEditedNoteId(id)}
      >
        <ArrowTopRightOnSquareIcon />
      </button>
      <input
        type="color"
        value={nodeColor}
        onChange={(e) => updateColor(id, e.target.value)}
        style={{
          width: '24px',
          height: '24px',
        }}
      />
    </NodeToolbar>
  )
}

export default memo(CustomNodeToolBar)
