"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Download, Edit, Trash, FileText, BarChart3, Calendar } from "lucide-react"
import { SearchFilters } from './components/SearchFilters'
import { organizationApi, researcherApi, projectApi } from './utils/api'

interface ProjectSearchFilters {
  year: string
  organization: string
  status: string
  searchQuery: string
}

interface Organization {
  id: number
  name: string
}

interface Researcher {
  id: number
  name: string
}

interface Project {
  id: number
  name: string
  type: string
  organization: string
  pi_name: string
  start_date: string
  end_date: string
  budget?: number
  description?: string
  status: string
}

// 날짜 포맷팅 유틸리티 함수
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  // ISO 문자열에서 날짜 부분만 추출 (YYYY-MM-DD)
  return dateString.split('T')[0]
}

export default function ProjectsPage() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const currentYear = new Date().getFullYear()
  const [searchFilters, setSearchFilters] = useState<ProjectSearchFilters>({
    year: "",
    organization: "",
    status: "",
    searchQuery: ""
  })

  // 수행기관과 연구책임자 상태 관리 (API 기반)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [researchers, setResearchers] = useState<Researcher[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const [orgsData, researchersData, projectsData] = await Promise.all([
        organizationApi.getAll(),
        researcherApi.getAll(),
        projectApi.getAll()
      ])
      setOrganizations(orgsData)
      setResearchers(researchersData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading initial data:', error)
      alert('데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 프로젝트를 타입별로 분류
  const planningProjects = projects.filter(p => p.status === '기획중' || p.status === '신청완료' || p.status === '마감임박')
  const ongoingProjects = projects.filter(p => p.status === '진행중')

  const [newProject, setNewProject] = useState({
    name: "",
    type: "",
    organization: "",
    pi: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  })

  // 검색 필터 핸들러
  const handleSearch = async (filters: ProjectSearchFilters) => {
    try {
      setSearchFilters(filters)
      setIsLoading(true)
      
      const searchParams = {
        year: filters.year || undefined,
        organization: filters.organization || undefined,
        status: filters.status || undefined,
        searchQuery: filters.searchQuery || undefined
      }
      
      const filteredProjects = await projectApi.getAll(searchParams)
      setProjects(filteredProjects)
    } catch (error) {
      console.error('Error searching projects:', error)
      alert('검색 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    try {
      setSearchFilters({
        year: "",
        organization: "",
        status: "",
        searchQuery: ""
      })
      setIsLoading(true)
      const allProjects = await projectApi.getAll()
      setProjects(allProjects)
    } catch (error) {
      console.error('Error resetting filters:', error)
      alert('필터 초기화 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowRegistrationForm = () => {
    setEditMode('create')
    setEditingProject(null)
    setNewProject({
      name: "",
      type: "",
      organization: "",
      pi: "",
      startDate: "",
      endDate: "",
      budget: "",
      description: "",
    })
    setIsRegistrationOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditMode('edit')
    setEditingProject(project)
    
    // 수정할 프로젝트 데이터로 폼 초기화
    setNewProject({
      name: project.name,
      type: project.type,
      organization: project.organization,
      pi: project.pi_name,
      startDate: formatDate(project.start_date),
      endDate: formatDate(project.end_date),
      budget: project.budget?.toString() || "",
      description: project.description || "",
    })
    
    setIsRegistrationOpen(true)
  }

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('정말로 이 과제를 삭제하시겠습니까?')) {
      return
    }

    try {
      await projectApi.delete(projectId)
      // 삭제 후 목록 새로고침
      await loadInitialData()
      alert('과제가 삭제되었습니다.')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('과제 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleNewProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewProject((prev) => ({
      ...prev,
      [id.replace("project-", "")]: value,
    }))
  }

  const handleRegisterProject = async () => {
    // 필수 필드 검증
    if (!newProject.name || !newProject.type || !newProject.organization || !newProject.pi || !newProject.startDate || !newProject.endDate) {
      alert("필수 항목을 모두 입력해주세요.")
      return
    }

    try {
      const projectData = {
        name: newProject.name,
        type: newProject.type,
        organization: newProject.organization,
        pi: newProject.pi,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        budget: newProject.budget,
        description: newProject.description
      }

      if (editMode === 'edit' && editingProject) {
        // 수정 모드
        await projectApi.update(editingProject.id, projectData)
        alert("과제가 수정되었습니다.")
      } else {
        // 등록 모드
        await projectApi.create(projectData)
        alert("새 과제가 등록되었습니다.")
      }

      // 폼 초기화 및 모달 닫기
      setNewProject({
        name: "",
        type: "",
        organization: "",
        pi: "",
        startDate: "",
        endDate: "",
        budget: "",
        description: "",
      })
      setEditMode('create')
      setEditingProject(null)
      setIsRegistrationOpen(false)

      // 목록 새로고침
      await loadInitialData()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('과제 저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">연구과제 통합관리</h1>
      </div>

      {isLoading ? (
        <Card className="mb-6">
          <CardContent className="p-5 text-center">
            <div>데이터를 불러오는 중...</div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="projects" className="mb-6">
          <TabsContent value="projects">
            {/* 검색 필터 */}
            <Card className="mb-6">
              <CardContent className="p-5">
                <SearchFilters
                  onSearch={handleSearch}
                  onReset={handleReset}
                  onAddProject={handleShowRegistrationForm}
                  organizations={organizations}
                  setOrganizations={setOrganizations}
                  researchers={researchers}
                  setResearchers={setResearchers}
                />
              </CardContent>
            </Card>

            {/* 기획/신청 과제 섹션 */}
            <Card className="mb-5">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">기획/신청 과제</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-xs font-medium text-gray-500">과제명</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">수행기관</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">연구책임자</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">시작일</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">종료일</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 w-[100px]">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planningProjects.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100">
                          <td className="p-3">
                            <span className="font-medium">{project.name}</span>
                          </td>
                          <td className="p-3">{project.organization}</td>
                          <td className="p-3">{project.pi_name}</td>
                          <td className="p-3">{formatDate(project.start_date)}</td>
                          <td className={`p-3 ${project.status === "마감임박" ? "text-red-600 font-medium" : ""}`}>
                            {formatDate(project.end_date)}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                project.status === "기획중"
                                  ? "bg-amber-50 text-amber-600"
                                  : project.status === "신청완료"
                                    ? "bg-purple-50 text-purple-600"
                                    : "bg-red-50 text-red-600"
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button 
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-green-500"
                                onClick={() => handleEditProject(project)}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-500"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {planningProjects.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-5 text-center text-gray-500">
                            기획/신청 과제가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">과제 목록</h2>
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    엑셀 다운로드
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-xs font-medium text-gray-500">과제명</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">수행기관</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">연구책임자</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">시작일</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">종료일</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 w-[100px]">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ongoingProjects.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100">
                          <td className="p-3">
                            <span className="font-medium">{project.name}</span>
                          </td>
                          <td className="p-3">{project.organization}</td>
                          <td className="p-3">{project.pi_name}</td>
                          <td className="p-3">{formatDate(project.start_date)}</td>
                          <td className="p-3">{formatDate(project.end_date)}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                project.status === "진행중" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button 
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-green-500"
                                onClick={() => handleEditProject(project)}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-500"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {ongoingProjects.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-5 text-center text-gray-500">
                            진행 중인 과제가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* 새 과제 등록/수정 모달 */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editMode === 'create' ? '새 과제 등록' : '과제 수정'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">
                  과제명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="project-name"
                  placeholder="과제명을 입력하세요"
                  value={newProject.name}
                  onChange={handleNewProjectChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-type">
                  과제 유형 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="project-type"
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                  value={newProject.type}
                  onChange={handleNewProjectChange}
                >
                  <option value="">선택하세요</option>
                  <option value="planning">기획 과제</option>
                  <option value="application">신청 과제</option>
                  <option value="ongoing">진행 과제</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-organization">
                  수행기관 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="project-organization"
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                  value={newProject.organization}
                  onChange={handleNewProjectChange}
                >
                  <option value="">선택하세요</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.name}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-pi">
                  연구책임자 <span className="text-red-500">*</span>
                </Label>
                <select
                  id="project-pi"
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                  value={newProject.pi}
                  onChange={handleNewProjectChange}
                >
                  <option value="">선택하세요</option>
                  {researchers.map(researcher => (
                    <option key={researcher.id} value={researcher.name}>{researcher.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-startDate">
                  시작일 <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Input
                    id="project-startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={handleNewProjectChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-endDate">
                  종료일 <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Input
                    id="project-endDate"
                    type="date"
                    value={newProject.endDate}
                    onChange={handleNewProjectChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-budget">
                총 연구비 (원)
              </Label>
              <Input
                id="project-budget"
                type="number"
                placeholder="예: 100000000"
                value={newProject.budget}
                onChange={handleNewProjectChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">과제 개요</Label>
              <Textarea
                id="project-description"
                placeholder="과제에 대한 간략한 설명을 입력하세요"
                rows={4}
                value={newProject.description}
                onChange={handleNewProjectChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
              취소
            </Button>
            <Button type="submit" onClick={handleRegisterProject}>
              {editMode === 'create' ? '등록하기' : '수정하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
