"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp } from "lucide-react"

interface KPIProps {
  project: any
}

export function KPI({ project }: KPIProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            핵심성과지표 (목표)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">목표 관리</h3>
            <p className="text-muted-foreground">프로젝트의 핵심성과지표를 설정하고 추적할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
