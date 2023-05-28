import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { Node, Edge } from 'reactflow'
import { User } from '@supabase/supabase-js'

export const getFlows = async (user: User | null | undefined, workspaceId: string) => {
  if (!user) {
    throw new Error('User is not logged in')
  }
  // get edges
  const { data: edgeDatas, error: edgeError } = await supabase
    .from('edges')
    .select('*')
    .eq('user_id', user.id)
    .eq('workspace_id', workspaceId)
  if (edgeError) {
    throw new Error(`Error fetching edgeData: ${edgeError.message}`)
  }
  if (!edgeDatas) {
    throw new Error('Failed to fetch edgeData')
  }

  const edges = edgeDatas.map((edgeData) => {
    return {
      id: edgeData.edge_nanoid,
      source: edgeData.source_node_id,
      target: edgeData.target_node_id,
      type: edgeData.type,
      data: { label: edgeData.label },
      animated: edgeData.animated,
      zIndex: 5,
    }
  })

  // get nodes
  const { data: nodeDatas, error: nodeError } = await supabase
    .from('nodes')
    .select('*')
    .eq('user_id', user.id)
    .eq('workspace_id', workspaceId)
  if (nodeError) {
    throw new Error(`Error fetching nodes: ${nodeError.message}`)
  }
  if (!nodeDatas) {
    throw new Error('Failed to fetch nodeData')
  }

  const nodes = nodeDatas.map((nodeData) => {
    return {
      id: nodeData.node_nanoid,
      type: nodeData.type,
      position: { x: nodeData.position_X, y: nodeData.position_Y },
      data: {
        label: nodeData.label,
        color: nodeData.color,
        index_in_nodes_array: nodeData.index_in_nodes_array,
        height: nodeData.height,
        width: nodeData.width,
        memo: nodeData.memo,
        status: nodeData.status,
      },
      parentNode: nodeData.parent_node_id,
      zIndex: nodeData.type === 'grouping' ? 0 : 10,
    }
  })
  // sort nodes by index_in_nodes_array
  const sortedNodes = [...nodes].sort((a, b) => {
    return a.data.index_in_nodes_array - b.data.index_in_nodes_array
  })

  return {
    edges,
    sortedNodes,
  }
}

export const useQueryFlow = (user: User | null | undefined, workspaceId: string) => {
  return useQuery<{ edges: Edge[]; sortedNodes: Node[] }, Error>(['flows', user], () => getFlows(user, workspaceId), {
    staleTime: Infinity,
    enabled: !!user,
  })
}
