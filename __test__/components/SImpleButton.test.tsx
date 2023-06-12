import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SimpleButton } from 'components'

test('ボタンをクリックするとON/OFFの表示が切り替わる', async () => {
  render(<SimpleButton />)
  const user = userEvent.setup()
  const simpleButton = screen.getByRole('button')
  // ボタンのテキストがOFFであることを確認
  expect(simpleButton).toHaveTextContent('OFF')
  // ボタンをクリック
  await user.click(simpleButton)
  // ボタンのテキストがONであることを確認
  expect(simpleButton).toHaveTextContent('ON')
})
