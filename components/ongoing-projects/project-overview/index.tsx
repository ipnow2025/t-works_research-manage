"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, User, Building, DollarSign } from "lucide-react"

interface ProjectOverviewProps {
  project: any
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="space-y-6">
      {/* 프로젝트 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 개요</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">주관기관:</span>
              <span className="text-sm font-medium">{project.mainOrg}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">연구책임자:</span>
              <span className="text-sm font-medium">{project.researcher}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">작성자:</span>
              <span className="text-sm font-medium">{project.manager}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">기간:</span>
              <span className="text-sm font-medium">
                {project.startDate} ~ {project.endDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">정부지원예산:</span>
              <span className="text-sm font-medium">{(project.budget / 100000000).toFixed(1)}억원</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 진행 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>진행 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>전체 진행률</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {project.status}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {project.participationType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 설명 */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 설명</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
