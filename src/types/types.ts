export type NodeDataType = {
  label: string
  description: string
  color: string
  completed: boolean
}

export type NodeData = {
  id: string
  created_at: string
  label: string
  position_X: number
  position_Y: number
  user_id: string
  node_nanoid: string
}

export type EdgeData = {
  id: string
  source_node_id: string
  target_node_id: string
  user_id: string
  created_at: string
}
