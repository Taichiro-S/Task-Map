import { useQueryClient, useMutation } from '@tanstack/react-query'
import useStore from 'stores/flowStore'
import { supabase } from 'utils/supabase'
import { NodeData, EdgeData } from 'types/types'

export const useMutateFlow = () => {
  const queryClient = useQueryClient()
  const saveFlowMutation = useMutation({
    mutationFn: async ({ user_id, workspaceId }: { user_id: string; workspaceId: string }) => {
      const nodes = useStore.getState().nodes
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
        }
      })

      const edges = useStore.getState().edges
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

      // const notes = useStore.getState().notes
      // const noteDatas: Omit<NoteData, 'id' | 'created_at'>[] = notes.map((note) => {
      //   return {
      //     user_id: user_id,
      //     node_nanoid: note.node_nanoid,
      //     content: note.content,
      //     title: note.title,
      //     workspace_id: workspaceId,
      //   }
      // })

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

      // Upsert notes
      // const { data: updatedNoteDatas, error: notesError } = await supabase
      //   .from('notes')
      //   .upsert(noteDatas, { onConflict: 'node_nanoid' })
      //   .eq('user_id', user_id)
      //   .eq('workspace_id', workspaceId)
      //   .select('*')

      if (nodesError || edgesError) {
        throw new Error('Failed to upsert flow')
      }

      // Fetch all nodes in the database for this user and workspace
      // const { data: allNodes, error: nodefetchError } = await supabase
      //   .from('nodes')
      //   .select('*')
      //   .eq('user_id', user_id)
      //   .eq('workspace_id', workspaceId)

      // if (nodefetchError) {
      //   throw new Error(`${nodefetchError.message}: ${nodefetchError.details}`)
      // }

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
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] })
      queryClient.invalidateQueries({ queryKey: ['edges'] })
    },
    onError: (err: any) => {
      alert(err)
    },
  })

  return {
    saveFlowMutation,
  }
}
