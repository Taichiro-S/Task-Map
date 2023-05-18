import '@/styles/globals.css'
import '@/styles/customNode.css'
import '@/styles/reactflow.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabase'

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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user && router.pathname !== '/') {
      router.push('/login')
    } else if (user && router.pathname === '/') {
      router.push('/')
    }
  }

  useEffect(() => {
    validateSession()
  }, [])

  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && router.pathname === '/') {
      router.push('/')
    } else if (event === 'SIGNED_OUT') {
      router.push('/login')
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
