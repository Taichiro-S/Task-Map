import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useRouter } from 'next/router'
import { supabase } from 'utils/supabase'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New, Kosugi_Maru } from 'next/font/google'
import { PagesForOnlyGuestUser } from 'constants/pathName'

if (process.env.NEXT_PUBLIC_ENV === 'development') {
  require('../mocks')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['300', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
})
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['300', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
})
const kosugiMaru = Kosugi_Maru({ weight: ['400'], style: ['normal'], subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const checkUser = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user && !PagesForOnlyGuestUser.includes(router.pathname)) {
      // console.log('user', user)
      return router.push('/')
    }
    if (user && PagesForOnlyGuestUser.includes(router.pathname)) {
      return router.push('/dashboard')
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && (router.pathname === '/login' || router.pathname === '/signup')) {
      router.push('/dashboard')
    } else if (event === 'SIGNED_OUT') {
      router.push('/')
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />

      <Component {...pageProps} />
      <style jsx global>
        {`
          :root {
            --font-zenMaruGothic: ${zenMaruGothic.style.fontFamily};
            --font-zenKakuGothicNew: ${zenKakuGothicNew.style.fontFamily};
            --font-kosugiMaru: ${kosugiMaru.style.fontFamily};
          }
        `}
      </style>
    </QueryClientProvider>
  )
}
