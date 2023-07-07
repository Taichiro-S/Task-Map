import { useQueryClient, useMutation } from '@tanstack/react-query'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { supabase } from 'utils/supabase'
import { NodeData, EdgeData } from 'types/types'
import { Node, Edge } from 'reactflow'
import { loadingToast } from 'utils/toast'

function mapNodesToNodeDatas(nodes: Node[], user_id: string, workspaceId: string) {
  return nodes.map((node, index) => {
    return {
      label: node.data.label,
      position_X: node.position.x,
      position_Y: node.position.y,
      user_id: user_id,
      node_nanoid: node.id,
      type: node.type,
      color: node.data.color,
      parent_node_id: node.parentNode,
      index_in_nodes_array: index,
      height: node.data.height,
      width: node.data.width,
      memo: node.data.memo,
      status: node.data.status,
      workspace_id: workspaceId,
      url: node.data.url,
      started_at: node.data.started_at,
      ended_at: node.data.ended_at,
    }
  })
}

function mapEdgesToEdgeDatas(edges: Edge[], user_id: string, workspaceId: string) {
  return edges.map((edge) => {
    return {
      source_node_id: edge.source,
      target_node_id: edge.target,
      user_id: user_id,
      edge_nanoid: edge.id,
      type: edge.type,
      label: edge.data.label,
      animated: edge.animated,
      workspace_id: workspaceId,
    }
  })
}

export const useMutateFlow = () => {
  const queryClient = useQueryClient()
  const saveFlowMutation = useMutation({
    mutationFn: async ({ user_id, workspaceId }: { user_id: string; workspaceId: string }) => {
      const nodes = useFlowStore.getState().nodes
      const edges = useFlowStore.getState().edges
      // console.log(nodes, edges)

      const nodeDatas = mapNodesToNodeDatas(nodes, user_id, workspaceId)
      const edgeDatas = mapEdgesToEdgeDatas(edges, user_id, workspaceId)

      const [
        { data: updatedNodeDatas, error: nodesError },
        { data: updatedEdgeDatas, error: edgesError },
      ] = await Promise.all([
        supabase
          .from('nodes')
          .upsert(nodeDatas, { onConflict: 'node_nanoid' })
          .eq('user_id', user_id)
          .eq('workspace_id', workspaceId)
          .select('*'),
        supabase
          .from('edges')
          .upsert(edgeDatas, { onConflict: 'edge_nanoid' })
          .eq('user_id', user_id)
          .eq('workspace_id', workspaceId)
          .select('*'),
      ])

      if (nodesError || !updatedNodeDatas) {
        throw new Error(`Failed to upsert nodes: ${nodesError?.details}`)
      }
      if (edgesError || !updatedEdgeDatas) {
        throw new Error(`Failed to upsert edges: ${edgesError?.details}`)
      }

      const { data: dbNodes } = await supabase
        .from('nodes')
        .select('*')
        .eq('user_id', user_id)
        .eq('workspace_id', workspaceId)
      const { data: dbEdges } = await supabase
        .from('edges')
        .select('*')
        .eq('user_id', user_id)
        .eq('workspace_id', workspaceId)

      if (!dbNodes || !dbEdges) {
        throw new Error('Failed to fetch nodes or edges')
      }
      // Find the nodes and edges that exist in the database but not in the current state
      const nodesToDelete = dbNodes.filter(
        (dbNode) => !nodes.find((node) => node.id === dbNode.node_nanoid),
      )
      const edgesToDelete = dbEdges.filter(
        (dbEdge) => !edges.find((edge) => edge.id === dbEdge.edge_nanoid),
      )

      // Delete the nodes from the database
      for (const nodeToDelete of nodesToDelete) {
        const { error: nodeDeleteError } = await supabase.from('nodes').delete().match({
          node_nanoid: nodeToDelete.node_nanoid,
          user_id: user_id,
          workspace_id: workspaceId,
        })

        if (nodeDeleteError) {
          throw new Error(`${nodeDeleteError.message}: ${nodeDeleteError.details}`)
        }
      }
      // Delete the edges from the database
      for (const edgeToDelete of edgesToDelete) {
        const { error: edgeDeleteError } = await supabase.from('edges').delete().match({
          edge_nanoid: edgeToDelete.edge_nanoid,
          user_id: user_id,
          workspace_id: workspaceId,
        })

        if (edgeDeleteError) {
          throw new Error(`${edgeDeleteError.message}: ${edgeDeleteError.details}`)
        }
      }
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries(['flows'])
      const previousData = queryClient.getQueryData(['flows'])
      queryClient.setQueryData(['flows'], newData)
      loadingToast('保存中...', 'flows')
      return { previousData }
    },
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['flows'] })
    },
    onError: (err: Error, newData, context) => {
      if (context?.previousData) {
        // Check if context and context.previousData exist
        queryClient.setQueryData(['flows'], context.previousData)
      }
      throw new Error(err.message)
    },
  })
  return {
    saveFlowMutation,
  }
}
