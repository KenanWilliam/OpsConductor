import type { Metadata } from 'next'
import { Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'OpsConductor',
  description: 'The command center for AI-powered business operations. Monitor, approve, and orchestrate your AI agents from one cockpit.',
  metadataBase: new URL('https://opsconductor.kenanwilliam.dev'),
  openGraph: {
    title: 'OpsConductor',
    description: 'Your agents run. You stay in control. The command center for AI agent orchestration.',
    siteName: 'OpsConductor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpsConductor',
    description: 'Your agents run. You stay in control.',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolage.variable} ${ibmPlexMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="opsc-theme"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
