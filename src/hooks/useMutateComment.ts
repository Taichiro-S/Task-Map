// import { useQueryClient, useMutation } from '@tanstack/react-query'
// import useStore from 'stores/flowStore'
// import { supabase } from 'utils/supabase'
// import { CommentData } from 'types/types'

// export const useMutateComment = () => {
//   const queryClient = useQueryClient()
//   const createCommentMutation: any = useMutation(
//     async (newComment: Omit<CommentData, 'id' | 'created_at' | 'updated_at'>) => {
//       const previousComments = queryClient.getQueryData<Omit<CommentData, 'id' | 'created_at'>[]>(['comments'])
//       if (previousComments) {
//         queryClient.setQueryData(['comments'], [...previousComments, newComment])
//         // localStorage.setItem(
//         //   'comments',
//         //   JSON.stringify(queryClient.getQueryData(['comments'])),
//         // )
//       }
//     },
//   )

//   const updateCommentMutation = useMutation(async (updatedComment: Omit<CommentData, 'created_at'>) => {
//     const previousComments = queryClient.getQueryData<CommentData[]>(['comments'])
//     if (previousComments) {
//       queryClient.setQueryData(
//         ['comments'],
//         previousComments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
//       )
//       // localStorage.setItem(
//       //   'comments',
//       //   JSON.stringify(queryClient.getQueryData(['comments'])),
//       // )
//     }
//   })

//   const deleteCommentMutation = useMutation(async (comment_nanoid: string) => {
//     const previousComments = queryClient.getQueryData<Omit<CommentData, 'id' | 'created_at'>[]>(['comments'])
//     if (previousComments) {
//       queryClient.setQueryData(
//         ['comments'],
//         previouscomments.filter((comment) => comment.comment_nanoid !== comment_nanoid),
//       )
//       // localStorage.setItem(
//       //   'comments',
//       //   JSON.stringify(queryClient.getQueryData(['comments'])),
//       // )
//     }
//   })

//   const saveCommentMutation = useMutation({
//     mutationFn: async (user_id: string | undefined) => {
//       const comments = useStore.getState().comments
//       // console.log('storeComments', comments)
//       const commentDatas: Omit<CommentData, 'id' | 'created_at'>[] = comments.map((comment) => {
//         return {
//           source_node_id: comment.source,
//           target_node_id: comment.target,
//           user_id: user_id,
//           comment_nanoid: comment.id,
//           type: comment.type,
//           label: comment.data.label,
//           animated: comment.animated,
//         }
//       })
//       const { data, error } = await supabase
//         .from('comments')
//         .upsert(commentDatas, { onConflict: 'comment_nanoid' })
//         .select('*')
//       if (error) {
//         throw new Error(`${error.message}: ${error.details}`)
//       }
//       // Fetch all nodes in the database for this user
//       const { data: allComments, error: fetchError } = await supabase
//         .from('comments')
//         .select('*')
//         .eq('user_id', user_id)

//       if (fetchError) {
//         throw new Error(`${fetchError.message}: ${fetchError.details}`)
//       }

//       // Find the comments that exist in the database but not in the current state
//       const commentsToDelete = allComments.filter(
//         (dbComment) => !comments.find((comment) => comment.id === dbComment.comment_nanoid),
//       )

//       // Delete the comments from the database
//       for (const commentToDelete of commentsToDelete) {
//         const { error: deleteError } = await supabase.from('comments').delete().match({
//           comment_nanoid: commentToDelete.comment_nanoid,
//           user_id: user_id,
//         })

//         if (deleteError) {
//           throw new Error(`${deleteError.message}: ${deleteError.details}`)
//         }
//       }

//       if (!data) {
//         throw new Error('No comments found')
//       }

//       return data
//     },

//     onSuccess: (res: any) => {
//       // queryClient.resetQueries({ queryKey: ['comment'] })
//     },
//     onError: (err: any) => {
//       alert(err)
//     },
//   })

//   return {
//     createCommentMutation,
//     updateCommentMutation,
//     deleteCommentMutation,
//     saveCommentMutation,
//   }
// }
