import useStore, { RFState } from '@/store'
import { useMutateNode } from '@/hooks/useMutateNode'
import { useMutateEdge } from '@/hooks/useMutateEdge'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'

async function getUserId() {
  return (await supabase.auth.getUser()).data?.user?.id
}
const MenuBar = () => {
  const { saveNodeMutation } = useMutateNode()
  const { saveEdgeMutation } = useMutateEdge()

  const addNewNode = useStore((state) => state.addNewNode)
  const [userId, setUserId] = useState<string | undefined>('')
  useEffect(() => {
    getUserId().then((id) => setUserId(id))
  }, [])
  return (
    <div className="w-1/2 h-1/10 bg-white absolute bottom-20 right-20 z-50 rounded-2xl drop-shadow-md">
      <span>MenuBar</span>
      <button
        className="w-10 h-10 bg-blue-500 rounded-full text-white"
        onClick={() => addNewNode()}
      >
        +
      </button>
      <button
        className="w-10 h-10 bg-blue-500  text-white"
        onClick={() => {
          saveNodeMutation.mutate(userId)
          saveEdgeMutation.mutate(userId)
        }}
      >
        Save
      </button>
      <Link href="/login">
        <span className="cursor-pointer hover:text-blue-600">ログイン</span>
      </Link>
    </div>
  )
}
export default MenuBar
