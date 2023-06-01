import userEvent from '@testing-library/user-event'
import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import 'test/utils/setup' // setupファイルのインポート
import Mocktest from 'pages/mocktest'

// const server = setupServer(...handlers)
let mockLog: jest.SpyInstance

// beforeAll(() => server.listen())
beforeEach(() => {
  mockLog = jest.spyOn(console, 'log')
})
afterEach(() => {
  //   server.resetHandlers()
  mockLog.mockRestore()
})
// afterAll(() => server.close())

test('mocks API requests', async () => {
  render(<Mocktest />)
  const user = userEvent.setup()
  await user.click(screen.getByText(/ユーザ取得/i))
  await waitFor(() =>
    expect(mockLog).toHaveBeenCalledWith(
      expect.objectContaining({
        response: expect.objectContaining({
          status: 403,
          data: { errorMessage: 'Not authorized' },
        }),
      }),
    ),
  )
  // ログインボタンのクリック
  await user.click(screen.getByText(/ログイン/i))
  await waitFor(() => {
    expect(sessionStorage.getItem('is-authenticated')).toBe('true')
  })

  // ユーザ取得ボタンのクリック
  await user.click(screen.getByText(/ユーザ取得/i))
  await waitFor(() => {
    expect(mockLog).toHaveBeenCalledWith(
      expect.objectContaining({
        response: expect.objectContaining({
          status: 200,
          data: { username: 'admin' },
        }),
      }),
    )
  })

  // ログアウトボタンのクリック
  await user.click(screen.getByText(/ログアウト/i))
  await waitFor(() => {
    expect(sessionStorage.getItem('is-authenticated')).toBe('false')
  })

  await user.click(screen.getByText(/ユーザ取得/i))
  await waitFor(() =>
    expect(mockLog).toHaveBeenCalledWith(
      expect.objectContaining({
        response: expect.objectContaining({
          status: 403,
          data: { errorMessage: 'Not authorized' },
        }),
      }),
    ),
  )
})

// console.logをモック化
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  sessionStorage.clear() // 各テスト前にsessionStorageをクリア
})
