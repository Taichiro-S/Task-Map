import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  DragEvent,
} from 'react'
import ReactFlow, {
  ConnectionLineType,
  MiniMap,
  Controls,
  Background,
  Panel,
  NodeOrigin,
  OnConnectStart,
  OnConnectEnd,
  useStoreApi,
  Node,
  useReactFlow,
  ReactFlowProvider,
  Edge,
  updateEdge,
  addEdge,
  XYPosition,
  BackgroundVariant,
  ConnectionMode,
} from 'reactflow'
// import OnLoadParams from 'reactflow'
import CustomNode from 'components/CustomNode'
import GroupingNode from 'components/GroupingNode'
import CustomEdge, {
  connectionLineStyle,
  defaultEdgeOptions,
} from 'components/CustomEdge'
import MenuBar from 'components/MenuBar'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import useStore, { RFState } from 'store'
import {
  useQueryUser,
  useQueryNode,
  useQueryEdge,
  useNodeDrag,
  useNodeDrop,
  useQueryNote,
  useNodeConnect,
} from 'hooks/index'

import { Layout } from 'components/Layout'
import { Spinner } from 'components/Spinner'
import { useRouter } from 'next/router'
import ResizableNode from 'components/ResizableNode'
import Header from 'components/Header'
import { Toaster } from 'react-hot-toast'

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
  resizable: ResizableNode,
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
  const {
    data: userId,
    error: userIdError,
    isLoading: userIdIsLoading,
  } = useQueryUser()
  const {
    data: edgeDatas,
    error: edgeError,
    isLoading: edgeIsLoading,
  } = useQueryEdge(userId)
  const {
    data: nodeDatas,
    error: nodeError,
    isLoading: nodeIsLoading,
  } = useQueryNode(userId)
  const {
    data: noteDatas,
    error: noteError,
    isLoading: noteIsLoading,
  } = useQueryNote(userId)
  const { nodes, edges, onNodesChange, onEdgesChange, setInitialDataset } =
    useStore(selector, shallow)
  const {
    handleNodeClick,
    handleNodeDragStart,
    handleNodeDragOver,
    handleNodeDragStop,
  } = useNodeDrag()
  const { handleNodeDrop } = useNodeDrop(reactFlowInstance, reactFlowBounds)
  const { handleNodeConnectStart, handleNodeConnectEnd } = useNodeConnect()

  useEffect(() => {
    if (nodeDatas && edgeDatas && noteDatas) {
      setInitialDataset(nodeDatas, edgeDatas, noteDatas)
    }
  }, [nodeDatas, edgeDatas, noteDatas])

  if (
    'UserNotFound' in
    [
      userIdError?.message,
      edgeError?.message,
      nodeError?.message,
      noteError?.message,
    ]
  ) {
    router.push('/login')
    return null
  }

  if (userIdIsLoading || nodeIsLoading || edgeIsLoading || noteIsLoading) {
    return <Spinner />
  }

  return (
    <Layout title="Flow">
      <Toaster />
      <div
        style={{ width: '100vw', height: '100vh' }}
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <Header />
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
          // onNodeDrag={onNodeDrag}
          connectionMode={ConnectionMode.Loose}
        >
          <Controls showInteractive={false} />
          <Panel position="top-left">My New Map</Panel>
          <MiniMap nodeBorderRadius={2} position="top-right" />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        <MenuBar userId={userId} />
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
