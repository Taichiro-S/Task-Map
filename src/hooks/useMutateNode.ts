import { useQueryClient, useMutation } from '@tanstack/react-query'
import useStore from 'stores/flowStore'
import { supabase } from 'utils/supabase'
import { NodeData, NoteData } from 'types/types'
import { Node, NodeChange, applyNodeChanges } from 'reactflow'
import { nanoid } from 'nanoid'
export const useMutateNode = () => {
  const queryClient = useQueryClient()

  // const addNewNodeMutation: any = useMutation({
  //   mutationFn: async () => {
  //     const newNode = {
  //       id: nanoid(),
  //       type: 'custom',
  //       data: { label: '' },
  //       position: { x: 0, y: 0 },
  //     }
  //     const previousNodes = queryClient.getQueryData<Node[]>(['nodes'])
  //     if (previousNodes) {
  //       queryClient.setQueryData(['nodes'], [...previousNodes, newNode])
  //     }
  //   },
  // })

  // const onNodesChange: any = useMutation({
  //   mutationFn: async (changes: NodeChange[]) => {
  //     const previousNodes = queryClient.getQueryData<Node[]>(['nodes'])
  //     if (previousNodes) {
  //       queryClient.setQueryData(
  //         ['nodes'],
  //         applyNodeChanges(changes, previousNodes),
  //       )
  //     }
  //   },
  // })

  // const createNodeMutation: any = useMutation(
  //   async (newNode: Omit<NodeData, 'id' | 'created_at'>) => {
  //     const previousNodes = queryClient.getQueryData<
  //       Omit<NodeData, 'id' | 'created_at'>[]
  //     >(['nodes'])
  //     if (previousNodes) {
  //       queryClient.setQueryData(['nodes'], [...previousNodes, newNode])
  //       // localStorage.setItem(
  //       //   'nodes',
  //       //   JSON.stringify(queryClient.getQueryData(['nodes'])),
  //       // )
  //     }
  //   },
  // )

  // const updateNodeMutation = useMutation(
  //   async (updatedNode: Omit<NodeData, 'id' | 'created_at'>) => {
  //     const previousNodes = queryClient.getQueryData<
  //       Omit<NodeData, 'id' | 'created_at'>[]
  //     >(['nodes'])
  //     if (previousNodes) {
  //       queryClient.setQueryData(
  //         ['nodes'],
  //         previousNodes.map((node) =>
  //           node.node_nanoid === updatedNode.node_nanoid ? updatedNode : node,
  //         ),
  //       )
  //       // localStorage.setItem(
  //       //   'nodes',
  //       //   JSON.stringify(queryClient.getQueryData(['nodes'])),
  //       // )
  //     }
  //   },
  // )

  // const deleteNodeMutation = useMutation(async (node_nanoid: string) => {
  //   const previousNodes = queryClient.getQueryData<
  //     Omit<NodeData, 'id' | 'created_at'>[]
  //   >(['nodes'])
  //   if (previousNodes) {
  //     queryClient.setQueryData(
  //       ['nodes'],
  //       previousNodes.filter((node) => node.node_nanoid !== node_nanoid),
  //     )
  //     // localStorage.setItem(
  //     //   'nodes',
  //     //   JSON.stringify(queryClient.getQueryData(['nodes'])),
  //     // )
  //   }
  // })

  const saveNodeMutation = useMutation({
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

      // Upsert nodes
      const { data: updatedNodeDatas, error: nodesError } = await supabase
        .from('nodes')
        .upsert(nodeDatas, { onConflict: 'node_nanoid' })
        .select('*')

      if (nodesError) {
        throw new Error(`${nodesError.message}: ${nodesError.details}`)
      }

      // Fetch all nodes in the database for this user
      const { data: allNodes, error: nodefetchError } = await supabase.from('nodes').select('*').eq('user_id', user_id)

      if (nodefetchError) {
        throw new Error(`${nodefetchError.message}: ${nodefetchError.details}`)
      }
      // Find the nodes that exist in the database but not in the current state
      const nodesToDelete = allNodes.filter((dbNode) => !nodes.find((node) => node.id === dbNode.node_nanoid))

      // Delete the nodes from the database
      for (const nodeToDelete of nodesToDelete) {
        const { error: nodeDeleteError } = await supabase
          .from('nodes')
          .delete()
          .match({ node_nanoid: nodeToDelete.node_nanoid, user_id: user_id })

        if (nodeDeleteError) {
          throw new Error(`${nodeDeleteError.message}: ${nodeDeleteError.details}`)
        }
      }

      if (!updatedNodeDatas) {
        throw new Error('No nodes found')
      }

      return updatedNodeDatas
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] })
    },
    onError: (err: any) => {
      alert(err)
    },
  })

  return {
    saveNodeMutation,
  }
}
