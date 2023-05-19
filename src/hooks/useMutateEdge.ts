import { useQueryClient, useMutation } from '@tanstack/react-query'
import useStore from '@/store'
import { supabase } from '@/utils/supabase'
import { EdgeData } from '@/types/types'

export const useMutateEdge = () => {
  const queryClient = useQueryClient()

  const createEdgeMutation: any = useMutation(
    async (newEdge: Omit<EdgeData, 'id' | 'created_at'>) => {
      const previousEdges = queryClient.getQueryData<
        Omit<EdgeData, 'id' | 'created_at'>[]
      >(['edges'])
      if (previousEdges) {
        queryClient.setQueryData(['edges'], [...previousEdges, newEdge])
        // localStorage.setItem(
        //   'edges',
        //   JSON.stringify(queryClient.getQueryData(['edges'])),
        // )
      }
    },
  )

  const updateEdgeMutation = useMutation(
    async (updatedEdge: Omit<EdgeData, 'id' | 'created_at'>) => {
      const previousEdges = queryClient.getQueryData<
        Omit<EdgeData, 'id' | 'created_at'>[]
      >(['edges'])
      if (previousEdges) {
        queryClient.setQueryData(
          ['edges'],
          previousEdges.map((edge) =>
            edge.edge_nanoid === updatedEdge.edge_nanoid ? updatedEdge : edge,
          ),
        )
        // localStorage.setItem(
        //   'edges',
        //   JSON.stringify(queryClient.getQueryData(['edges'])),
        // )
      }
    },
  )

  const deleteEdgeMutation = useMutation(async (edge_nanoid: string) => {
    const previousEdges = queryClient.getQueryData<
      Omit<EdgeData, 'id' | 'created_at'>[]
    >(['edges'])
    if (previousEdges) {
      queryClient.setQueryData(
        ['edges'],
        previousEdges.filter((edge) => edge.edge_nanoid !== edge_nanoid),
      )
      // localStorage.setItem(
      //   'edges',
      //   JSON.stringify(queryClient.getQueryData(['edges'])),
      // )
    }
  })

  const saveEdgeMutation = useMutation({
    mutationFn: async (user_id: string | undefined) => {
      const edges = useStore.getState().edges
      console.log('storeEdges', edges)
      const edgeDatas: Omit<EdgeData, 'id' | 'created_at'>[] = edges.map(
        (edge) => {
          return {
            source_node_id: edge.source,
            target_node_id: edge.target,
            user_id: user_id,
            edge_nanoid: edge.id,
            type: edge.type,
            label: edge.data.label,
          }
        },
      )
      const { data, error } = await supabase
        .from('edges')
        .upsert(edgeDatas, { onConflict: 'edge_nanoid' })
        .select('*')
      if (error) {
        throw new Error(`${error.message}: ${error.details}`)
      }
      // Fetch all nodes in the database for this user
      const { data: allEdges, error: fetchError } = await supabase
        .from('edges')
        .select('*')
        .eq('user_id', user_id)

      if (fetchError) {
        throw new Error(`${fetchError.message}: ${fetchError.details}`)
      }

      // Find the edges that exist in the database but not in the current state
      const edgesToDelete = allEdges.filter(
        (dbEdge) => !edges.find((edge) => edge.id === dbEdge.edge_nanoid),
      )

      // Delete the edges from the database
      for (const edgeToDelete of edgesToDelete) {
        const { error: deleteError } = await supabase
          .from('edges')
          .delete()
          .match({ edge_nanoid: edgeToDelete.edge_nanoid, user_id: user_id })

        if (deleteError) {
          throw new Error(`${deleteError.message}: ${deleteError.details}`)
        }
      }

      if (!data) {
        throw new Error('No edges found')
      }

      return data
    },

    onSuccess: (res: any) => {
      // queryClient.resetQueries({ queryKey: ['edge'] })
    },
    onError: (err: any) => {
      alert(err)
    },
  })

  return {
    createEdgeMutation,
    updateEdgeMutation,
    deleteEdgeMutation,
    saveEdgeMutation,
  }
}
