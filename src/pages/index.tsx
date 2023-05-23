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
} from 'reactflow'
// import OnLoadParams from 'reactflow'
import CustomNode from 'components/CustomNode'
import GroupingNode from 'components/GroupingNode'
import CustomEdge, {
  connectionLineStyle,
  defaultEdgeOptions,
} from 'components/CustomEdge'
import MenuBar from 'components/MenuBar'
import Note from 'components/Note'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import useStore, { RFState } from 'store'
import { useQueryNode } from 'hooks/useQueryNode'
import { useQueryEdge } from 'hooks/useQueryEdge'
import { useQueryNote } from 'hooks/useQueryNote'

import { Layout } from 'components/Layout'
import { Spinner } from 'components/Spinner'
import { supabase } from 'utils/supabase'
import { useRouter } from 'next/router'
import { useQueryUser } from 'hooks/useQueryUser'
import ResizableNode from 'components/ResizableNode'
const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  isNodeDragged: state.isNodeDragged,
  editedNoteId: state.editedNoteId,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  addNewEdge: state.addNewEdge,
  addNewNode: state.addNewNode,
  setInitialDataset: state.setInitialDataset,
  setIsNodeDragged: state.setIsNodeDragged,
  addNewGroupNode: state.addNewGroupNode,
  updateGroupNodeColor: state.updateGroupNodeColor,
  setNodeParent: state.setNodeParent,
  setNodesUnselected: state.setNodesUnselected,
  updateNodeZIndex: state.updateNodeZIndex,
  reArrangeNodes: state.reArrangeNodes,
  setEdgesUnselected: state.setEdgesUnselected,
})

const nodeTypes = {
  custom: CustomNode,
  grouping: GroupingNode,
  resizable: ResizableNode,
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
    isNodeDragged,
    editedNoteId,
    onNodesChange,
    onEdgesChange,
    addChildNode,
    addNewEdge,
    setInitialDataset,
    setIsNodeDragged,
    addNewGroupNode,
    setNodeParent,
    addNewNode,
    setNodesUnselected,
    updateNodeZIndex,
    reArrangeNodes,
    setEdgesUnselected,
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

  const onNodeDragStart = () => {
    setIsNodeDragged(true)
  }

  const onNodeDragStop = (event: MouseEvent | TouchEvent, node: Node) => {
    console.log(nodes)
    const nodeX = node.position.x
    const nodeY = node.position.y
    const groupinNodes = nodes.filter((n) => n.type === 'grouping')
    for (const gNode of groupinNodes) {
      if (node.parentNode && node.parentNode === gNode.id) {
        if (
          0 < nodeX &&
          nodeX < gNode.width! &&
          0 < nodeY &&
          nodeY < gNode.height!
        ) {
          console.log('already in group')
        } else {
          console.log('getout')
          setNodeParent(node.id, '')
        }
      } else if (node.parentNode && node.parentNode !== gNode.id) {
        console.log('node.parentnode', node.parentNode)
      } else if (!node.parentNode) {
        const rightEdge = gNode.position.x + gNode.width!
        const leftEdge = gNode.position.x
        const topEdge = gNode.position.y
        const bottomEdge = gNode.position.y + gNode.height!
        if (
          nodeX > leftEdge &&
          nodeX < rightEdge &&
          nodeY > topEdge &&
          nodeY < bottomEdge
        ) {
          console.log('getin')
          setNodeParent(node.id, gNode.id)
        }
      }
    }
    if (node.type === 'grouping') {
      reArrangeNodes(node)
    }
  }

  const onNodeDrag = (event: MouseEvent | TouchEvent, node: Node) => {
    if (node.type === 'grouping') {
      updateNodeZIndex(node.id, 0)
      nodes.map((n) => {
        if (n.type === 'custom') {
          updateNodeZIndex(n.id, 10)
        }
      })
    }
  }

  const onNodeClick = (node: Node) => {
    if (isNodeDragged) {
      setIsNodeDragged(false)
      node.selected = false
    }
  }

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState()
      const targetIsPane = (event.target as Element).classList.contains(
        'react-flow__pane',
      )
      if (targetIsPane && connectingNodeId.current) {
        const nodeType = nodeInternals.get(connectingNodeId.current)?.type
        if (nodeType === 'grouping') return
        const parentNode = nodeInternals.get(connectingNodeId.current)
        const childNodePosition = getChildNodePosition(event, parentNode)

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition)
        }
      } else if (!targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current)
        const targetTypeisGroup = (event.target as Element).classList.contains(
          'grouping-node',
        )
        if (parentNode && targetTypeisGroup) {
          const childNodePosition = getChildNodePosition(event, parentNode)
          if (parentNode && childNodePosition) {
            addChildNode(parentNode, childNodePosition)
          }
        }

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

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null) // TODO: 型を指定する
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type: string = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      if (reactFlowBounds && reactFlowInstance) {
        const position: XYPosition = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })
        let node: Node | null = null
        if (type === 'grouping') {
          node = addNewGroupNode(position)
        } else if (type === 'custom') {
          node = addNewNode(position)
        }
        if (node === null || node === undefined) return
        const nodeX = node.position.x
        const nodeY = node.position.y
        const groupingNodes = nodes.filter((n) => n.type === 'grouping')
        for (const gNode of groupingNodes) {
          if (node.parentNode && node.parentNode === gNode.id) {
            if (
              0 < nodeX &&
              nodeX < gNode.width! &&
              0 < nodeY &&
              nodeY < gNode.height!
            ) {
              console.log('already in group')
            } else {
              console.log('getout')
              setNodeParent(node.id, '')
            }
          } else if (node.parentNode && node.parentNode !== n.id) {
            console.log('node.parentnode', node.parentNode)
          } else if (!node.parentNode) {
            const rightEdge = gNode.position.x + gNode.width!
            const leftEdge = gNode.position.x
            const topEdge = gNode.position.y
            const bottomEdge = gNode.position.y + gNode.height!
            if (
              nodeX > leftEdge &&
              nodeX < rightEdge &&
              nodeY > topEdge &&
              nodeY < bottomEdge
            ) {
              console.log('getin')
              setNodeParent(node.id, gNode.id)
            }
          }
        }
      }
    },
    [reactFlowInstance],
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
    router.push('/login')
    return null
  }

  if (userIdIsLoading || nodeIsLoading || edgeIsLoading || noteIsLoading) {
    return <Spinner />
  }

  return (
    <Layout title="Flow">
      <div
        style={{ width: '100vw', height: '100vh' }}
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeDragStart={onNodeDragStart}
          // nodeOrigin={nodeOrigin}

          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineType={ConnectionLineType.Straight}
          fitView
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDragStop={onNodeDragStop}
          onNodeDrag={onNodeDrag}
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
