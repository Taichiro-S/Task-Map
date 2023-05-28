// import { useQueryClient, useMutation } from '@tanstack/react-query'
// import useStore from 'stores/flowStore'
// import { supabase } from 'utils/supabase'
// import { NodeData } from 'types/types'

// export const useOptimisticMutateNode = () => {
//   const queryClient = useQueryClient()

//   const createNodeMutation: any = useMutation(
//     async (newNode: Omit<NodeData, 'id' | 'created_at'>) => {
//       const { data, error } = await supabase.from('nodes').insert(newNode)
//       if (error) throw new Error(`${error.message}: ${error.details}`)
//       return data
//     },
//     {
//       onMutate: (res: any) => {
//         queryClient.cancelQueries(['nodes'])
//         const previousNodes = queryClient.getQueryData(['nodes'])
//         queryClient.setQueryData(['nodes'], [...previousNodes, res[0]])
//         return { previousNodes }
//       },
//       onSuccess: (res: any) => {
//         const previousNodes = queryClient.getQueryData<Omit<NodeData, 'id' | 'created_at'>[]>(['nodes'])
//         if (previousNodes) {
//           queryClient.setQueryData(['nodes'], [...previousNodes, newNode])
//           // localStorage.setItem(
//           //   'nodes',
//           //   JSON.stringify(queryClient.getQueryData(['nodes'])),
//           // )
//         }
//       },
//     },
//   )

//   const updateNodeMutation = useMutation(async (updatedNode: Omit<NodeData, 'id' | 'created_at'>) => {
//     const previousNodes = queryClient.getQueryData<Omit<NodeData, 'id' | 'created_at'>[]>(['nodes'])
//     if (previousNodes) {
//       queryClient.setQueryData(
//         ['nodes'],
//         previousNodes.map((node) => (node.node_nanoid === updatedNode.node_nanoid ? updatedNode : node)),
//       )
//       // localStorage.setItem(
//       //   'nodes',
//       //   JSON.stringify(queryClient.getQueryData(['nodes'])),
//       // )
//     }
//   })

//   const deleteNodeMutation = useMutation(async (node_nanoid: string) => {
//     const previousNodes = queryClient.getQueryData<Omit<NodeData, 'id' | 'created_at'>[]>(['nodes'])
//     if (previousNodes) {
//       queryClient.setQueryData(
//         ['nodes'],
//         previousNodes.filter((node) => node.node_nanoid !== node_nanoid),
//       )
//       // localStorage.setItem(
//       //   'nodes',
//       //   JSON.stringify(queryClient.getQueryData(['nodes'])),
//       // )
//     }
//   })

//   const saveNodeMutation = useMutation(
//     async () => {
//       const nodes = queryClient.getQueryData<Omit<NodeData, 'id' | 'created_at'>[]>(['nodes'])
//       console.log(nodes)
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['nodes'])
//       },
//       onError: (err: any) => {
//         alert(err)
//       },
//     },
//   )

//   return {
//     createNodeMutation,
//     updateNodeMutation,
//     deleteNodeMutation,
//     saveNodeMutation,
//   }
// }
