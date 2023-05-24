import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { NoteData } from 'types/types'
export const useQueryNote = (userId: string | undefined) => {
  const getNotes = async () => {
    if (!userId) {
      throw new Error('UserNotFound')
    }
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
    if (error) {
      throw new Error(`${error.message}: ${error.details}`)
    }
    if (!data) {
      throw new Error('No notes found')
    }
    const notes = data.map((note) => {
      return {
        id: note.id,
        user_id: note.user_id,
        node_nanoid: note.node_nanoid,
        content: note.content,
        created_at: note.created_at,
        title: note.title,
      }
    })
    return notes as NoteData[]
  }

  return useQuery<NoteData[], Error>(['notes', userId], getNotes, {
    staleTime: Infinity,
    enabled: !!userId,
  })
}
