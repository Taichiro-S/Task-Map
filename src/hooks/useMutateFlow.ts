import { useQueryClient, useMutation } from '@tanstack/react-query'
import { FlowState, useFlowStore } from 'stores/flowStore'
import { supabase } from 'utils/supabase'
import { NodeData, EdgeData } from 'types/types'
import { loadingToast } from 'utils/toast'
import { toast } from 'react-toastify'

export const useMutateFlow = () => {
  const queryClient = useQueryClient()
  const saveFlowMutation = useMutation({
    mutationFn: async ({ user_id, workspaceId }: { user_id: string; workspaceId: string }) => {
      const nodes = useFlowStore.getState().nodes
      // console.log('storeNodes', nodes)

      const nodeDatas: Omit<NodeData, 'id' | 'created_at'>[] = nodes.map((node) => {
        return {
          label: node.data.label,
          position_X: node.position.x,
          position_Y: node.position.y,
          user_id: user_id,
          node_nanoid: node.id,
          type: node.type,
          color: node.data.color,
          parent_node_id: node.parentNode,
          index_in_nodes_array: nodes.indexOf(node),
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

      const edges = useFlowStore.getState().edges
      const edgeDatas: Omit<EdgeData, 'id' | 'created_at'>[] = edges.map((edge) => {
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

      console.log(user_id, workspaceId)

      // Upsert nodes
      const { data: updatedNodeDatas, error: nodesError } = await supabase
        .from('nodes')
        .upsert(nodeDatas, { onConflict: 'node_nanoid' })
        .eq('user_id', user_id)
        .eq('workspace_id', workspaceId)
        .select('*')

      // Upsert edges
      const { data: updatedEdgeDatas, error: edgesError } = await supabase
        .from('edges')
        .upsert(edgeDatas, { onConflict: 'edge_nanoid' })
        .eq('user_id', user_id)
        .eq('workspace_id', workspaceId)
        .select('*')

      if (nodesError || edgesError) {
        throw new Error('Failed to upsert flow')
      }

      // Find the nodes and edges that exist in the database but not in the current state
      const nodesToDelete = updatedNodeDatas.filter((dbNode) => !nodes.find((node) => node.id === dbNode.node_nanoid))
      const edgesToDelete = updatedEdgeDatas.filter((dbEdge) => !edges.find((edge) => edge.id === dbEdge.edge_nanoid))
      // Delete the nodes from the database
      for (const nodeToDelete of nodesToDelete) {
        const { error: nodeDeleteError } = await supabase
          .from('nodes')
          .delete()
          .match({ node_nanoid: nodeToDelete.node_nanoid, user_id: user_id, workspace_id: workspaceId })

        if (nodeDeleteError) {
          throw new Error(`${nodeDeleteError.message}: ${nodeDeleteError.details}`)
        }
      }
      // Delete the edges from the database
      for (const edgeToDelete of edgesToDelete) {
        const { error: edgeDeleteError } = await supabase
          .from('edges')
          .delete()
          .match({ edge_nanoid: edgeToDelete.edge_nanoid, user_id: user_id, workspace_id: workspaceId })

        if (edgeDeleteError) {
          throw new Error(`${edgeDeleteError.message}: ${edgeDeleteError.details}`)
        }
      }
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['flows'])
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['flows'])
      // Optimistically update to the new value
      queryClient.setQueryData(['flows'], newData)
      loadingToast('保存中...', 'flows')
      return { previousData }
    },
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['flows'] })
    },
    onError: (err: Error, newData, context) => {
      if (context) {
        queryClient.setQueryData(['flows'], context.previousData)
      }
      throw new Error(err.message)
    },
  })

  return {
    saveFlowMutation,
  }
}
