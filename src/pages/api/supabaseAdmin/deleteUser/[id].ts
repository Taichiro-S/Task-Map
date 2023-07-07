import { supabaseAdmin } from 'utils/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

// const res = (req: any) => new Response('Hello world!')

// export default res

const deleteUser = async (req: NextRequest, res: NextResponse) => {
  if (req.method !== 'DELETE') return new Response(null, { status: 404, statusText: 'Not Found' })

  try {
    const id = req.nextUrl.searchParams.get('id')
    // return new Response(JSON.stringify({ id }), { status: 200 })
    if (!id) return new Response(null, { status: 400, statusText: 'Bad Request' })
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (error) {
      return new Response(JSON.stringify(error), { status: 501 })
    }
    return new Response('OK', { status: 200 })
  } catch (e) {
    // console.log(e)
    return new Response(null, { status: 400, statusText: 'Bad Request' })
  }
}

export default deleteUser
