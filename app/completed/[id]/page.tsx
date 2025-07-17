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
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
            <Button onClick={() => router.push("/completed")} className="mt-4">
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
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/completed")}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              완료/미선정 목록으로 돌아가기
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.project_name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">프로젝트 ID: {project.id}</span>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="details">상세정보</TabsTrigger>
              <TabsTrigger value="status">상태정보</TabsTrigger>
            </TabsList>

            {/* 개요 탭 */}
            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>

            {/* 상세정보 탭 */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 과제 목적 */}
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

                {/* 과제 상세내용 */}
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
            </TabsContent>

            {/* 상태정보 탭 */}
            <TabsContent value="status" className="space-y-6">
              {/* 상태별 추가 정보 */}
              {project.status === "REJECTED" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        미선정 정보
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2"
                      >
                        {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        {isEditing ? '보기' : '편집'}
                      </Button>
                    </div>
                    <CardDescription>
                      이 프로젝트는 미선정되었습니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reapplication_possibility" className="font-medium">
                          재신청 가능 여부
                        </Label>
                        {isEditing ? (
                          <Textarea
                            id="reapplication_possibility"
                            value={statusInfo.reapplication_possibility}
                            onChange={(e) => setStatusInfo(prev => ({
                              ...prev,
                              reapplication_possibility: e.target.value
                            }))}
                            placeholder="재신청 가능 여부를 입력하세요..."
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">
                            {project.reapplication_possibility || '재신청 가능 여부가 입력되지 않았습니다.'}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="improvement_direction" className="font-medium">
                          개선 방향
                        </Label>
                        {isEditing ? (
                          <Textarea
                            id="improvement_direction"
                            value={statusInfo.improvement_direction}
                            onChange={(e) => setStatusInfo(prev => ({
                              ...prev,
                              improvement_direction: e.target.value
                            }))}
                            placeholder="개선 방향을 입력하세요..."
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">
                            {project.improvement_direction || '개선 방향이 입력되지 않았습니다.'}
                          </p>
                        )}
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleSaveStatusInfo}
                            disabled={saving}
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {saving ? '저장 중...' : '저장'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={saving}
                          >
                            취소
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.status === "APPROVED" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <Award className="h-5 w-5" />
                        완료 정보
                      </CardTitle>
                    </div>
                    <CardDescription>
                      이 프로젝트는 성공적으로 완료되었습니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">완료일</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.end_date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="performance_summary" className="font-medium">
                          성과 요약
                        </Label>

                        {/* KPI 컴포넌트 추가 */}
                        <div className="mt-4">
                          <KPI project={project} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="follow_up_actions" className="font-medium">
                            후속 조치
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-2"
                          >
                            {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                            {isEditing ? '보기' : '편집'}
                          </Button>
                        </div>
                        {isEditing ? (
                          <Textarea
                            id="follow_up_actions"
                            value={statusInfo.follow_up_actions}
                            onChange={(e) => setStatusInfo(prev => ({
                              ...prev,
                              follow_up_actions: e.target.value
                            }))}
                            placeholder="후속 조치 사항을 입력하세요..."
                            className="mt-2"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">
                            {project.follow_up_actions || '후속 조치가 입력되지 않았습니다.'}
                          </p>
                        )}
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleSaveStatusInfo}
                            disabled={saving}
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {saving ? '저장 중...' : '저장'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={saving}
                          >
                            취소
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
} 