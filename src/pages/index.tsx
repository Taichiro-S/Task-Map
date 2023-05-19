import React, { use, useCallback, useEffect, useRef, useState } from 'react'
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
} from 'reactflow'
import CustomNode from '@/components/CustomNode'
import CustomEdge, {
  connectionLineStyle,
  defaultEdgeOptions,
} from '@/components/CustomEdge'
import MenuBar from '@/components/MenuBar'
import Note from '@/components/Note'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import useStore, { RFState } from '@/store'
import { useQueryNode } from '@/hooks/useQueryNode'
import { useQueryEdge } from '@/hooks/useQueryEdge'
import { useQueryNote } from '@/hooks/useQueryNote'

import { Layout } from '@/components/Layout'
import { Spinner } from '@/components/Spinner'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/router'
import { useQueryUser } from '@/hooks/useQueryUser'

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  editedNoteId: state.editedNoteId,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  addNewEdge: state.addNewEdge,
  setInitialDataset: state.setInitialDataset,
})

const nodeTypes = {
  custom: CustomNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

const nodeOrigin: NodeOrigin = [0.5, 0.5]

function Flow() {
  const router = useRouter()
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
  const {
    nodes,
    edges,
    editedNoteId,
    onNodesChange,
    onEdgesChange,
    addChildNode,
    addNewEdge,
    setInitialDataset,
  } = useStore(selector, shallow)
  const connectingNodeId = useRef<string | null>(null)
  const { project } = useReactFlow()
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId
  }, [])

  useEffect(() => {
    if (nodeDatas && edgeDatas && noteDatas) {
      // console.log(nodeDatas, edgeDatas)
      setInitialDataset(nodeDatas, edgeDatas, noteDatas)
    }
  }, [nodeDatas, edgeDatas, noteDatas])

  const store = useStoreApi()

  const getChildNodePosition = (
    event: MouseEvent | TouchEvent,
    parentNode?: Node,
  ) => {
    const { domNode } = store.getState()

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return
    }

    const { top, left } = domNode.getBoundingClientRect()

    let panePosition = project({
      x: 0,
      y: 0,
    })

    // toucheventにはclientX, clientYがないので、対応が必要
    if (event instanceof MouseEvent) {
      panePosition = project({
        x: event.clientX - left,
        y: event.clientY - top,
      })
    }

    // calculate with positionAbsolute here in order for child nodes to be positioned relative to their parent
    // return {
    //   x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
    //   y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    // }
    return {
      x: panePosition.x,
      y: panePosition.y,
    }
  }

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState()
      const targetIsPane = (event.target as Element).classList.contains(
        'react-flow__pane',
      )

      if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current)
        const childNodePosition = getChildNodePosition(event, parentNode)

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition)
        }
      } else if (!targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current)
        const targetNodeId = (event.target as Element).getAttribute(
          'data-nodeid',
        )
        if (parentNode && targetNodeId && nodes) {
          const childNode = nodes.find((node) => node.id === targetNodeId)
          if (childNode) {
            addNewEdge(parentNode, childNode)
          }
        }
      }
    },
    [getChildNodePosition],
  )

  if (
    'UserNotFound' in
    [
      userIdError?.message,
      edgeError?.message,
      nodeError?.message,
      noteError?.message,
    ]
  ) {
    console.log(userIdError?.message)
    router.push('/login')
    return null
  }

  if (userIdIsLoading || nodeIsLoading || edgeIsLoading || noteIsLoading) {
    return <Spinner />
  }

  return (
    <Layout title="Flow">
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          nodeOrigin={nodeOrigin}
          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineType={ConnectionLineType.Straight}
          fitView
        >
          <Controls showInteractive={false} />
          <Panel position="top-left">My New Map</Panel>
          <MiniMap nodeBorderRadius={2} position="top-right" />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        <MenuBar userId={userId} />
        {editedNoteId !== '' && <Note />}
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