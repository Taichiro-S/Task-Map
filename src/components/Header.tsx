import Link from 'next/link'
import React, { FC, FormEvent, memo, useEffect, useState } from 'react'
import { useMutateAuth, useQuerySessionUser } from 'hooks'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import Spinner from './Spinner'

const Header: FC = () => {
  const router = useRouter()
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const { logoutMutation } = useMutateAuth()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    logoutMutation.mutate()
  }
  if (sessionUserIsLoading) return <Spinner />
  if (sessionUserError) return null
  return (
    <div>
      <nav className="bg-gray-800">
        <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center">
            {!sessionUser || sessionUser === null ? (
              <>
                <li>
                  <button onClick={() => router.push('/')}>
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      ホーム
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/login')}>
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      {/* <LoginIcon className="text-white cursor-pointer hover:text-blue-300" /> */}
                      ログイン
                    </span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={() => router.push('/dashboard')}>
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      ダッシュボード
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/account')}>
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      アカウント
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/mocktest')}>
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      モックテスト
                    </span>
                  </button>
                </li>
                <li>
                  <form onSubmit={handleSubmit}>
                    <button type="submit">
                      {/* <LogoutIcon className="text-white cursor-pointer hover:text-blue-300" /> */}
                      <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        ログアウト
                      </span>
                    </button>
                  </form>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default memo(Header)
