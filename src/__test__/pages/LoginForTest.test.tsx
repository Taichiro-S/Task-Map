import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import LoginForTest from 'pages/loginForTest'
import '../utils/setup'

test('handles successful login', async () => {
  render(<LoginForTest />)

  fireEvent.change(screen.getByPlaceholderText('email'), {
    target: { value: 'valid@email.com' },
  })
  fireEvent.change(screen.getByPlaceholderText('password'), {
    target: { value: 'validpassword' },
  })
  fireEvent.click(screen.getByText('Login'))

  await waitFor(() => screen.getByText('ログインしました。'))
  expect(screen.getByText('ログインしました。')).toBeInTheDocument()
})

test('handles unsuccessful login due to invalid credentials', async () => {
  render(<LoginForTest />)

  fireEvent.change(screen.getByPlaceholderText('email'), {
    target: { value: 'invalid@email.com' },
  })
  fireEvent.change(screen.getByPlaceholderText('password'), {
    target: { value: 'invalidpassword' },
  })
  fireEvent.click(screen.getByText('Login'))

  await waitFor(() => screen.getByText('メールアドレスかパスワードが間違っています。'))
  expect(screen.getByText('メールアドレスかパスワードが間違っています。')).toBeInTheDocument()
})
