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
  addNewNode: () => void
}

const useStore = create<RFState>((set, get) => ({
  // The initial state with a single node.
  nodes: [
    {
      id: nanoid(),
      type: 'custom',
      data: { label: '' },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],

  // update the state with the new nodes and edges
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },

  addChildNode: (parentNode: Node, position: XYPosition) => {
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
    }

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    })
  },

  updateNodeLabel: (nodeId: string, label: string) => {
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

  addNewEdge: (parentNode: Node, childNode: Node) => {
    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: childNode.id,
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
}))

export default useStore
