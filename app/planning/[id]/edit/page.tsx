"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiFetch } from "@/lib/func"

interface ProjectPlanning {
  id: number
  project_name: string
  projectName?: string // fallback field
  title?: string // fallback field
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

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const [project, setProject] = useState<ProjectPlanning | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    project_name: "",
    project_manager: "",
    start_date: "",
    end_date: "",
    department: "",
    institution: "",
    total_cost: 0,
    project_purpose: "",
    project_details: "",
    announcement_link: "",
    status: "DRAFT",
    lead_organization: ""
  })

  // 프로젝트 데이터 가져오기
  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/project-planning/${resolvedParams.id}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const data = result.data
          setProject(data)
          setFormData({
            project_name: data.project_name || data.projectName || data.title || "",
            project_manager: data.project_manager || data.principalInvestigator || data.manager || data.member_name || "",
            start_date: data.start_date || data.startDate ? (data.start_date || data.startDate).split('T')[0] : "",
            end_date: data.end_date || data.endDate ? (data.end_date || data.endDate).split('T')[0] : "",
            department: data.department || "",
            institution: data.institution || data.organization || "",
            total_cost: data.total_cost || data.totalCost || 0,
            project_purpose: data.project_purpose || data.projectPurpose || "",
            project_details: data.project_details || data.projectDetails || data.description || "",
            announcement_link: data.announcement_link || data.announcementLink || "",
            status: data.status || "DRAFT",
            lead_organization: data.lead_organization || data.leadOrganization || data.institution || data.organization || ""
          })
        } else {
          alert('프로젝트를 찾을 수 없습니다.')
          router.push('/planning')
        }
      } else {
        alert('프로젝트를 찾을 수 없습니다.')
        router.push('/planning')
      }
    } catch (error) {
      console.error('프로젝트 조회 오류:', error)
      alert('프로젝트 조회 중 오류가 발생했습니다.')
      router.push('/planning')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [resolvedParams.id])

  // 폼 데이터 업데이트
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 프로젝트 수정
  const handleSave = async () => {
    if (!project) return

    try {
      setSaving(true)
      const response = await apiFetch(`/api/project-planning/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('프로젝트가 성공적으로 수정되었습니다.')
        router.push(`/planning/${project.id}`)
      } else {
        const errorData = await response.json()
        alert(`수정 실패: ${errorData.error || '알 수 없는 오류가 발생했습니다.'}`)
      }
    } catch (error) {
      console.error('프로젝트 수정 오류:', error)
      alert('프로젝트 수정 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>프로젝트를 찾을 수 없습니다.</p>
          <Button onClick={() => router.push('/planning')} className="mt-4">
            기획/신청 목록으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/planning')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            기획/신청 목록으로 돌아가기
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">프로젝트 수정</h1>
            <p className="text-gray-600 mt-2">프로젝트 정보를 수정합니다.</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              저장 중...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              저장
            </>
          )}
        </Button>
      </div>

      {/* 수정 폼 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project_name">과제명 *</Label>
              <Input
                id="project_name"
                value={formData.project_name}
                onChange={(e) => handleInputChange('project_name', e.target.value)}
                placeholder="과제명을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="project_manager">연구책임자 *</Label>
              <Input
                id="project_manager"
                value={formData.project_manager}
                onChange={(e) => handleInputChange('project_manager', e.target.value)}
                placeholder="연구책임자명을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">시작일 *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end_date">종료일 *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="total_cost">정부지원예산 (천원) *</Label>
              <Input
                id="total_cost"
                type="number"
                value={formData.total_cost}
                onChange={(e) => handleInputChange('total_cost', parseInt(e.target.value) || 0)}
                placeholder="정부지원예산을 입력하세요"
              />
            </div>
          </CardContent>
        </Card>

        {/* 기관 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기관 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lead_organization">주관기관</Label>
              <Input
                id="lead_organization"
                value={formData.lead_organization}
                onChange={(e) => handleInputChange('lead_organization', e.target.value)}
                placeholder="주관기관을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="department">주관부처</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="주관부처를 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="institution">전문기관</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                placeholder="전문기관을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="status">상태</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">기획</SelectItem>
                  <SelectItem value="SUBMITTED">진행</SelectItem>
                  <SelectItem value="APPROVED">완료</SelectItem>
                  <SelectItem value="REJECTED">미선정</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 상세 정보 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>상세 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project_purpose">과제 목적</Label>
              <Textarea
                id="project_purpose"
                value={formData.project_purpose}
                onChange={(e) => handleInputChange('project_purpose', e.target.value)}
                placeholder="과제의 목적을 입력하세요"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="project_details">과제 상세내용</Label>
              <Textarea
                id="project_details"
                value={formData.project_details}
                onChange={(e) => handleInputChange('project_details', e.target.value)}
                placeholder="과제의 상세내용을 입력하세요"
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="announcement_link">공고 링크</Label>
              <Input
                id="announcement_link"
                value={formData.announcement_link}
                onChange={(e) => handleInputChange('announcement_link', e.target.value)}
                placeholder="공고 링크를 입력하세요"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 