"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatisticsCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  onClick?: () => void
  className?: string
}

export function StatisticsCard({ title, value, description, icon: Icon, onClick, className }: StatisticsCardProps) {
  return (
    <Card onClick={onClick} className={`cursor-pointer hover:shadow-md transition-shadow ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
