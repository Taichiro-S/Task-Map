import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
)

const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') return res.status(404).json({ message: 'Not Found' })

  try {
    const id = req.query.id
    // return new Response(JSON.stringify({ id }), { status: 200 })
    if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Bad Request' })
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (error) {
      return res.status(500).json(error)
    }
    return res.status(200).json({ message: 'OK' })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' })
  }
}

export default deleteUser
