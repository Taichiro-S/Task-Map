import { render, screen } from '@testing-library/react'

import TestExample from 'components/TestExample'

describe('コンポーネントテスト例', () => {
  test('Hello Worldが表示されるか', async () => {
    render(<TestExample />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
