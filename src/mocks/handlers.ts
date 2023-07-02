import { rest } from 'msw'

const API_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_URL

const authEndpoint = `${API_ENDPOINT}/auth/v1/token`
export const handlers = [
  rest.post(authEndpoint, async (req, res, ctx) => {
    const userInput = await req.json()
    // login with valid credentials
    if (userInput.email === 'valid@email.com' && userInput.password === 'validpassword') {
      return res(ctx.status(200), ctx.json({ access_token: 'test_token', token_type: 'bearer' }))
    }
    // login with invalid credentials
    return res(ctx.status(401), ctx.json({ error: 'メールアドレスかパスワードが間違っています。' }))
  }),

  // You would also add handlers for sign up and sign out here...
]
