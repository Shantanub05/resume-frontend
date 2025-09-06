'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error: Error & { status?: number }) => {
              // Don't retry on 4xx errors except 408, 409, 429
              if (error?.status && error.status >= 400 && error.status < 500) {
                if ([408, 409, 429].includes(error.status)) {
                  return failureCount < 3
                }
                return false
              }
              return failureCount < 3
            },
          },
          mutations: {
            retry: (failureCount, error: Error & { status?: number }) => {
              if (error?.status && error.status >= 400 && error.status < 500) {
                return false // Don't retry client errors
              }
              return failureCount < 2
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}