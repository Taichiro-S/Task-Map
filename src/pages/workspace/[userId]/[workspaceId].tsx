import { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import ReactFlow, { MiniMap, Controls, Background, Panel, ReactFlowProvider } from 'reactflow'
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
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { useQuerySessionUser, useNodeDrag, useNodeDrop, useNodeConnect, useQueryWorkspace, useQueryFlow } from 'hooks'
import { Layout, Spinner, MenuBar } from 'components'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setInitialFlow: state.setInitialFlow,
  resetFlow: state.resetFlow,
})

const Flow = () => {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null) // TODO: 型を指定する
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const { data: flowDatas, error: flowError, isLoading: flowIsLoading } = useQueryFlow(userId, workspaceId)
  const { data: workspaceDatas, error: workspaceError, isLoading: workspaceIsLoading } = useQueryWorkspace()
  const { nodes, edges, onNodesChange, onEdgesChange, setInitialFlow, resetFlow } = useFlowStore(selector, shallow)
  const { handleNodeClick, handleNodeDragStart, handleNodeDragOver, handleNodeDragStop } = useNodeDrag()
  const { handleNodeDrop } = useNodeDrop(reactFlowInstance, reactFlowBounds)
  const { handleNodeConnectStart, handleNodeConnectEnd } = useNodeConnect()

  useEffect(() => {
    if (router.isReady) {
      const userQueryId = router.query.userId as string
      const workspaceQueryId = router.query.workspaceId as string
      setUserId(userQueryId)
      setWorkspaceId(workspaceQueryId)
      if (!sessionUserIsLoading && !sessionUser) {
        router.push('/')
      } else if (sessionUser && sessionUser.id !== userQueryId) {
        router.push('/dashboard')
      }
    }
  }, [router, sessionUser, sessionUserIsLoading])

  useEffect(() => {
    if (flowDatas) {
      resetFlow()
      const { sortedNodes, edges } = flowDatas
      setInitialFlow(sortedNodes, edges)
    }
  }, [flowDatas])

  const workspaceTitle =
    workspaceDatas?.length && workspaceDatas?.length > 0
      ? workspaceDatas.find((workspace) => workspace.id === workspaceId)?.title
      : ''

  if (sessionUserError || flowError || workspaceError) {
    console.error(sessionUserError, flowError)
    return (
      <Layout title="Flow">
        <p>サーバーエラー</p>
      </Layout>
    )
  }

  if (sessionUserIsLoading || flowIsLoading || workspaceIsLoading) {
    return (
      <Layout title="Flow">
        <Spinner />
      </Layout>
    )
  }

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
          <Panel position={panelSettings.position}>{workspaceTitle}</Panel>
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
            color={backgroundSettings.color}
          />
        </ReactFlow>
        <div className="mx-auto flex justify-center">
          <MenuBar workspaceId={workspaceId} />
        </div>
      </div>
    </Layout>
  )
}

const App: NextPage = () => {
  return (
    <div>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  )
}

export default App
