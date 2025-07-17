"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Building, Users, Calendar } from "lucide-react"
import { samplePlanningProjects, sampleOngoingProjectData } from "@/lib/project-manager"

export default function OngoingOverviewPage() {
  const router = useRouter()
  const params = useParams()
  
  const projectId = params.id as string
  const project = samplePlanningProjects.find((p) => p.id === projectId && p.status === "진행중")

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount)
  }



  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <main className="p-6">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold">프로젝트를 찾을 수 없습니다.</h2>
            <button
              onClick={() => router.push("/ongoing")}
              className="mt-4 text-primary hover:underline flex items-center justify-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              진행과제 목록으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    )
  }

  const ongoingData = sampleOngoingProjectData[project.id]

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div>
            <button
              onClick={() => router.push(`/ongoing/${project.id}`)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ChevronLeft className="h-4 w-4" />
              과제 상세로 돌아가기
            </button>
            <h1 className="text-2xl font-bold tracking-tight">사업개요</h1>
            <p className="text-muted-foreground">{project.projectName}</p>
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building className="h-4 w-4" />
                <span className="text-sm font-medium">주관기관</span>
              </div>
              <p className="text-sm">{project.leadOrganization}</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">연구책임자</span>
              </div>
              <p className="text-sm">{project.principalInvestigator}</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">담당자</span>
              </div>
              <p className="text-sm">{project.manager}</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">기간</span>
              </div>
              <p className="text-sm">
                {project.startDate} ~ {project.endDate}
              </p>
            </div>
          </div>

          {/* 진행 상황 */}
          {ongoingData && (
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">진행 상황</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>전체 진행률</span>
                  <span>{ongoingData.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${ongoingData.progress}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* 프로젝트 설명 */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">프로젝트 개요</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {(project as any).description || "프로젝트 설명이 없습니다."}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
