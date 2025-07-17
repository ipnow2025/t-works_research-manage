"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Schedule } from "@/components/ongoing-projects/schedule/index"
import { apiFetch } from "@/lib/func"

export default function OngoingSchedulePage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const projectId = params.id as string

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await apiFetch(`/api/project-planning/${projectId}`)
        const result = await response.json()
        
        if (response.ok && result.success && result.data) {
          // API 데이터를 Schedule 컴포넌트에 맞게 변환
          const apiProject = result.data
          const convertedProject = {
            id: apiProject.id.toString(),
            projectName: apiProject.project_name,
            memberIdx: apiProject.member_idx || 'default',
            memberName: apiProject.member_name || '사용자',
            companyIdx: apiProject.company_idx || 'default',
            companyName: apiProject.company_name || '회사',
            startDate: apiProject.start_date,
            endDate: apiProject.end_date,
            description: apiProject.project_details || apiProject.project_purpose || "상세 정보가 없습니다.",
          }
          setProject(convertedProject)
        } else {
          setProject(null)
        }
      } catch (error) {
        console.error('프로젝트 조회 오류:', error)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="p-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">데이터를 불러오는 중...</div>
          </div>
        </main>
      </div>
    )
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
              진행중 과제 목록으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <button
              onClick={() => router.push(`/ongoing/${params.id}`)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ChevronLeft className="h-4 w-4" />
              사업개요로 돌아가기
            </button>
            <h1 className="text-2xl font-bold tracking-tight">일정관리</h1>
            <p className="text-muted-foreground">{project.projectName}</p>
          </div>

          <Schedule project={project} />
        </div>
      </main>
    </div>
  )
}
