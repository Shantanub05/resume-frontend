'use client'

import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <Toaster 
          position="top-right"
          richColors
          theme="system"
          closeButton
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </QueryProvider>
    </ThemeProvider>
  )
}