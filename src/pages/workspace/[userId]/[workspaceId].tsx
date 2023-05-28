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
import useStore, { RFState } from 'stores/flowStore'
import {
  useQuerySessionUser,
  useQueryNode,
  useQueryEdge,
  useNodeDrag,
  useNodeDrop,
  useNodeConnect,
  useQueryWorkspace,
  useQueryFlow,
} from 'hooks'
import { Layout, Spinner, MenuBar } from 'components'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setInitialFlow: state.setInitialFlow,
  resetFlow: state.resetFlow,
})

const Flow = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const userId = router.query.userId as string
  const workspaceId = router.query.workspaceId as string
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null) // TODO: 型を指定する
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const {
    data: flowDatas,
    error: flowError,
    isLoading: flowIsLoading,
    refetch: refetchFlow,
  } = useQueryFlow(sessionUser, workspaceId)

  // const {
  //   data: edgeDatas,
  //   error: edgeError,
  //   isLoading: edgeIsLoading,
  //   refetch: refetchEdge,
  // } = useQueryEdge(sessionUser, workspaceId)
  // const {
  //   data: nodeDatas,
  //   error: nodeError,
  //   isLoading: nodeIsLoading,
  //   refetch: refetchNode,
  // } = useQueryNode(sessionUser, workspaceId)
  const {
    data: workspaceDatas,
    error: workspaceError,
    isLoading: workspaceIsLoading,
    refetch: refetchWorkspace,
  } = useQueryWorkspace(sessionUser)
  const { nodes, edges, onNodesChange, onEdgesChange, setInitialFlow, resetFlow } = useStore(selector, shallow)
  const { handleNodeClick, handleNodeDragStart, handleNodeDragOver, handleNodeDragStop } = useNodeDrag()
  const { handleNodeDrop } = useNodeDrop(reactFlowInstance, reactFlowBounds)
  const { handleNodeConnectStart, handleNodeConnectEnd } = useNodeConnect()

  // console.log('userId', userId, 'workspaceId', workspaceId)
  // console.log(sessionUser, workspaceId)

  useEffect(() => {
    if (!sessionUser && !sessionUserIsLoading) {
      router.push('/login')
    } else if (sessionUser && sessionUser.id !== userId) {
      router.push('/dashboard')
    }
  }, [sessionUser, sessionUserIsLoading, router])

  // useEffect(() => {
  //   if (nodeDatas && edgeDatas) {
  //     resetFlow()
  //     setInitialFlow(nodeDatas, edgeDatas)
  //   }
  // }, [nodeDatas, edgeDatas, setInitialFlow])

  useEffect(() => {
    if (flowDatas) {
      resetFlow()
      const { sortedNodes, edges } = flowDatas
      setInitialFlow(sortedNodes, edges)
    }
  }, [flowDatas])

  const workspaceTitle = useRef<string | null>(null)

  useEffect(() => {
    if (workspaceDatas) {
      workspaceTitle.current = workspaceDatas.find((workspace) => workspace.id === workspaceId)!.title
    }
  }, [])

  useEffect(() => {
    refetchFlow()
  }, [router.asPath])

  if (sessionUserError || flowError) {
    console.log(sessionUserError, flowError)
    return (
      <Layout title="Flow">
        <p>サーバーエラー</p>
      </Layout>
    )
  }

  if (sessionUserIsLoading || flowIsLoading) {
    return (
      <Layout title="Flow">
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout title="Flow">
      <div style={{ width: '100vw', height: '90vh' }} className="reactflow-wrapper" ref={reactFlowWrapper}>
        {/* <Header /> */}
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
          <Panel position={panelSettings.position}>{workspaceTitle.current ? workspaceTitle.current : ''}</Panel>
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
        <MenuBar workspaceId={workspaceId} />
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
