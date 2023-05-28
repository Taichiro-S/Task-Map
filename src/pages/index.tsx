import React, { useEffect, useRef, useState } from 'react'
import ReactFlow, { MiniMap, Controls, Background, Panel, NodeOrigin, ReactFlowProvider } from 'reactflow'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import useStore, { RFState } from 'stores/flowStore'
import { useQuerySessionUser, useNodeDrag, useNodeDrop, useNodeConnect } from 'hooks/index'
import {
  nodeTypes,
  nodeOrigin,
  connectionLineStyle,
  defaultEdgeOptions,
  edgeTypes,
  defaultConnectionLineType,
  defaultConnectionMode,
  backgroundSettings,
  controlSettings,
  miniMapSettings,
  panelSettings,
} from 'utils/reactflow'
import { CustomNode, GroupingNode, Layout, MenuBar, CustomEdge } from 'components'
import { useRouter } from 'next/router'

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
})

function Flow() {
  const router = useRouter()
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null) // TODO: 型を指定する
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()

  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(selector, shallow)
  const { handleNodeClick, handleNodeDragStart, handleNodeDragOver, handleNodeDragStop } = useNodeDrag()
  const { handleNodeDrop } = useNodeDrop(reactFlowInstance, reactFlowBounds)
  const { handleNodeConnectStart, handleNodeConnectEnd } = useNodeConnect()

  useEffect(() => {
    if (sessionUser && !sessionUserIsLoading) {
      router.push('/dashboard')
    }
  }, [sessionUser, sessionUserIsLoading, router])

  return (
    <Layout title="Flow">
      <div style={{ width: '100vw', height: '90vh' }} className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnectStart={handleNodeConnectStart}
          onConnectEnd={handleNodeConnectEnd}
          onNodeDragStart={handleNodeDragStart}
          nodeOrigin={nodeOrigin}
          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineType={defaultConnectionLineType}
          fitView
          onNodeClick={handleNodeClick}
          onInit={setReactFlowInstance}
          onDrop={handleNodeDrop}
          onDragOver={handleNodeDragOver}
          onNodeDragStop={handleNodeDragStop}
          connectionMode={defaultConnectionMode}
        >
          <Controls
            showInteractive={controlSettings.showInteractive}
            showZoom={controlSettings.showZoom}
            position={controlSettings.position}
          />
          <MiniMap
            nodeBorderRadius={miniMapSettings.nodeBorderRadius}
            position={miniMapSettings.position}
            zoomable={miniMapSettings.zoomable}
            pannable={miniMapSettings.pannable}
            nodeColor={miniMapSettings.nodeColor}
            inversePan={miniMapSettings.inversePan}
          />
          <Background
            variant={backgroundSettings.variant}
            gap={backgroundSettings.gap}
            size={backgroundSettings.size}
          />
        </ReactFlow>
        <MenuBar workspaceId={null} />
        {/* {editedNoteId !== '' && <Note />} */}
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}
