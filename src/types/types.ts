export type NodeDataType = {
  label: string
  description: string
  color: string
  completed: boolean
}

export type NodeData = {
  id: string
  created_at: string
  label: any
  position_X: number
  position_Y: number
  user_id: string | undefined
  node_nanoid: string
  type: string | undefined
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
}
