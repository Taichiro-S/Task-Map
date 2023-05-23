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
  Position,
} from 'reactflow'
import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { NewNote, NoteData, GroupData } from 'types/types'
import { nodeColorList } from 'config/nodeColorList'

export type RFState = {
  nodes: Node[]
  edges: Edge[]
  notes: NewNote[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  editedNoteId: string
  isNodeDragged: boolean
  addChildNode: (parentNode: Node, position: XYPosition) => Node
  addNewEdge: (parentNode: Node, childNode: Node) => void
  updateNodeLabel: (nodeId: string, label: string) => void
  updateEdgeLabel: (edgeId: string, label: string) => void
  addNewNode: (position: XYPosition) => Node
  setInitialDataset: (
    nodes: Node[],
    edges: Edge[],
    noteDatas: NoteData[],
  ) => void
  removeElement: (element: Node | Edge) => void
  updateNodeColor: (nodeId: string, color: string) => void
  setEditedNoteId: (nodeNanoId: string) => void
  resetEditedNoteId: () => void
  updateNoteContent: (nodeNanoId: string, content: string) => void
  setIsNodeDragged: (isNodeDragged: boolean) => void
  updateStatus: (nodeNanoId: string, status: string) => void
  addNewGroupNode: (position: XYPosition) => Node
  updateGroupNodeColor: (groupNodeId: string, color: string) => void
  updateEdgeAnimation: (edgeId: string) => void
  resizeGroupingNode: (
    groupNodeId: string,
    width: number,
    height: number,
  ) => void
  setNodeParent: (nodeId: string, groupNodeId: string) => void
  setNodesUnselected: () => void
  setEdgesUnselected: () => void

  updateNodeZIndex: (nodeId: string, zIndex: number) => void
  reArrangeNodes: (node: Node) => void
  // changeSelected: (nodeId: string) => void
}

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  notes: [],
  editedNoteId: '',
  isNodeDragged: false,
  setInitialDataset: (nodes, edges, noteDatas) => {
    const notes = noteDatas.map((noteData) => {
      return {
        node_nanoid: noteData.node_nanoid,
        content: noteData.content,
        status: noteData.status,
      }
    })
    set({ nodes: nodes, edges: edges, notes: notes })
  },

  setEditedNoteId: (nodeNanoId) => {
    set({ editedNoteId: nodeNanoId })
  },
  resetEditedNoteId: () => {
    set({ editedNoteId: '' })
  },
  updateNoteContent: (nodeNanoId, content) => {
    set({
      notes: get().notes.map((note) => {
        if (note.node_nanoid === nodeNanoId) {
          note.content = content
        }
        return note
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
      id: nanoid(),
      type: 'custom',
      data: {
        label: '',
        toolbarPosition: Position.Top,
        color: nodeColorList[0].colorCode,
      },
      position: position,
      // parentNode: parentNode.id,
      zIndex: 10,
    }

    const newEdge: Edge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
      type: 'custom',
      data: { label: '' },
      animated: false,
      zIndex: 5,
      markerEnd: 'arrowclosed',
    }

    const newNote = {
      node_nanoid: newNode.id,
      content: '',
      status: '',
    }

    console.log('newNote', newNote)

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
      notes: [...get().notes, newNote],
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
      id: nanoid(),
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
        (edge) =>
          edge.source === newEdge.source && edge.target === newEdge.target,
      )
    )
      return

    set({
      edges: [...get().edges, newEdge],
    })
  },

  addNewNode: (position) => {
    const newNode: Node = {
      id: nanoid(),
      type: 'custom',
      data: {
        label: '',
        toolbarPosition: Position.Top,
        color: nodeColorList[0].colorCode,
      },
      position: position,
      zIndex: 10,
    }
    const newNote = {
      node_nanoid: newNode.id,
      content: '',
      status: '',
    }
    set({
      nodes: [...get().nodes, newNode],
      notes: [...get().notes, newNote],
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

  updateStatus: (nodeNanoId, status) => {
    set({
      notes: get().notes.map((note) => {
        if (note.node_nanoid === nodeNanoId) {
          note.status = status
        }
        return note
      }),
    })
  },
  addNewGroupNode: (position: XYPosition) => {
    const newGroupNode: Node = {
      id: nanoid(),
      type: 'grouping',
      data: {
        label: 'New Group',
        color: nodeColorList[0].colorCode,
        width: '300px',
        height: '200px',
      },
      position: position,
      dragHandle: '.grouping-node-drag-handle',
      zIndex: 0,
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
          const parentNode = get().nodes.find((n) => n.id === parentId)
          if (parentNode) {
            console.log('parentNode', parentNode)
            // Convert child node position to relative position to the parent node
            node.position = {
              x: node.position.x - parentNode.position.x,
              y: node.position.y - parentNode.position.y,
            }
            node.parentNode = parentId
          } else {
            const oldParentNode = get().nodes.find(
              (n) => n.id === node.parentNode,
            )
            console.log(
              'no parentNode',
              parentId,
              node.parentNode,
              oldParentNode,
            )
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
    // Remove the dragged node from the array
    let nodesCopy = [...get().nodes]
    const draggedNodeIndex = nodesCopy.findIndex((n) => n.id === node.id)
    nodesCopy.splice(draggedNodeIndex, 1)

    // Find the index of the last grouping node in the array
    const lastGroupNodeIndex = nodesCopy.reduce(
      (acc, cur, index) => (cur.type === 'grouping' ? index : acc),
      -1,
    )

    // Insert the dragged node after the last grouping node
    nodesCopy.splice(lastGroupNodeIndex + 1, 0, node)
    set({
      nodes: nodesCopy,
    })
  },

  // changeSelected: (nodeId) => {
  //   set({
  //     nodes: get().nodes.map((node) => {
  //       if (node.id === nodeId) {
  //         node.selected = !node.selected
  //       }
  //       return node
  //     }),
  //   })
  // },
}))

export default useStore
