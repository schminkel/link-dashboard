import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./safe-area.css"
import { StandaloneSafeArea } from "@/components/standalone-safe-area"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Links Dashboard",
  description: "Manage your favorite links with style",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' }
    ]
  },
  appleWebApp: {
    title: "Links Dashboard",
    statusBarStyle: "black-translucent",
    startupImage: [
      { url: '/apple-splash.svg' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Links Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="theme-color" content="#60a5fa" />
        
        {/* Standard web app icon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* Apple Touch Icons - PNG versions for iOS compatibility */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        
        {/* Safari Pinned Tab Icon */}
        <link rel="mask-icon" href="/favicon.svg" color="#1e293b" />
        
        {/* Splash Screen */}
        <link rel="apple-touch-startup-image" href="/apple-splash.svg" />
      </head>
      <body className={`${inter.className} app-container`}>
        <StandaloneSafeArea />
        {children}
      </body>
    </html>
  )
}
