import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from "@/src/app/_trpc/Provider";
import {ClerkProvider} from "@clerk/nextjs";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blawgsum - A blog platform for developers',
  description: 'Headless CMS for developers with AI powered tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
      <Provider>
        <body className={inter.className}>{children}</body>
      </Provider>
      </html>
    </ClerkProvider>
  )
}
