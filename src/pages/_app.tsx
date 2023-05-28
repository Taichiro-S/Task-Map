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
  const checkUser = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (user === null && (router.pathname === '/account' || router.pathname === '/dashboard')) {
      console.log(user)
      return router.push('/login')
    }
    if (user !== null && (router.pathname === '/login' || router.pathname === '/signup' || router.pathname === '/')) {
      return router.push('/dashboard')
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && (router.pathname === '/login' || router.pathname === '/signup')) {
      router.push('/dashboard')
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
