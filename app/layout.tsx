import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'  // chemin à adapter
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Droovo - Commande en ligne',
  description: 'Droovo - Plateforme de commande en ligne pour restaurants',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session?: any
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
