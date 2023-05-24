import { useQuery } from '@tanstack/react-query'
import { supabase } from 'utils/supabase'
import { CommentData } from 'types/types'
export const useQueryComment = (workspaceId: string) => {
  const getComments = async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('workspace_id', workspaceId)
    if (error) {
      throw new Error(`${error.message}: ${error.details}`)
    }
    if (!data) {
      throw new Error('No notes found')
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

  return useQuery<CommentData[], Error>(
    ['comments', workspaceId],
    getComments,
    {
      staleTime: Infinity,
      enabled: !!workspaceId,
    },
  )
}
