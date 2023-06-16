import { render, screen } from '@testing-library/react'
import '../utils/setup'
import { TestExample } from 'components'

describe('コンポーネントテスト例', () => {
  test('Hello Worldが表示されるか', async () => {
    render(<TestExample />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
