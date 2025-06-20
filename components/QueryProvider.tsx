import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 3 times
      retry: 3,
      // Retry after 1 second
      retryDelay: 1000,
      // Stale time of 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time of 10 minutes
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      // Retry failed mutations 1 time
      retry: 1,
      // Retry after 2 seconds
      retryDelay: 2000,
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
} 