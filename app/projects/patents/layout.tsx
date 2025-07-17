import type React from "react"
export default function PatentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="container mx-auto py-6">{children}</div>
}
