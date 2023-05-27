import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { NoteData } from 'types/types'
import { User } from '@supabase/supabase-js'

export const useQueryNote = (user: User | null | undefined) => {
  const getNotes = async () => {
    if (!user || user === null) {
      throw new Error('User is not logged in')
    }
    const { data, error } = await supabase.from('notes').select('*').eq('user_id', user.id)
    if (!data) {
      throw new Error('Failed to fetch commentData')
    }
    if (error) {
      throw new Error('Error fetching commentData')
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

  return useQuery<NoteData[], Error>(['notes', user], getNotes, {
    staleTime: Infinity,
    enabled: !!user,
  })
}
