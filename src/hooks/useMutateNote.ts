import { useQueryClient, useMutation } from '@tanstack/react-query'
import useStore from '@/store'
import { supabase } from '@/utils/supabase'
import { NoteData } from '@/types/types'

export const useMutateNote = () => {
  const queryClient = useQueryClient()

  // const addNewNoteMutation: any = useMutation({
  //   mutationFn: async () => {
  //     const newNote = {
  //       id: nanoid(),
  //       type: 'custom',
  //       data: { label: '' },
  //       position: { x: 0, y: 0 },
  //     }
  //     const previousNotes = queryClient.getQueryData<Note[]>(['notes'])
  //     if (previousNotes) {
  //       queryClient.setQueryData(['notes'], [...previousNotes, newNote])
  //     }
  //   },
  // })

  // const onNotesChange: any = useMutation({
  //   mutationFn: async (changes: NoteChange[]) => {
  //     const previousNotes = queryClient.getQueryData<Note[]>(['notes'])
  //     if (previousNotes) {
  //       queryClient.setQueryData(
  //         ['notes'],
  //         applyNoteChanges(changes, previousNotes),
  //       )
  //     }
  //   },
  // })

  // const createNoteMutation: any = useMutation(
  //   async (newNote: Omit<NoteData, 'id' | 'created_at'>) => {
  //     const previousNotes = queryClient.getQueryData<
  //       Omit<NoteData, 'id' | 'created_at'>[]
  //     >(['notes'])
  //     if (previousNotes) {
  //       queryClient.setQueryData(['notes'], [...previousNotes, newNote])
  //       // localStorage.setItem(
  //       //   'notes',
  //       //   JSON.stringify(queryClient.getQueryData(['notes'])),
  //       // )
  //     }
  //   },
  // )

  // const updateNoteMutation = useMutation(
  //   async (updatedNote: Omit<NoteData, 'id' | 'created_at'>) => {
  //     const previousNotes = queryClient.getQueryData<
  //       Omit<NoteData, 'id' | 'created_at'>[]
  //     >(['notes'])
  //     if (previousNotes) {
  //       queryClient.setQueryData(
  //         ['notes'],
  //         previousNotes.map((note) =>
  //           note.Note_nanoid === updatedNote.Note_nanoid ? updatedNote : note,
  //         ),
  //       )
  //       // localStorage.setItem(
  //       //   'notes',
  //       //   JSON.stringify(queryClient.getQueryData(['notes'])),
  //       // )
  //     }
  //   },
  // )

  // const deleteNoteMutation = useMutation(async (Note_nanoid: string) => {
  //   const previousNotes = queryClient.getQueryData<
  //     Omit<NoteData, 'id' | 'created_at'>[]
  //   >(['notes'])
  //   if (previousNotes) {
  //     queryClient.setQueryData(
  //       ['notes'],
  //       previousNotes.filter((note) => note.Note_nanoid !== Note_nanoid),
  //     )
  //     // localStorage.setItem(
  //     //   'notes',
  //     //   JSON.stringify(queryClient.getQueryData(['notes'])),
  //     // )
  //   }
  // })

  const saveNoteMutation = useMutation({
    mutationFn: async (user_id: string | undefined) => {
      const notes = useStore.getState().notes

      const noteDatas: Omit<NoteData, 'id' | 'created_at'>[] = notes.map(
        (note) => {
          return {
            node_nanoid: note.node_nanoid,
            user_id: user_id,
            content: note.content,
          }
        },
      )

      // Upsert notes
      const { data, error } = await supabase
        .from('notes')
        .upsert(noteDatas, { onConflict: 'node_nanoid' })
        .select('*')

      if (error) {
        throw new Error(`${error.message}: ${error.details}`)
      }

      // Fetch all notes in the database for this user
      const { data: allNotes, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user_id)

      if (fetchError) {
        throw new Error(`${fetchError.message}: ${fetchError.details}`)
      }

      // Find the notes that exist in the database but not in the current state
      const notesToDelete = allNotes.filter(
        (dbNote) =>
          !notes.find((note) => note.node_nanoid === dbNote.node_nanoid),
      )

      // Delete the notes from the database
      for (const noteToDelete of notesToDelete) {
        const { error: deleteError } = await supabase
          .from('notes')
          .delete()
          .match({ note_nanoid: noteToDelete.note_nanoid, user_id: user_id })

        if (deleteError) {
          throw new Error(`${deleteError.message}: ${deleteError.details}`)
        }
      }
      if (!data) {
        throw new Error('No notes found')
      }
      return data
    },
    onSuccess: (res: any) => {
      // queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
    onError: (err: any) => {
      alert(err)
    },
  })

  return {
    saveNoteMutation,
  }
}
