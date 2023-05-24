export type NodeData = {
  id: string
  created_at: string
  label: any
  position_X: number
  position_Y: number
  user_id: string | undefined
  node_nanoid: string
  type: string | undefined
  color: string
  parent_node_id: string | undefined
  width: number
  height: number
  index_in_nodes_array: number
  memo: string
  status: string
}

export type EdgeData = {
  id: string
  source_node_id: string
  target_node_id: string
  user_id: string | undefined
  created_at: string
  edge_nanoid: string
  type: string | undefined
  label: string
  animated: boolean | undefined
}

export type NoteData = {
  id: string
  created_at: string
  user_id: string | undefined
  node_nanoid: string
  content: string
  title: string
}

export type WorkspaceData = {
  id: string
  created_at: string
  user_id: string | undefined
  title: string
}

export type CommentData = {
  id: string
  created_at: string
  updated_at: string
  user_id: string | undefined
  workspace_id: string
  node_nanoid: string | undefined
  content: string
}

export type NodeInputProps = {
  label: string
  id: string
}

export type NewNote = Omit<NoteData, 'id' | 'created_at' | 'user_id'>
