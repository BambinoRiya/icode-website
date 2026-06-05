import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
})

export const metadata: Metadata = {
  title: 'iCODE Abakwa | Building Systems That Think, Teach, and Move',
  description: 'iCODE Abakwa is a collective of intentional coders building AI-powered tools, education platforms, evidence systems, and digital experiments for African contexts.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#f8faf9]">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased relative`}>
        {/* Teal accent gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#0d9488]/15 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#0d9488]/12 to-transparent rounded-full blur-3xl" />
        </div>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
