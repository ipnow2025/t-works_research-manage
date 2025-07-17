"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Building, Users, Calendar, DollarSign } from "lucide-react"
import { BudgetComposition } from "@/components/ongoing-project/budget-composition/index"
import { Consortium } from "@/components/ongoing-project/consortium/index"
import { KPI } from "@/components/ongoing-projects/kpi/index"
import { ResearchLog } from "@/components/ongoing-projects/research-log/index"
import { Schedule } from "@/components/ongoing-projects/schedule/index"
import { apiFetch } from "@/lib/func"
import { formatDateString } from "@/lib/utils"
import { MilestoneList } from "@/components/ongoing-projects/milestone/milestone-list"
import { MilestoneDialog } from "@/components/ongoing-projects/milestone/milestone-dialog"

interface OngoingProjectDetail {
  id: number
  project_name: string
  project_manager: string
  start_date: string
  end_date: string
  department?: string
  institution?: string
  total_cost: number
  project_purpose?: string
  project_details?: string
  announcement_link?: string
  attachment_files?: any
  status: string
  application_date?: number
  member_name: string
  company_name: string
  reg_date: number
  mdy_date: number
  lead_organization?: string
}

export default function OngoingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<any>(null)
  const [milestoneRefreshKey, setMilestoneRefreshKey] = useState(0)
  
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
  
  const projectId = params.id as string

  const refreshMilestones = () => {
    setMilestoneRefreshKey(prev => prev + 1)
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

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await apiFetch(`/api/project-planning/${projectId}`)
        const result = await response.json()
        
        if (response.ok && result.success && result.data) {
          // API 데이터를 기존 UI 구조에 맞게 변환
          const apiProject = result.data
          const convertedProject = {
            id: apiProject.id.toString(),
            title: apiProject.project_name || apiProject.projectName || apiProject.title || "제목 없음",
            projectName: apiProject.project_name || apiProject.projectName || apiProject.title || "제목 없음",
            status: getStatusText(apiProject.status),
            participationType: "주관",
            leadOrganization: apiProject.lead_organization || apiProject.leadOrganization || apiProject.institution || apiProject.organization || "미지정",
            principalInvestigator: apiProject.project_manager || apiProject.principalInvestigator || apiProject.manager || apiProject.member_name || "미지정",
            manager: apiProject.member_name || apiProject.manager || "미지정",
            startDate: apiProject.start_date || apiProject.startDate || "",
            endDate: apiProject.end_date || apiProject.endDate || "",
            budget: (apiProject.total_cost || apiProject.totalCost || 0) * 1000, // 천원 단위를 원 단위로 변환 (UI 표시용)
            total_cost: apiProject.total_cost || apiProject.totalCost || 0, // 원본 total_cost 값 (BudgetComposition용)
            progress: 65, // 기본값
            description: apiProject.project_details || apiProject.projectDetails || apiProject.project_purpose || apiProject.projectPurpose || apiProject.description || "상세 정보가 없습니다.",
            project_purpose: apiProject.project_purpose || apiProject.projectPurpose || "",
            objectives: [],
            currentMilestones: [],
            ongoingData: {
              schedule: [],
              researchLogs: [],
              kpis: {
                papers: { current: 0, target: 0, percentage: 0 },
                patents: { current: 0, target: 0, percentage: 0 },
                conferences: { current: 0, target: 0, percentage: 0 },
                techTransfer: { current: 0, target: 0, percentage: 0 },
              },
              yearlyTrends: {},
              projectDistribution: {
                papers: 0,
                patents: 0,
                conferences: 0,
              },
            },
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
        return "기획"
    }
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "완료":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "계획":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const renderTabContent = () => {
    if (!project) return null;
    
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* 기본 정보 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Building className="h-4 w-4" />
                  <span className="text-sm font-medium">주관기관</span>
                </div>
                <p className="text-sm font-medium">{project.leadOrganization}</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">연구책임자</span>
                </div>
                <p className="text-sm font-medium">{project.principalInvestigator}</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">연구 기간</span>
                </div>
                <p className="text-sm font-medium">
                  {formatDateString(project.startDate)} ~ {formatDateString(project.endDate)}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">연구 예산</span>
                </div>
                <p className="text-sm font-medium">{formatBudget(project.budget)}</p>
              </div>
            </div>

            {/* 진행 상황 */}
            {/* <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">진행 상황</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>전체 진행률</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            </div> */}

            {/* 프로젝트 개요 */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">프로젝트 개요</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{project.description}</p>
            </div>

            {/* 연구 목표 */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">연구 목표</h3>
              {project.project_purpose ? (
                <p className="text-sm text-muted-foreground whitespace-pre-line">{project.project_purpose}</p>
              ) : (
                <ul className="space-y-2">
                  {project.objectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 주요 마일스톤 */}
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">주요 마일스톤</h3>
                <button
                  onClick={() => {
                    setEditingMilestone(null)
                    setShowMilestoneDialog(true)
                  }}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  마일스톤 추가
                </button>
              </div>
              <MilestoneList 
                projectId={projectId} 
                key={milestoneRefreshKey}
                onEdit={(milestone) => {
                  setEditingMilestone(milestone)
                  setShowMilestoneDialog(true)
                }}
              />
            </div>
          </div>
        )
      case "schedule":
        return <Schedule project={project} />
      case "kpi":
        return <KPI project={project} />
      case "research-log":
        return <ResearchLog project={project} />
      case "consortium":
        return <Consortium project={project} onConsortiumChange={handleConsortiumChange} />
      case "budget":
        return <BudgetComposition project={project} consortiumData={consortiumData} />
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
          {/* 헤더 */}
          <div>
            <button
              onClick={() => router.push("/ongoing")}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ChevronLeft className="h-4 w-4" />
              진행중 과제 목록으로 돌아가기
            </button>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {project.status}
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
                onClick={() => setActiveTab("schedule")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "schedule"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                일정관리
              </button>
              <button
                onClick={() => setActiveTab("kpi")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "kpi"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                목표관리
              </button>
              <button
                onClick={() => setActiveTab("research-log")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "research-log"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                연구일지
              </button>
              <button
                onClick={() => setActiveTab("consortium")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "consortium"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                인력구성
              </button>
              <button
                onClick={() => setActiveTab("budget")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "budget"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                예산구성
              </button>
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </main>
      <MilestoneDialog
        isOpen={showMilestoneDialog}
        onClose={() => setShowMilestoneDialog(false)}
        projectId={projectId}
        milestone={editingMilestone}
        onSuccess={refreshMilestones}
      />
    </div>
  )
}
