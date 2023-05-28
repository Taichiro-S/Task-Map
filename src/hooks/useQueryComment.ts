import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { CommentData } from 'types/types'

export const useQueryComment = (workspaceId: string) => {
  const getComments = async () => {
    if (!workspaceId) {
      throw new Error('workspaceId undefined')
    }
    const { data, error } = await supabase.from('comments').select('*').eq('workspace_id', workspaceId)
    if (!data) {
      throw new Error('Failed to fetch commentData')
    }
    if (error) {
      throw new Error('Error fetching commentData')
    }

    const comments = data.map((comment) => {
      return {
        id: comment.id,
        user_id: comment.user_id,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        node_nanoid: comment.node_nanoid,
        content: comment.title,
      }
    })
    return comments as CommentData[]
  }

  return useQuery<CommentData[], Error>(['comments', workspaceId], getComments, {
    staleTime: Infinity,
    enabled: !!workspaceId,
  })
}
