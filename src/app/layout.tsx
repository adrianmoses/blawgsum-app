import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from "@/src/app/_trpc/Provider";
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "@/src/components/ui/toaster";

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
        <html lang="en" className="w-full">
            <Provider>
                <body className={`${inter.className} w-full`}>
                    <main>{children}</main>
                    <Toaster />
                </body>
            </Provider>
        </html>
    </ClerkProvider>
  )
}
