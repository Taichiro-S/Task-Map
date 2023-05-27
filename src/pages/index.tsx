import React, { useEffect, useRef, useState } from 'react'
import ReactFlow, {
  ConnectionLineType,
  MiniMap,
  Controls,
  Background,
  Panel,
  NodeOrigin,
  ReactFlowProvider,
  BackgroundVariant,
  ConnectionMode,
} from 'reactflow'
import { connectionLineStyle, defaultEdgeOptions } from 'utils/edgeSettings'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import useStore, { RFState } from 'stores/flowStore'
import {
  useQuerySessionUser,
  useQueryNode,
  useQueryEdge,
  useNodeDrag,
  useNodeDrop,
  useQueryNote,
  useNodeConnect,
} from 'hooks/index'
import { CustomNode, GroupingNode, Layout, Spinner, Header, MenuBar, CustomEdge } from 'components'
import { useRouter } from 'next/router'

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setInitialDataset: state.setInitialDataset,
})

const nodeTypes = {
  custom: CustomNode,
  grouping: GroupingNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

const nodeOrigin: NodeOrigin = [0, 0]

function Flow() {
  const router = useRouter()
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null) // TODO: 型を指定する
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const { data: edgeDatas, error: edgeError, isLoading: edgeIsLoading } = useQueryEdge(sessionUser)
  const { data: nodeDatas, error: nodeError, isLoading: nodeIsLoading } = useQueryNode(sessionUser)
  const { data: noteDatas, error: noteError, isLoading: noteIsLoading } = useQueryNote(sessionUser)

  const { nodes, edges, onNodesChange, onEdgesChange, setInitialDataset } = useStore(selector, shallow)
  const { handleNodeClick, handleNodeDragStart, handleNodeDragOver, handleNodeDragStop } = useNodeDrag()
  const { handleNodeDrop } = useNodeDrop(reactFlowInstance, reactFlowBounds)
  const { handleNodeConnectStart, handleNodeConnectEnd } = useNodeConnect()

  useEffect(() => {
    if (!sessionUser && !sessionUserIsLoading) {
      console.log('sessionUser', sessionUser)
      router.push('/login')
    }
  }, [sessionUser, sessionUserIsLoading, router])

  useEffect(() => {
    if (nodeDatas && edgeDatas && noteDatas) {
      setInitialDataset(nodeDatas, edgeDatas, noteDatas)
    }
  }, [nodeDatas, edgeDatas, noteDatas, setInitialDataset])

  if (sessionUserError || edgeError || nodeError || noteError) {
    return (
      <Layout title="Flow">
        <p>サーバーエラー</p>
      </Layout>
    )
  }

  if (sessionUserIsLoading || nodeIsLoading || edgeIsLoading || noteIsLoading) {
    return (
      <Layout title="Flow">
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout title="Flow">
      <div style={{ width: '100vw', height: '100vh' }} className="reactflow-wrapper" ref={reactFlowWrapper}>
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
          connectionLineType={ConnectionLineType.Straight}
          fitView
          onNodeClick={handleNodeClick}
          onInit={setReactFlowInstance}
          onDrop={handleNodeDrop}
          onDragOver={handleNodeDragOver}
          onNodeDragStop={handleNodeDragStop}
          connectionMode={ConnectionMode.Loose}
        >
          <Controls showInteractive={false} />
          <Panel position="top-left">My New Map</Panel>
          <MiniMap nodeBorderRadius={2} position="top-right" />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        <MenuBar user={sessionUser} />
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
