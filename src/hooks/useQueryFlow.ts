import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { Node, Edge } from 'reactflow'
import { User } from '@supabase/supabase-js'
import { getSessionUser } from 'hooks'
import { useEffect } from 'react'

export const getFlows = async (userId: string | null, workspaceId: string | null) => {
  const user = await getSessionUser()
  if (!user) {
    throw new Error('User is not logged in')
  } else if (user.id !== userId) {
    throw new Error('page not found')
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
        url: nodeData.url,
        started_at: nodeData.started_at,
        ended_at: nodeData.ended_at,
        open: false,
      },
      parentNode: nodeData.parent_node_id,
      zIndex: nodeData.type === 'grouping' ? 0 : 10,
    }
  })
  //
  const sortedNodes = [...nodes].sort((a, b) => {
    return a.data.index_in_nodes_array - b.data.index_in_nodes_array
  })

  return {
    edges,
    sortedNodes,
  }
}

export const useQueryFlow = (userId: string | null, workspaceId: string | null) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (userId && workspaceId) {
      // If userId and workspaceId are truthy, remove any previous 'flows' query with null userId and workspaceId
      queryClient.removeQueries(['flows', null, null])
    }
  }, [userId, workspaceId, queryClient])
  return useQuery<{ edges: Edge[]; sortedNodes: Node[] }, Error>(
    ['flows', userId, workspaceId],
    () => getFlows(userId, workspaceId),
    {
      staleTime: Infinity,
      enabled: !!workspaceId && !!userId,
    },
  )
}
