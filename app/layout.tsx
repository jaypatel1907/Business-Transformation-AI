import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { RoleProvider } from '@/lib/role-context'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'BlueprintAI — Enterprise Digital Transformation Platform',
  description:
    'AI workspace that turns business context into implementation-ready transformation blueprints: architecture, workflows, database & APIs, and project plans.',
  icons: {
    icon: '/icon-light-32x32.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-white ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <RoleProvider>{children}</RoleProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}