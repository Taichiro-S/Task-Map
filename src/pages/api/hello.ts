import { NextRequest, NextResponse } from 'next/server'
// export { config } from 'utils/api.config'

export const config = {
  runtime: 'edge',
}

export default function res(req: NextRequest, res: NextResponse) {
  return new Response('Hello world!')
}
