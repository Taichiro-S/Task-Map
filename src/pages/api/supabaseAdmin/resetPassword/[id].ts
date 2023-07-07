import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
)

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(404).json({ message: 'Not Found' })
  try {
    const id = req.query.id
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Bad Request' })
    }
    const newPassword = req.body.newPassword
    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      password: newPassword,
    })
    if (error) {
      return res.status(500).json({ message: error.message })
    }
    return res.status(200).json({ message: 'OK' })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' })
  }
}

export default resetPassword
