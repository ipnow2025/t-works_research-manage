"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { ResearchLog } from "@/components/ongoing-projects/research-log/index"
import { apiFetch } from "@/lib/func"
import { toast } from "sonner"

interface Project {
  id: number
  name: string
  type: string
  organization: string
  piName: string
  startDate: string
  endDate: string
  budget: number
  description: string
  status: string
  memberIdx: string
  memberName: string
  companyIdx: string
  companyName: string
}

export default function OngoingResearchLogPage() {
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
          toast.error('프로젝트를 찾을 수 없습니다.')
        }
      } catch (error) {
        console.error('프로젝트 조회 오류:', error)
        toast.error('프로젝트를 불러오는데 실패했습니다.')
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
            <p className="text-muted-foreground">프로젝트를 불러오는 중...</p>
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
            <h2 className="text-xl font-semibold mb-2">프로젝트를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 프로젝트가 존재하지 않습니다.</p>
            <button onClick={() => router.push("/ongoing")} className="text-primary hover:underline">
              진행중 프로젝트 목록으로 돌아가기
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
            <h1 className="text-2xl font-bold tracking-tight">연구일지</h1>
            <p className="text-muted-foreground mt-1">{project.name}</p>
          </div>

          <ResearchLog project={project} />
        </div>
      </main>
    </div>
  )
}
