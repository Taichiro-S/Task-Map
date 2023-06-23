import React, { FC, useEffect, useRef, useState } from 'react'
import ReactFlow, { MiniMap, Controls, Background, ReactFlowProvider } from 'reactflow'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import { FlowState, useFlowStore } from 'stores/flowStore'

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
} from 'utils/reactflow'
import { Layout, MenuBar } from 'components'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { DemoInstructionTabs } from 'components'
import { NextPage } from 'next'

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  resetFlow: state.resetFlow,
})

const Flow: FC = () => {
  // const router = useRouter()
  const queryClient = useQueryClient()
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null) // TODO: 型を指定する
  const { nodes, edges, onNodesChange, onEdgesChange, resetFlow } = useFlowStore(selector, shallow)
  const { handleNodeClick, handleNodeDragStart, handleNodeDragOver, handleNodeDragStop } =
    useNodeDrag()
  const { handleNodeDrop } = useNodeDrop(reactFlowInstance, reactFlowBounds)
  const { handleNodeConnectStart, handleNodeConnectEnd } = useNodeConnect()

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['flows'], exact: true })
    queryClient.removeQueries({ queryKey: ['workspaces'], exact: true })
    resetFlow()
  }, [])
  return (
    <Layout title="Demo">
      <div className="flex justify-start" style={{ width: '80vw', maxWidth: 900, minWidth: 600 }}>
        <p className="text-2xl font-zenMaruGothicMono font-bold left-0">
          <span className="text-blue-500">P</span>
          <span className="text-neutral-600">lay</span> <span className="text-blue-500">D</span>
          <span className="text-neutral-600">emo</span>!
        </p>
      </div>

      <div className="h-full" style={{ width: '80vw', maxWidth: 900, minWidth: 600 }}>
        <DemoInstructionTabs />
      </div>
      <div
        style={{ width: '80vw', height: '60vh', maxWidth: 900, minWidth: 600, minHeight: 600 }}
        className="reactflow-wrapper border-2 border-neutral-600 rounded-md"
        ref={reactFlowWrapper}
      >
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
        <div className="relative top-12 right-0 mx-auto flex justify-center">
          <MenuBar workspaceId={null} />
        </div>
      </div>
    </Layout>
  )
}

const Demo: NextPage = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}

export default Demo
