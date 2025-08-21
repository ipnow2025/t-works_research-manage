"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Eye, Building, DollarSign, Users, FileText } from "lucide-react"
import { apiFetch } from "@/lib/func"
import { formatDateString, formatTimestamp } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import RegistPop from "@/components/planning-application/regist-pop"

interface ProjectPlanning {
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
}

interface DashboardStats {
  totalProjects: number
  totalDepartments: number
  totalProjectManagers: number
  totalBudget: number
}

export default function PlanningPage() {
  const router = useRouter()
  const [planningProjects, setPlanningProjects] = useState<ProjectPlanning[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ProjectPlanning | null>(null)
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)

  // 프로젝트 목록 가져오기
  const fetchProjects = async () => {
    try {
      setLoading(true)
      // 기획 페이지이므로 DRAFT 상태로 고정, 검색어를 API로 전송
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
      const response = await apiFetch(`/api/project-planning?status=DRAFT${searchParam}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && Array.isArray(result.data)) {
          setPlanningProjects(result.data)
        } else {
          console.error('프로젝트 목록 조회 실패: 잘못된 데이터 형식')
          setPlanningProjects([])
        }
      } else {
        console.error('프로젝트 목록 조회 실패')
        setPlanningProjects([])
      }
    } catch (error) {
      console.error('프로젝트 목록 조회 오류:', error)
      setPlanningProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [searchTerm, selectedType])

  // 대시보드 통계 계산
  const calculateStats = (): DashboardStats => {
    const stats: DashboardStats = {
      totalProjects: planningProjects.length,
      totalDepartments: new Set(planningProjects.map(p => p.department).filter(Boolean)).size,
      totalProjectManagers: new Set(planningProjects.map(p => p.project_manager).filter(Boolean)).size,
      totalBudget: planningProjects.reduce((sum, p) => sum + (p.total_cost || 0), 0)
    }
    return stats
  }

  const stats = calculateStats()

  // 프로젝트 삭제
  const handleDeleteProject = async () => {
    if (!projectToDelete) return

    try {
      const response = await apiFetch(`/api/project-planning/${projectToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // 목록에서 삭제된 프로젝트 제거
        setPlanningProjects(prev => prev.filter(p => p.id !== projectToDelete.id))
        alert('프로젝트가 성공적으로 삭제되었습니다.')
      } else {
        const errorData = await response.json()
        alert(`삭제 실패: ${errorData.error || '알 수 없는 오류가 발생했습니다.'}`)
      }
    } catch (error) {
      console.error('프로젝트 삭제 오류:', error)
      alert('프로젝트 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  // 삭제 확인 다이얼로그 열기
  const openDeleteDialog = (project: ProjectPlanning, e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  // 수정 페이지로 이동
  const handleEditProject = (project: ProjectPlanning, e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    router.push(`/planning/${project.id}/edit`)
  }

  // 상세 페이지로 이동
  const handleViewProject = (project: ProjectPlanning, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    }
    router.push(`/planning/${project.id}`)
  }

  // 상태별 색상 및 텍스트
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
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
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
        return "기획"
    }
  }

  // 검색 필터에 따른 플레이스홀더 반환
  const getSearchPlaceholder = (filterType: string) => {
    switch (filterType) {
      case "project_name":
        return "과제명으로 검색..."
      case "project_manager":
        return "연구책임자명으로 검색..."
      case "lead_organization":
        return "주관기관명으로 검색..."
      case "start_year":
        return "시작 연도로 검색... (예: 2024)"
      default:
        return "과제명으로 검색..."
    }
  }

  const formatBudget = (amount: number) => {
    // 천원 단위를 원 단위로 변환
    const amountInWon = amount * 1000
    
    if (amountInWon >= 100000000) {
      return `${(amountInWon / 100000000).toFixed(1)}억원`
    } else if (amountInWon >= 10000) {
      return `${(amountInWon / 10000).toFixed(0)}만원`
    } else {
      return `${amountInWon.toLocaleString()}원`
    }
  }

  const formatDateString = (dateString: string) => {
    if (!dateString) return '미지정'
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR')
  }

  // 필터링된 프로젝트 목록 - API에서 이미 필터링된 데이터를 사용
  const filteredProjects = planningProjects

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              기획/신청 과제
              <span className="text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-full ml-2">
                {filteredProjects.length}건
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">과제 기획 및 신청 현황을 관리합니다</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => setNewProjectDialogOpen(true)} 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 과제 기획
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-8">
        <div className="space-y-8">

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  총 기획/신청 과제
                </CardTitle>
                <FileText className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.totalProjects}개</div>
                <p className="text-xs text-muted-foreground">기획/신청 중인 과제</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  주관부처
                </CardTitle>
                <Building className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{stats.totalDepartments}개</div>
                <p className="text-xs text-muted-foreground">전체 주관부처 종류</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  연구책임자
                </CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.totalProjectManagers}명</div>
                <p className="text-xs text-muted-foreground">전체 연구책임자 종류</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  총 예산
                </CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatBudget(stats.totalBudget)}</div>
                <p className="text-xs text-muted-foreground">총 과제 예산</p>
              </CardContent>
            </Card>
          </div>

          {/* 검색 및 필터 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">검색 및 필터</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 필터와 검색을 한 줄에 배치 */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* 필터 - 25% 비율 */}
                <div className="w-full md:flex-shrink-0 md:w-64 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">검색 필터</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="검색 필터 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="project_name">과제명</SelectItem>
                      <SelectItem value="project_manager">연구책임자</SelectItem>
                      <SelectItem value="lead_organization">주관기관</SelectItem>
                      <SelectItem value="start_year">연도별</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 검색 - 75% 비율 */}
                <div className="w-full md:flex-1 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />  
                    <Input
                      placeholder={getSearchPlaceholder(selectedType)}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* 프로젝트 목록 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="space-y-4 p-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-300 transition-colors cursor-pointer"
                    onDoubleClick={() => handleViewProject(project)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{project.project_name}</h3>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onDoubleClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleViewProject(project, e)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          상세
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleEditProject(project, e)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                          수정
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => openDeleteDialog(project, e)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          삭제
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      {/* 1줄: 3개 항목 (4칸 중 3칸만 사용) */}
                      <div>
                        <span className="text-muted-foreground">주관기관:</span>
                        <div className="font-medium">{project.lead_organization || '미지정'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">연구책임자:</span>
                        <div className="font-medium">{project.project_manager}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">작성자:</span>
                        <div className="font-medium">{project.member_name || '미지정'}</div>
                      </div>
                      <div className="hidden lg:block"></div> {/* 빈 칸으로 간격 맞춤 */}
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      {/* 2줄: 4개 항목 */}
                      <div>
                        <span className="text-muted-foreground">기간:</span>
                        <div className="font-medium">
                          {formatDateString(project.start_date)} ~ {formatDateString(project.end_date)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">정부지원예산:</span>
                        <div className="font-medium">{formatBudget(project.total_cost)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">주관부처:</span>
                        <div className="font-medium">{project.department || '미지정'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">전문기관:</span>
                        <div className="font-medium">{project.institution || '미지정'}</div>
                      </div>
                    </div>

                    {/* 공고문 링크 */}
                    {project.announcement_link && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 text-left">공고문 링크</h4>
                        <a 
                          href={project.announcement_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {project.announcement_link}
                        </a>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 text-left">사업목적</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.project_purpose}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">기획/신청 과제가 없습니다</h3>
                  <p className="text-muted-foreground mb-4">새로운 과제를 기획해보세요.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 삭제 확인 다이얼로그 */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>프로젝트 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                "{projectToDelete?.project_name}" 프로젝트를 삭제하시겠습니까?
                <br />
                이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 새 프로젝트 생성 다이얼로그 */}
        <RegistPop 
          isRegisterDialogOpen={newProjectDialogOpen}
          setIsRegisterDialogOpen={setNewProjectDialogOpen}
          onRegistrationSuccess={() => {
            fetchProjects() // 새 프로젝트 생성 후 목록 새로고침
          }}
        />
      </main>
    </div>
  )
}
