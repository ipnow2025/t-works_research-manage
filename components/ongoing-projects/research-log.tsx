"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BookOpen } from "lucide-react"

interface ResearchLogProps {
  project: any
}

export function ResearchLog({ project }: ResearchLogProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            연구일지
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">연구일지 관리</h3>
            <p className="text-muted-foreground">연구 진행 과정과 결과를 기록하고 관리할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
