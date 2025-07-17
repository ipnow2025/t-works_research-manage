"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
              <div>
                <p className="text-sm text-muted-foreground">주관기관</p>
                <p className="font-medium">{project.mainOrg}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">연구책임자</p>
                <p className="font-medium">{project.researcher}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">연구기간</p>
                <p className="font-medium">
                  {project.startDate} ~ {project.endDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">총 연구비</p>
                <p className="font-medium">{project.budget?.toLocaleString()}원</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">프로젝트 설명</p>
            <p className="text-sm">{project.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* 진행 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>진행 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">전체 진행률</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
