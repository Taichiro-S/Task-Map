// import { useQueryClient, useMutation } from '@tanstack/react-query'
// import useStore from 'stores/flowStore'
// import { supabase } from 'utils/supabase'
// import { NodeData, NoteData } from 'types/types'
// import { Node, NodeChange, applyNodeChanges } from 'reactflow'
// import { nanoid } from 'nanoid'
// export const useMutateNote = () => {
//   const queryClient = useQueryClient()

//   const saveNoteMutation = useMutation({
//     mutationFn: async ({ user_id, workspaceId }: { user_id: string; workspaceId: string }) => {
//       const notes = useStore.getState().notes
//       console.log('storeNodes', notes)
//       const noteDatas: Omit<NoteData, 'id' | 'created_at'>[] = notes.map((note) => {
//         return {
//           node_nanoid: note.node_nanoid,
//           user_id: user_id,
//           content: note.content,
//           title: note.title,
//           workspace_id: workspaceId,
//         }
//       })

//       // Upsert notes
//       const { data: updatedNoteDatas, error: NoteError } = await supabase
//         .from('notes')
//         .upsert(noteDatas, { onConflict: 'node_nanoid' })
//         .select('*')

//       if (NoteError) {
//         throw new Error(`${NoteError.message}: ${NoteError.details}`)
//       }

//       const { data: allNotes, error: notefetchError } = await supabase.from('notes').select('*').eq('user_id', user_id)

//       if (notefetchError) {
//         throw new Error(`${notefetchError.message}: ${notefetchError.details}`)
//       }
//       // Find the notes that exist in the database but not in the current state
//       const notesToDelete = allNotes.filter((dbNote) => !notes.find((note) => note.node_nanoid === dbNote.node_nanoid))

//       for (const noteToDelete of notesToDelete) {
//         const { error: noteDeleteError } = await supabase
//           .from('notes')
//           .delete()
//           .match({ node_nanoid: noteToDelete.node_nanoid, user_id: user_id })

//         if (noteDeleteError) {
//           throw new Error(`${noteDeleteError.message}: ${noteDeleteError.details}`)
//         }
//       }
//       if (!updatedNoteDatas) {
//         throw new Error('No notes found')
//       }

//       return updatedNoteDatas
//     },
//     onSuccess: (res: any) => {
//       queryClient.invalidateQueries({ queryKey: ['notes'] })
//     },
//     onError: (err: any) => {
//       alert(err)
//     },
//   })

//   return {
//     saveNoteMutation,
//   }
// }
