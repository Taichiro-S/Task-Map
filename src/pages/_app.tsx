import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabase'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const validateSession = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (
      user === null &&
      (router.pathname === '/' || router.pathname === '/account' || router.pathname === '/dashboard')
    ) {
      router.push('/login')
      return
    }
    if (user !== null && (router.pathname === '/login' || router.pathname === '/signup')) {
      router.push('/')
      return
    }
    // if (router.pathname === '/signup') {
    //   console.log('signup')
    //   return
    // }
    // if ((!user || user === null) && router.pathname === '/') {
    //   router.push('/login')
    // } else if (
    //   user &&
    //   user !== null &&
    //   (router.pathname === '/login' || router.pathname === '/signup')
    // ) {
    //   router.push('/')
    // }
  }

  useEffect(() => {
    validateSession()
  }, [])

  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && (router.pathname === '/login' || router.pathname === '/signup')) {
      router.push('/')
    } else if (event === 'SIGNED_OUT') {
      router.push('/login')
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
