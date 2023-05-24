import Link from 'next/link'
import React, { FormEvent } from 'react'
import { useQueryUser, useMutateAuth } from 'hooks/index'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'

const Header = () => {
  const { data: userId, isLoading, isError } = useQueryUser()
  const { logoutMutation } = useMutateAuth()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    logoutMutation.mutate()
  }
  return (
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center">
            <li>
              <Link href="/">
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  ホーム
                </span>
              </Link>
            </li>
            <li>
              {userId ? (
                <form onSubmit={handleSubmit}>
                  <button type="submit">
                    <LogoutIcon className="text-white cursor-pointer hover:text-blue-300" />
                  </button>
                </form>
              ) : (
                <Link href="/login">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LoginIcon className="text-white cursor-pointer hover:text-blue-300" />
                  </span>
                </Link>
              )}
            </li>
            <li>
              <Link href="/account">
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  アカウント
                </span>
              </Link>
            </li>
            <li>
              <Link href="/mocktest">
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  モックテスト
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Header
