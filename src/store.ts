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
import { NewNote, NoteData } from '@/types/types'

export type RFState = {
  nodes: Node[]
  edges: Edge[]
  notes: NewNote[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  editedNoteId: string
  addChildNode: (parentNode: Node, position: XYPosition) => void
  addNewEdge: (parentNode: Node, childNode: Node) => void
  updateNodeLabel: (nodeId: string, label: string) => void
  updateEdgeLabel: (edgeId: string, label: string) => void
  addNewNode: () => void
  setInitialDataset: (nodes: Node[], edges: Edge[], notes: NoteData[]) => void
  updateNodeColor: (nodeId: string, color: string) => void
  setEditedNoteId: (nodeNanoId: string) => void
  resetEditedNoteId: () => void
  updateNoteContent: (nodeNanoId: string, content: string) => void
}

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  notes: [],
  editedNoteId: '',
  setInitialDataset: (nodes, edges, noteDatas) => {
    const notes = noteDatas.map((noteData) => {
      return {
        node_nanoid: noteData.node_nanoid,
        content: noteData.content,
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
          // it's important to create a new object here, to inform React Flow about the changes
          note.content = content
        }
        return note
      }),
    })
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
      data: {
        label: '',
        toolbarPosition: Position.Top,
        color: '#FFFFFF',
      },
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

    const newNote = {
      node_nanoid: newNode.id,
      content: '',
    }

    console.log('newNote', newNote)

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
      notes: [...get().notes, newNote],
    })

    console.log('get().notes', get().notes)
    const notes = useStore.getState().notes
    console.log('storeNotes', notes)
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

  updateNodeColor: (nodeId, color) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
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
      data: { label: '', toolbarPosition: Position.Top, color: '#FFFFFF' },
      position: { x: 0, y: 0 },
    }
    const newNote = {
      node_nanoid: newNode.id,
      content: '',
    }
    set({
      nodes: [...get().nodes, newNode],
      notes: [...get().notes, newNote],
    })
    const notes = useStore.getState().notes
    console.log('storeNotes', notes)
  },
  // edgeTexts: {},
  // updateEdgeText: (edgeId, text) => {
  //   set((state) => ({ edgeTexts: { ...state.edgeTexts, [edgeId]: text } }))
  // },
}))

export default useStore
