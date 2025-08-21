"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Eye, FileText, Users, Building, DollarSign } from "lucide-react"
import { apiFetch } from "@/lib/func"
import { formatDateString } from "@/lib/utils"
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface CompletedProject {
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

export default function CompletedPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [allProjects, setAllProjects] = useState<CompletedProject[]>([]) // 전체 프로젝트 데이터
  const [filteredProjects, setFilteredProjects] = useState<CompletedProject[]>([]) // 필터링된 프로젝트
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<CompletedProject | null>(null)

  // 전체 완료/미선정 프로젝트 목록 가져오기 (한 번만)
  const fetchCompletedProjects = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/api/project-planning?status=APPROVED,REJECTED')
      if (response.ok) {
        const result = await response.json()
        if (result.success && Array.isArray(result.data)) {
          setAllProjects(result.data)
          setFilteredProjects(result.data) // 초기에는 전체 데이터 표시
        } else {
          setAllProjects([])
          setFilteredProjects([])
        }
      } else {
        setAllProjects([])
        setFilteredProjects([])
      }
    } catch (error) {
      console.error('프로젝트 조회 오류:', error)
      setAllProjects([])
      setFilteredProjects([])
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 한 번만 데이터 가져오기
  useEffect(() => {
    fetchCompletedProjects()
  }, [])

  // 검색어나 필터 변경 시 클라이언트 사이드에서 즉시 필터링
  useEffect(() => {
    let filtered = [...allProjects]

    // 검색어 필터링
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      
      if (selectedType === 'all') {
        // 전체 필드에서 검색
        filtered = filtered.filter(project => 
          project.project_name?.toLowerCase().includes(searchLower) ||
          project.project_manager?.toLowerCase().includes(searchLower) ||
          project.lead_organization?.toLowerCase().includes(searchLower) ||
          project.department?.toLowerCase().includes(searchLower) ||
          project.institution?.toLowerCase().includes(searchLower)
        )
      } else {
        // 특정 필드에서만 검색
        switch (selectedType) {
          case 'project_name':
            filtered = filtered.filter(project => 
              project.project_name?.toLowerCase().includes(searchLower)
            )
            break
          case 'project_manager':
            filtered = filtered.filter(project => 
              project.project_manager?.toLowerCase().includes(searchLower)
            )
            break
          case 'lead_organization':
            filtered = filtered.filter(project => 
              project.lead_organization?.toLowerCase().includes(searchLower)
            )
            break
          case 'start_year':
            // 연도별 검색 (시작 연도)
            if (searchTerm.match(/^\d{4}$/)) {
              const searchYear = parseInt(searchTerm)
              filtered = filtered.filter(project => {
                if (!project.start_date) return false
                const startYear = new Date(project.start_date).getFullYear()
                return startYear === searchYear
              })
            }
            break
        }
      }
    }

    setFilteredProjects(filtered)
  }, [searchTerm, selectedType, allProjects])

  // 대시보드 통계 계산 (전체 데이터 기준으로 고정)
  const calculateStats = (): DashboardStats => {
    const stats: DashboardStats = {
      totalProjects: allProjects.length,
      totalDepartments: new Set(allProjects.map(p => p.department).filter(Boolean)).size,
      totalProjectManagers: new Set(allProjects.map(p => p.project_manager).filter(Boolean)).size,
      totalBudget: allProjects.reduce((sum, p) => sum + (p.total_cost || 0), 0)
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
        setAllProjects(prev => prev.filter(p => p.id !== projectToDelete.id))
        setFilteredProjects(prev => prev.filter(p => p.id !== projectToDelete.id))
        alert('프로젝트가 성공적으로 삭제되었습니다.')
      } else {
        const errorData = await response.json()
        alert(`삭제 실패: ${errorData.error || '알 수 없는 오류가 발생했습니다.'}`)
      }
    } catch (error) {
      alert('프로젝트 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  // 삭제 확인 다이얼로그 열기
  const openDeleteDialog = (project: CompletedProject, e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  // 수정 페이지로 이동
  const handleEditProject = (project: CompletedProject, e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    router.push(`/completed/${project.id}/edit`)
  }

  // 상세 페이지로 이동
  const handleViewProject = (project: CompletedProject, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    }
    router.push(`/completed/${project.id}`)
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

  // 필터 표시명 반환
  const getFilterDisplayName = (filterType: string) => {
    switch (filterType) {
      case "project_name":
        return "과제명"
      case "project_manager":
        return "연구책임자"
      case "lead_organization":
        return "주관기관"
      case "start_year":
        return "연도별"
      default:
        return "전체"
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

  // 필터링된 프로젝트 목록 - API에서 이미 필터링된 데이터를 사용
  // const filteredProjects = completedProjects

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <main className="flex-1 p-6">
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
              완료/미선정 과제
              <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full ml-2">
                {allProjects.length}건
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">완료되거나 미선정된 연구과제 목록입니다</p>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 p-8">
        <div className="space-y-8">

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  총 완료/미선정 과제
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}개</div>
                <p className="text-xs text-muted-foreground">완료/미선정된 과제</p>
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
                  <Select 
                    value={selectedType} 
                    onValueChange={(value) => {
                      setSelectedType(value)
                      // 필터 변경 시 검색어 초기화 (사용자 경험 개선)
                      setSearchTerm('')
                    }}
                  >
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
                          <span className="hidden lg:inline">상세</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleEditProject(project, e)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden lg:inline">수정</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => openDeleteDialog(project, e)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden lg:inline">삭제</span>
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      {/* <div>
                        <span className="text-muted-foreground">과제 ID:</span>
                        <div className="font-medium">{project.id}</div>
                      </div> */}
                      <div>
                        <span className="text-muted-foreground">주관기관:</span>
                        <div className="font-medium">{project.lead_organization || '미지정'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">연구책임자:</span>
                        <div className="font-medium">{project.project_manager}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">담당자:</span>
                        <div className="font-medium">{project.member_name || '미지정'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">기간:</span>
                        <div className="font-medium">
                          {formatDateString(project.start_date)} ~ {formatDateString(project.end_date)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">예산:</span>
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

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-muted-foreground">{project.project_details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm || selectedType !== 'all' ? '검색 결과가 없습니다' : '완료/미선정 과제가 없습니다'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedType !== 'all' 
                      ? `"${searchTerm}" 검색어와 "${getFilterDisplayName(selectedType)}" 필터에 대한 결과가 없습니다.`
                      : '완료되거나 미선정된 과제가 여기에 표시됩니다.'
                    }
                  </p>
                  {(searchTerm || selectedType !== 'all') && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedType('all')
                        }}
                      >
                        검색 조건 초기화
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchTerm('')}
                      >
                        검색어만 초기화
                      </Button>
                    </div>
                  )}
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
      </main>
    </div>
  )
}
