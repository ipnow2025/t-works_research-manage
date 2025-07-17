"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { ProgressStatus } from "@/components/planning-application/progress-status"
import { Consortium } from "@/components/planning-application/consortium"
import { BudgetComposition } from "@/components/planning-application/budget-composition"
import { DocumentManagement } from "@/components/planning-application/document-management"
import { DocumentChecklist } from "@/components/planning-application/document-checklist"
import { DocumentOverview } from "@/components/planning-application/project-overview/document-overview"
import { apiFetch } from "@/lib/func"
import { formatDateString, formatTimestamp } from "@/lib/utils"
import React from "react"

// 프로젝트 타입 정의
interface ProjectDetail {
  id: number;
  project_name: string;
  projectName?: string; // fallback field
  title?: string; // fallback field
  project_manager: string;
  start_date: string;
  end_date: string;
  department: string;
  institution: string;
  total_cost: number;
  project_purpose?: string;
  project_details?: string;
  announcement_link?: string;
  attachment_files?: any;
  status: string;
  application_date?: number;
  member_name: string;
  company_name: string;
  reg_date: number;
  mdy_date: number;
  policy_goals: Array<{
    id: number;
    policy_name: string;
    target_value: string;
    achievement_rate: string;
  }>;
  consortium_organizations: Array<{
    id: number;
    organization_type: string;
    organization_name: string;
    role_description?: string;
  }>;
}

export default function PlanningDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 컨소시엄 데이터 상태 추가
  const [consortiumData, setConsortiumData] = useState<{
    projectType: "single" | "multi"
    projectDuration: number
    organizations: Array<{
      id: string
      name: string
      type: string
      members: Array<any>
    }>
    yearlyOrganizations?: { [key: number]: Array<{
      id: string
      name: string
      type: string
      members: Array<any>
    }> }
  } | undefined>(undefined)
  
  const projectId = resolvedParams.id

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await apiFetch(`/api/project-planning/${projectId}`)
        const result = await response.json()
        
        if (response.ok && result.success && result.data) {
          setProject(result.data)
        } else {
          setError(result.error || '프로젝트를 찾을 수 없습니다.')
        }
      } catch (error) {
        console.error('프로젝트 조회 오류:', error)
        setError('프로젝트 조회 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount * 1000) // 천원 단위로 저장되어 있으므로 1000을 곱함
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "기획"
      case "SUBMITTED":
        return "진행"
      case "APPROVED":
        return "완료"
      case "REJECTED":
        return "미선정"
      default:
        return status
    }
  }

  const handleSaveAll = () => {
    setIsEditing(false)
  }

  const handleCancelAll = () => {
    setIsEditing(false)
  }

  // 컨소시엄 데이터 변경 핸들러
  const handleConsortiumChange = (data: {
    projectType: "single" | "multi"
    projectDuration: number
    organizations: Array<{
      id: string
      name: string
      type: string
      members: Array<any>
    }>
  }) => {
    setConsortiumData(data)
  }

  const renderTabContent = () => {
    if (!project) return null

    switch (activeTab) {
      case "overview":
        return <DocumentOverview project={project} />
      case "progress":
        return <ProgressStatus project={project} />
      case "consortium":
        return <Consortium project={project} onConsortiumChange={handleConsortiumChange} />
      case "budget":
        return <BudgetComposition project={project} consortiumData={consortiumData} />
      case "documents":
        return <DocumentManagement project={project} />
      // case "checklist":
      //   return <DocumentChecklist project={project} />
      default:
        return null
    }
  }

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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <main className="p-6">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold">{error || '프로젝트를 찾을 수 없습니다.'}</h2>
            <button
              onClick={() => router.push("/planning")}
              className="mt-4 text-primary hover:underline flex items-center justify-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              기획/신청 목록으로 돌아가기
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
          {/* 헤더 */}
          <div>
            <button
              onClick={() => router.push("/planning")}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ChevronLeft className="h-4 w-4" />
              기획/신청 목록으로 돌아가기
            </button>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {project.project_name || project.projectName || project.title || "제목 없음"}
              </h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">프로젝트 ID: {project.id}</p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-border">
            <div className="flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                사업개요
              </button>
              <button
                onClick={() => setActiveTab("progress")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "progress"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                진행현황
              </button>
              <button
                onClick={() => setActiveTab("consortium")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "consortium"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                컨소시엄
              </button>
              <button
                onClick={() => setActiveTab("budget")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "budget"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                예산관리
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "documents"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                제출서류 준비
              </button>
              {/* <button
                onClick={() => setActiveTab("checklist")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "checklist"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                문서
              </button> */}
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </main>
    </div>
  )
}
