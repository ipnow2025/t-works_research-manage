"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

interface ScheduleProps {
  project: any
}

export function Schedule({ project }: ScheduleProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            연구 일정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">일정 관리</h3>
            <p className="text-muted-foreground">프로젝트 일정과 마일스톤을 관리할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
