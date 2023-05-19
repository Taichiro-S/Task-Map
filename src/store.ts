import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  MarkerType,
} from 'reactflow'
import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type RFState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  addChildNode: (parentNode: Node, position: XYPosition) => void
  addNewEdge: (parentNode: Node, childNode: Node) => void
  updateNodeLabel: (nodeId: string, label: string) => void
  updateEdgeLabel: (edgeId: string, label: string) => void
  addNewNode: () => void
  setInitialDataset: (nodes: Node[], edges: Edge[]) => void
  // edgeTexts: Record<string, string>
  // updateEdgeText: (edgeId: string, text: string) => void
}

const useStore = create<RFState>((set, get) => ({
  // The initial state with a single node.
  nodes: [],
  edges: [],
  setInitialDataset: (nodes, edges) => {
    set({ nodes: nodes, edges: edges })
  },

  // update the state with the new nodes and edges
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
    const newNode = {
      id: nanoid(),
      type: 'custom',
      data: { label: '' },
      position: position,
      // parentNode: parentNode.id,
    }

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
      type: 'custom',
      data: { label: '' },
    }

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    })
  },

  updateNodeLabel: (nodeId, label) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = { ...node.data, label }
        }

        return node
      }),
    })
  },

  updateEdgeLabel: (edgeId, label) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === edgeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          edge.data = { ...edge.data, label }
        }
        return edge
      }),
    })
  },

  addNewEdge: (parentNode, childNode) => {
    if (parentNode.id === childNode.id) return
    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: childNode.id,
      type: 'custom',
      data: { label: '' },
    }
    if (
      get().edges.some(
        (edge) =>
          edge.source === newEdge.source && edge.target === newEdge.target,
      )
    )
      return

    set({
      edges: [...get().edges, newEdge],
    })
  },

  addNewNode: () => {
    const newNode = {
      id: nanoid(),
      type: 'custom',
      data: { label: '' },
      position: { x: 0, y: 0 },
    }
    set({
      nodes: [...get().nodes, newNode],
    })
  },
  // edgeTexts: {},
  // updateEdgeText: (edgeId, text) => {
  //   set((state) => ({ edgeTexts: { ...state.edgeTexts, [edgeId]: text } }))
  // },
}))

export default useStore
