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
  workspace_id: string
  url: string
  started_at: string
  ended_at: string
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
  workspace_id: string
}

export type NoteData = {
  id: string
  created_at: string
  user_id: string | undefined
  node_nanoid: string
  title: string
  content: string
  workspace_id: string
}

export type NewNote = Omit<NoteData, 'id' | 'created_at' | 'user_id' | 'workspace_id'>

export type WorkspaceData = {
  id: string
  created_at: string
  updated_at: string
  user_id: string | undefined
  title: string
  description: string
  public: boolean
}

export type NewWorkspace = Omit<WorkspaceData, 'id' | 'created_at' | 'updated_at' | 'user_id'>
export type EditedWorkspace = Omit<WorkspaceData, 'created_at' | 'updated_at' | 'user_id'>

export type CommentData = {
  id: string
  created_at: string
  updated_at: string
  user_id: string | undefined
  workspace_id: string
  node_nanoid: string | undefined
  content: string
}

export type NewComment = Omit<CommentData, 'id' | 'created_at' | 'updated_at' | 'user_id'>

export type NodeInputProps = {
  label: string
  id: string
}

export type SignupUserData = {
  email: string
  password: string
  repassword: string
  showPassword: boolean
}

export type LoginUserData = {
  email: string
  password: string
  remember?: string
  showPassword: boolean
}
