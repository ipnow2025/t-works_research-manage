import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MemberProvider } from "@/contexts/member-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "연구실 국책과제 관리 시스템",
  description: "연구실 국책과제 관리를 위한 대시보드 시스템",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <MemberProvider>
          <main>{children}</main>
        </MemberProvider>
      </body>
    </html>
  )
}
