"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  FileText,
  Users,
  Calendar,
  Building,
  ChevronLeft,
  Plus,
  RefreshCw,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileIcon as FilePdf,
  ExternalLink,
  Target,
  AlertTriangle,
  TrendingDown,
  Award,
  DollarSign,
  Save,
  Edit,
} from "lucide-react"
import { apiFetch } from "@/lib/func"
import { KPI } from "@/components/ongoing-projects/kpi/index"
import { BudgetComposition } from "@/components/ongoing-project/budget-composition/index"
import { Consortium } from "@/components/ongoing-project/consortium/index"
import { ResearchLog } from "@/components/ongoing-projects/research-log/index"
import { Schedule } from "@/components/ongoing-projects/schedule/index"
import { MilestoneList } from "@/components/ongoing-projects/milestone/milestone-list"
import { MilestoneDialog } from "@/components/ongoing-projects/milestone/milestone-dialog"

interface ProjectDetail {
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
  status: string
  application_date?: number
  member_idx?: string
  member_name?: string
  company_idx?: string
  company_name?: string
  lead_organization?: string
  // 상태정보 필드들
  performance_summary?: string
  follow_up_actions?: string
  reapplication_possibility?: string
  improvement_direction?: string
}

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

export default function CompletedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // 상태정보 편집용 상태
  const [statusInfo, setStatusInfo] = useState({
    performance_summary: '',
    follow_up_actions: '',
    reapplication_possibility: '',
    improvement_direction: ''
  })
  
  // Unwrap params using React.use()
  const { id } = use(params)

  const [activeTab, setActiveTab] = useState("overview")
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await apiFetch(`/api/project-planning/${id}`)
        const result = await response.json()
        
        if (response.ok && result.success && result.data) {
          setProject(result.data)
          // 상태정보 초기화
          setStatusInfo({
            performance_summary: result.data.performance_summary || '',
            follow_up_actions: result.data.follow_up_actions || '',
            reapplication_possibility: result.data.reapplication_possibility || '',
            improvement_direction: result.data.improvement_direction || ''
          })
        } else {
          setError(result.error || '프로젝트를 찾을 수 없습니다.')
        }
      } catch (error) {
        setError('프로젝트 조회 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

  const handleSaveStatusInfo = async () => {
    if (!project) return
    
    try {
      setSaving(true)
      const response = await apiFetch(`/api/project-planning/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusInfo)
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        // 프로젝트 정보 업데이트
        setProject(prev => prev ? { ...prev, ...statusInfo } : null)
        setIsEditing(false)
      } else {
        setError(result.error || '저장 중 오류가 발생했습니다.')
      }
    } catch (error) {
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    if (project) {
      setStatusInfo({
        performance_summary: project.performance_summary || '',
        follow_up_actions: project.follow_up_actions || '',
        reapplication_possibility: project.reapplication_possibility || '',
        improvement_direction: project.improvement_direction || ''
      })
    }
    setIsEditing(false)
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount * 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "완료"
      case "REJECTED":
        return "미선정"
      default:
        return status
    }
  }

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

  const renderTabContent = () => {
    if (!project) return null;
    
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* 기본 정보 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      연구책임자
                    </div>
                    <div className="font-medium">{project.project_manager}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      주관기관
                    </div>
                    <div className="font-medium">{project.lead_organization || '미지정'}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      총 예산
                    </div>
                    <div className="font-medium">{formatBudget(project.total_cost)}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      프로젝트 기간
                    </div>
                    <div className="font-medium">
                      {new Date(project.start_date).toLocaleDateString('ko-KR')} ~ {new Date(project.end_date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      주관부처
                    </div>
                    <div className="font-medium">{project.department || '미지정'}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      전문기관
                    </div>
                    <div className="font-medium">{project.institution || '미지정'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 과제 목적 및 상세내용 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    과제 목적
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {project.project_purpose || '과제 목적이 입력되지 않았습니다.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    과제 상세내용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {project.project_details || '과제 상세내용이 입력되지 않았습니다.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 공고 링크 */}
            {project.announcement_link && (
              <Card>
                <CardHeader>
                  <CardTitle>공고 링크</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={project.announcement_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {project.announcement_link}
                  </a>
                </CardContent>
              </Card>
            )}

            {/* 주요 마일스톤 */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    주요 마일스톤
                  </CardTitle>
                  <Button
                    onClick={() => {
                      setEditingMilestone(null)
                      setShowMilestoneDialog(true)
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    마일스톤 추가
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <MilestoneList 
                  projectId={id} 
                  key={milestoneRefreshKey}
                  onEdit={(milestone) => {
                    setEditingMilestone(milestone)
                    setShowMilestoneDialog(true)
                  }}
                />
              </CardContent>
            </Card>
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
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <Button onClick={() => router.push("/completed/overview")} className="mt-4">
              완료/미선정 목록으로 돌아가기
            </Button>
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
              onClick={() => router.push("/completed/overview")}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ChevronLeft className="h-4 w-4" />
              완료/미선정 목록으로 돌아가기
            </button>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold tracking-tight">{project.project_name}</h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === "APPROVED" 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }`}>
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
        projectId={id}
        milestone={editingMilestone}
        onSuccess={refreshMilestones}
      />
    </div>
  )
} 