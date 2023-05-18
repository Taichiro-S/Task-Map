import { useQueryClient, useMutation } from '@tanstack/react-query'
import useStore from '@/store'
import { supabase } from '@/utils/supabase'
import { NodeData } from '@/types/types'

export const useMutateTask = () => {
  const queryClient = useQueryClient()

  const createTaskMutation: any = useMutation(
    async (nodes: Array<Omit<NodeData, 'id' | 'created_at'>>) => {
      const { data, error } = await supabase.from('todos').insert(nodes)
      if (error) throw new Error(`${error.message}: ${error.details}`)
      return data
    },
    {
      onSuccess: (res: any) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTasks) {
          queryClient.setQueryData(['todos'], [...previousTasks, res[0]])
        }
        reset()
      },
      onError: (err: any) => {
        alert(err)
        reset()
      },
    },
  )

  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ title: task.title })
        .eq('id', task.id)
      if (error) throw new Error(`${error.message}: ${error.details}`)
      return data
    },
    {
      onSuccess: (res: any, variables: any) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTasks) {
          queryClient.setQueryData(
            ['todos'],
            previousTasks.map((task) =>
              task.id === variables.id ? res[0] : task,
            ),
          )
        }
        reset()
      },
      onError: (err) => {
        alert(err)
        reset()
      },
    },
  )

  const deleteTaskMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('todos').delete().eq('id', id)
      if (error) throw new Error(`${error.message}: ${error.details}`)
      return data
    },
    {
      onSuccess: (_: any, variables: any) => {
        const previousTasks = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTasks) {
          queryClient.setQueryData(
            ['todos'],
            previousTasks.filter((task) => task.id !== variables),
          )
        }
        reset()
      },
      onError: (err) => {
        alert(err)
        reset()
      },
    },
  )
  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  }
}
