"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Eye } from "lucide-react"
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

export default function CompletedPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [completedProjects, setCompletedProjects] = useState<CompletedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<CompletedProject | null>(null)

  // 완료/미선정 프로젝트 목록 가져오기
  const fetchCompletedProjects = async () => {
    try {
      setLoading(true)
      // 검색어를 API로 전송
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
      const response = await apiFetch(`/api/project-planning?status=APPROVED,REJECTED${searchParam}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && Array.isArray(result.data)) {
          setCompletedProjects(result.data)
        } else {
          setCompletedProjects([])
        }
      } else {
        setCompletedProjects([])
      }
    } catch (error) {
      setCompletedProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompletedProjects()
  }, [searchTerm]) // searchTerm이 변경될 때마다 프로젝트를 다시 가져옴

  // 프로젝트 삭제
  const handleDeleteProject = async () => {
    if (!projectToDelete) return

    try {
      const response = await apiFetch(`/api/project-planning/${projectToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // 목록에서 삭제된 프로젝트 제거
        setCompletedProjects(prev => prev.filter(p => p.id !== projectToDelete.id))
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
  const handleViewProject = (project: CompletedProject, e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    router.push(`/completed/${project.id}`)
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount * 1000) // 천원 단위로 저장되어 있으므로 1000을 곱함
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

  // 필터링된 프로젝트 목록 - API에서 이미 필터링된 데이터를 사용
  const filteredProjects = completedProjects

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
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                완료/미선정 과제
                <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full ml-2">
                  {filteredProjects.length}건
                </span>
              </h1>
              <p className="text-muted-foreground">완료되거나 미선정된 연구과제 목록입니다.</p>
            </div>
          </div>

          {/* 검색 */}
          {/* <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="과제명, 연구책임자, 주관기관으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* 프로젝트 목록 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="space-y-4 p-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-primary transition-colors"
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
                      <div className="flex items-center gap-2">
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
                          className="flex items-center gap-1"
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
                          <Trash2 className="w-4 h-4" />
                          삭제
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
                  <h3 className="text-lg font-semibold mb-2">완료/미선정 과제가 없습니다</h3>
                  <p className="text-muted-foreground mb-4">완료되거나 미선정된 과제가 여기에 표시됩니다.</p>
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
