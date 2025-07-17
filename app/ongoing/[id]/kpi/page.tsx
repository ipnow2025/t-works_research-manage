"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { KPI } from "@/components/ongoing-projects/kpi/index"
import { apiFetch } from "@/lib/func"

interface Project {
  id: number
  project_name?: string
  projectName?: string
  title?: string
  status?: string
  start_date?: string
  end_date?: string
  budget?: number
  organization?: string
  institution?: string
}

export default function OngoingKPIPage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  
  const projectId = params.id as string

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiFetch(`/api/ongoing-projects/${projectId}`)
        const result = await response.json()
        
        if (result.success) {
          setProject(result.data)
        } else {
          console.error('프로젝트 조회 실패:', result.error)
        }
      } catch (error) {
        console.error('프로젝트 조회 오류:', error)
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">프로젝트 정보를 불러오는 중...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <main className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-muted-foreground">프로젝트를 찾을 수 없습니다</h2>
            <button onClick={() => router.push("/ongoing")} className="mt-4 text-primary hover:underline">
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
            <h1 className="text-2xl font-bold tracking-tight">목표 트래킹</h1>
            <p className="text-muted-foreground">
              {project.project_name || project.projectName || project.title || "제목 없음"}
            </p>
          </div>

          <KPI project={project} />
        </div>
      </main>
    </div>
  )
}
