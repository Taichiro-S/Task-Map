import React, { FC, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  SelectionMode,
  Panel,
} from 'reactflow'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import { FlowState, useFlowStore } from 'stores/flowStore'

import { useNodeDrag, useNodeDrop, useNodeConnect } from 'hooks/index'
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
import { Layout, MenuBar, SideBar, TaskNodeInfoDialog } from 'components'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { DemoInstructionTabs } from 'components'
import { NextPage } from 'next'
import { ChevronDoubleLeftIcon, PlusSmallIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@mui/material/Button'

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
  const [isMiniMapOpen, setIsMiniMapOpen] = useState<boolean>(true)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

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
        <p className="text-2xl font-zenMaruGothicMono font-bold left-0 my-5 bg-slate-100 px-4 py-2 rounded-lg shadow-md">
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
        className="reactflow-wrapper border-2 border-neutral-600 rounded-md relative"
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
          panOnScroll
          selectionOnDrag
          // panOnDrag={panOnDrag}
          selectionMode={SelectionMode.Partial}
        >
          <Controls
            showInteractive={controlSettings.showInteractive}
            showZoom={controlSettings.showZoom}
            position={controlSettings.position}
          />
          <Panel position={panelSettings.position}>Demo</Panel>
          <div>
            {isMiniMapOpen ? (
              <>
                <XMarkIcon
                  onClick={() => setIsMiniMapOpen(false)}
                  className="h-5 w-5 text-gray-800 font-semibold z-10 cursor-pointer hover:text-blue-500 hover:border-2 p-0.5 border-neutral-400 rounded-md absolute top-5 right-5"
                />
                <MiniMap
                  nodeBorderRadius={miniMapSettings.nodeBorderRadius}
                  position={miniMapSettings.position}
                  zoomable={miniMapSettings.zoomable}
                  pannable={miniMapSettings.pannable}
                  nodeColor={miniMapSettings.nodeColor}
                  inversePan={miniMapSettings.inversePan}
                />
              </>
            ) : (
              <div className="z-10 cursor-pointer absolute top-2 right-2">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setIsMiniMapOpen(true)}
                  startIcon={<PlusSmallIcon className="h-5 w-5" />}
                >
                  Mini Map
                </Button>
              </div>
            )}
          </div>

          <Background
            variant={backgroundSettings.variant}
            gap={backgroundSettings.gap}
            size={backgroundSettings.size}
            color={backgroundSettings.color}
          />
        </ReactFlow>
        <div className="mx-auto flex justify-center">
          <MenuBar workspaceId={null} />
        </div>
        {isSideBarOpen ? (
          <div>
            {/* <ChevronDoubleLeftIcon
              className="cursor-pointer hover:text-blue-500 z-10 h-5 w-5 text-gray-300"
              style={{
                position: 'absolute',
                top: '60px',
                left: '220px',
              }}
              onClick={() => setIsSideBarOpen(false)}
            /> */}
            <div className="absolute top-10 left-3 h-3/4 w-60">
              <SideBar
                workspaceId={null}
                isSideBarOpen={isSideBarOpen}
                setIsSideBarOpen={setIsSideBarOpen}
              />
            </div>
          </div>
        ) : (
          <div className="z-10 cursor-pointer absolute top-10 left-2">
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setIsSideBarOpen(true)
              }}
              startIcon={<PlusSmallIcon className="h-5 w-5" />}
            >
              List
            </Button>
          </div>
        )}
        <TaskNodeInfoDialog />
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
