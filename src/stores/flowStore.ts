import {
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  Position,
} from 'reactflow'
import { create } from 'zustand'
import { ZundoOptions, temporal } from 'zundo'
import { nanoid } from 'nanoid'
import uuid4 from 'uuid4'
import { nodeColorList } from 'constants/nodeColorList'
import _ from 'lodash'

export type FlowState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  isNodeDragged: boolean
  editedNodeId: string
  addChildNode: (parentNode: Node, position: XYPosition) => Node
  addNewEdge: (parentNode: Node, childNode: Node) => void
  updateNodeLabel: (nodeId: string, label: string) => void
  updateEdgeLabel: (edgeId: string, label: string) => void
  addNewNode: (position: XYPosition) => Node
  setInitialFlow: (nodes: Node[], edges: Edge[]) => void
  resetFlow: () => void
  removeElement: (element: Node | Edge) => void
  updateNodeColor: (nodeId: string, color: string) => void
  updateNodeMemo: (nodeNanoId: string, memo: string) => void
  setIsNodeDragged: (isNodeDragged: boolean) => void
  updateNodeStatus: (nodeNanoId: string, status: string) => void
  addNewGroupNode: (position: XYPosition) => Node
  updateGroupNodeColor: (groupNodeId: string, color: string) => void
  updateEdgeAnimation: (edgeId: string) => void
  resizeGroupingNode: (groupNodeId: string, width: number, height: number) => void
  setNodeParent: (nodeId: string, groupNodeId: string) => void
  setNodesUnselected: () => void
  setNodeSelection: (nodeId: string, selected: boolean) => void
  setEdgesUnselected: () => void
  updateNodeZIndex: (nodeId: string, zIndex: number) => void
  reArrangeNodes: (node: Node) => void
  setParentNodeOnNodeResizeEnd: (childeNodes: Node[], parentNodeId: string) => void
  setParentNodeOnNodeResizeStart: (childNodes: Node[], parentNodeId: string) => void
  setNodeOpen: (nodeId: string) => void
  updateNodeUrl: (nodeId: string, url: string) => void
  updateNodeStartTime: (nodeId: string, startTime: string) => void
  updateNodeEndTime: (nodeId: string, endTime: string) => void
  setEditedNodeId: (nodeId: string) => void
  deleteNode: (nodeId: string) => void
  deleteEdge: (edgeId: string) => void
}

export const useFlowStore = create(
  temporal<FlowState>(
    (set, get) => ({
      nodes: [],
      edges: [],
      isNodeDragged: false,
      editedNodeId: '',
      setInitialFlow: (nodes, edges) => {
        set({ nodes: nodes, edges: edges })
      },

      resetFlow: () => {
        set({ nodes: [], edges: [] })
      },

      updateNodeMemo: (nodeNanoId, memo) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeNanoId) {
              node.data.memo = memo
            }
            return node
          }),
        })
      },
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        })
      },

      addChildNode: (parentNode, position) => {
        const newNode: Node = {
          id: uuid4(),
          type: 'task',
          data: {
            label: '',
            color: nodeColorList[0].colorCode,
            width: 0,
            height: 0,
            memo: '',
            status: '',
            toolbarPosition: Position.Top,
            oepn: false,
            url: '',
            started_at: '',
            ended_at: '',
          },
          position: position,
          parentNode: '',
          zIndex: 10,
        }

        const newEdge: Edge = {
          id: uuid4(),
          source: parentNode.id,
          target: newNode.id,
          type: 'custom',
          data: { label: '' },
          animated: false,
          zIndex: 5,
          markerEnd: 'arrowclosed',
        }

        set({
          nodes: [...get().nodes, newNode],
          edges: [...get().edges, newEdge],
        })
        return newNode
      },

      updateNodeLabel: (nodeId, label) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.data = { ...node.data, label }
            }
            return node
          }),
        })
      },

      updateNodeColor: (nodeId, color) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.data = { ...node.data, color }
            }
            return node
          }),
        })
      },

      updateEdgeLabel: (edgeId, label) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === edgeId) {
              edge.data = { ...edge.data, label }
            }
            return edge
          }),
        })
      },

      addNewEdge: (parentNode, childNode) => {
        if (parentNode.id === childNode.id) return
        const newEdge: Edge = {
          id: uuid4(),
          source: parentNode.id,
          target: childNode.id,
          type: 'custom',
          data: { label: '' },
          animated: false,
          zIndex: 5,
          markerEnd: 'arrowclosed',
        }
        if (
          get().edges.some(
            (edge) => edge.source === newEdge.source && edge.target === newEdge.target,
          )
        )
          return

        set({
          edges: [...get().edges, newEdge],
        })
      },

      addNewNode: (position) => {
        const newNode: Node = {
          id: uuid4(),
          type: 'task',
          data: {
            label: '',
            color: nodeColorList[0].colorCode,
            width: 0,
            height: 0,
            memo: '',
            status: '',
            toolbarPosition: Position.Top,
            oepn: false,
            url: '',
            started_at: '',
            ended_at: '',
          },
          position: position,
          zIndex: 10,
          parentNode: '',
        }
        set({
          nodes: [...get().nodes, newNode],
        })
        return newNode
      },
      removeElement: (element) =>
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== element.id),
          edges: state.edges.filter((edge) => edge.id !== element.id),
        })),

      setIsNodeDragged: (isNodeDragged) => {
        set({ isNodeDragged: isNodeDragged })
      },

      updateNodeStatus: (nodeNanoId, status) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeNanoId) {
              node.data.status = status
            }
            return node
          }),
        })
      },
      addNewGroupNode: (position: XYPosition) => {
        const newGroupNode: Node = {
          id: uuid4(),
          type: 'grouping',
          data: {
            label: '',
            width: 300,
            height: 200,
            memo: '',
            status: '',
            toolbarPosition: Position.Top,
            color: nodeColorList[0].colorCode,
          },
          position: position,
          dragHandle: '.grouping-node-drag-handle',
          zIndex: 0,
          parentNode: '',
        }
        set({
          nodes: [newGroupNode, ...get().nodes],
        })
        return newGroupNode
      },
      updateGroupNodeColor: (groupNodeId, color) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === groupNodeId) {
              node.data = { ...node.data, color }
            }
            return node
          }),
        })
      },
      resizeGroupingNode: (groupNodeId, width, height) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === groupNodeId) {
              node.data = { ...node.data, width, height }
            }
            return node
          }),
        })
      },
      updateEdgeAnimation: (edgeId) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === edgeId) {
              edge.animated = !edge.animated
            }
            return edge
          }),
        })
      },
      setNodeParent: (nodeId, parentId) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              const newParentNode = get().nodes.find((n) => n.id === parentId)
              const oldParentNode = get().nodes.find((n) => n.id === node.parentNode)
              if (newParentNode && oldParentNode) {
                // Convert child node position to relative position to the parent node
                node.position = {
                  x: node.position.x + oldParentNode.position.x - newParentNode.position.x,
                  y: node.position.y + oldParentNode.position.y - newParentNode.position.y,
                }
                node.parentNode = parentId
              } else if (newParentNode && !oldParentNode) {
                node.position = {
                  x: node.position.x - newParentNode.position.x,
                  y: node.position.y - newParentNode.position.y,
                }
                node.parentNode = parentId
              } else if (!newParentNode && oldParentNode) {
                if (oldParentNode) {
                  node.position = {
                    x: node.position.x + oldParentNode.position.x,
                    y: node.position.y + oldParentNode.position.y,
                  }
                  node.parentNode = parentId
                }
              }
            }
            return node
          }),
        })
      },
      setNodeSelection: (nodeId, selected) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.selected = selected
            }
            return node
          }),
        })
      },
      setNodesUnselected: () => {
        set({
          nodes: get().nodes.map((node) => {
            node.selected = false
            return node
          }),
        })
      },
      setEdgesUnselected: () => {
        set({
          edges: get().edges.map((edge) => {
            edge.selected = false
            return edge
          }),
        })
      },

      updateNodeZIndex: (nodeId, zIndex) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.zIndex = zIndex
            }
            return node
          }),
        })
      },

      reArrangeNodes: (node) => {
        let nodesCopy = [...get().nodes]
        const draggedNodeIndex = nodesCopy.findIndex((n) => n.id === node.id)
        nodesCopy.splice(draggedNodeIndex, 1)

        // Initialize the insertion index as the index of the last grouping node
        let insertionIndex = nodesCopy.reduce(
          (acc, cur, index) => (cur.type === 'grouping' ? index : acc),
          -1,
        )

        for (const groupingNode of nodesCopy) {
          if (groupingNode.type === 'grouping' && groupingNode.parentNode) {
            const parentNodeIndex = nodesCopy.findIndex((n) => n.id === groupingNode.parentNode)
            if (parentNodeIndex > insertionIndex) {
              insertionIndex = parentNodeIndex
            }
          }
        }

        nodesCopy.splice(insertionIndex + 1, 0, node)
        set({
          nodes: nodesCopy,
        })
      },
      setParentNodeOnNodeResizeStart: (childNodes, parentNodeId) => {
        const oldParentNode = get().nodes.find((n) => n.id === parentNodeId)
        if (!oldParentNode) return
        set({
          nodes: get().nodes.map((node) => {
            for (const childNode of childNodes) {
              if (node.id === childNode.id) {
                node.parentNode = ''
                node.position = {
                  x: node.position.x + oldParentNode.position.x,
                  y: node.position.y + oldParentNode.position.y,
                }
              }
            }
            return node
          }),
        })
      },

      setParentNodeOnNodeResizeEnd: (childeNodes, parentNodeId) => {
        set({
          nodes: get().nodes.map((node) => {
            for (const childNode of childeNodes) {
              if (node.id === childNode.id && node.type === 'custom') {
                const nodeX: number = node.position.x
                const nodeY: number = node.position.y
                const parentNode = get().nodes.find((n) => n.id === parentNodeId)
                if (!parentNode) return node
                const rightEdge = parentNode.position.x + parentNode.width!
                const leftEdge = parentNode.position.x
                const topEdge = parentNode.position.y
                const bottomEdge = parentNode.position.y + parentNode.height!
                if (
                  nodeX < rightEdge &&
                  nodeX > leftEdge &&
                  nodeY < bottomEdge &&
                  nodeY > topEdge
                ) {
                  node.position = {
                    x: node.position.x - parentNode.position.x,
                    y: node.position.y - parentNode.position.y,
                  }
                  node.parentNode = parentNodeId
                }
              }
            }
            return node
          }),
        })
      },
      setNodeOpen: (nodeId) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.data.open = !node.data.open
            }
            return node
          }),
        })
      },
      updateNodeUrl: (nodeId, url) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.data.url = url
            }
            return node
          }),
        })
      },
      updateNodeStartTime: (nodeId, startTime) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.data.started_at = startTime
            }
            return node
          }),
        })
      },
      updateNodeEndTime: (nodeId, endTime) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.data.ended_at = endTime
            }
            return node
          }),
        })
      },
      setEditedNodeId: (nodeId) => {
        set({
          editedNodeId: nodeId,
        })
      },
      deleteNode: (nodeId) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
        })
      },
      deleteEdge: (edgeId) => {
        set({
          edges: get().edges.filter((edge) => edge.id !== edgeId),
        })
      },
    }),
    {
      limit: 100,
      // partialize: (state) => {
      //   const { nodes, edges } = state
      //   return { nodes, edges }
      // },
      handleSet: (handleSet) =>
        _.throttle<typeof handleSet>((state) => {
          // console.info('handleSet called')
          handleSet(state)
        }, 1000),
    },
  ),
)
