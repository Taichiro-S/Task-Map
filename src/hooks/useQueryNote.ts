import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { NoteData } from '@/types/types'
export const useQueryNote = (user_id: string | undefined) => {
  const getNotes = async () => {
    if (!user_id) {
      throw new Error('UserNotFound')
    }
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user_id)
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
      }
    })
    return notes as NoteData[]
  }

  return useQuery<NoteData[], Error>(['notes', user_id], getNotes, {
    staleTime: Infinity,
    enabled: !!user_id,
  })
}
