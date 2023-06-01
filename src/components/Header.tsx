import Link from 'next/link'
import React, { FC, FormEvent, memo, useEffect, useState } from 'react'
import { useMutateAuth, useQuerySessionUser } from 'hooks'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import Spinner from './Spinner'
import { successToast, errorToast } from 'utils/toast'
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { styled } from '@mui/material/styles'

const CustomButton = styled(Button)({
  '&:hover': {
    backgroundColor: '#d81b60',
  },
})

const Header: FC = () => {
  const router = useRouter()
  const { data: sessionUser, error: sessionUserError, isLoading: sessionUserIsLoading } = useQuerySessionUser()
  const { logoutMutation } = useMutateAuth()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let variables = void 0
    logoutMutation.mutate(variables, {
      onSuccess: () => {
        successToast('ログアウトしました')
      },
      onError: () => {
        errorToast('ログアウトに失敗しました')
      },
    })
  }
  if (sessionUserIsLoading) return <Spinner />
  if (sessionUserError) return null
  return (
    <nav className="bg-neutral-800 h-10 flex items-center">
      <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-between items-center">
          <Link href="/">
            <p className="text-lg text-neutral-50 font-bold flex items-center">
              <span>
                <MapPinIcon className="h-6 w-6 mr-2 text-neutral-50" />
              </span>
              Task Map
            </p>
          </Link>
          <div className="flex justify-end items-center">
            {!sessionUser || sessionUser === null ? (
              <>
                {/* <li>
                  <Link href="/">
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      ホーム
                    </span>
                  </Link>
                </li> */}
                <li className="">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      router.push('/login')
                    }}
                    startIcon={<LoginIcon />}
                    size="small"
                    style={{
                      backgroundColor: '#2196f3',
                    }}
                  >
                    ログイン
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/dashboard">
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      ダッシュボード
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/account">
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      アカウント
                    </span>
                  </Link>
                </li>
                {/* <li>
                  <Link href="/mocktest">
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      モックテスト
                    </span>
                  </Link>
                </li> */}
                <li>
                  <form onSubmit={handleSubmit}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LoginIcon />}
                      size="small"
                      type="submit"
                      style={{
                        backgroundColor: '#f87171',
                      }}
                    >
                      ログアウト
                    </Button>
                  </form>
                </li>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  )
}

export default memo(Header)
