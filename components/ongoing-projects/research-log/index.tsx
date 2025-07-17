"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, FileText, Calendar, User, FolderOpen } from "lucide-react"
import { apiFetch } from "@/lib/func"
import { toast } from "sonner"
import FileView from "@/components/FileView"

interface ResearchLogProps {
  project: any
}

interface ResearchLog {
  id: number
  date: string
  title: string
  author: string
  projectTitle: string
  fileCount: number
  createdAt: string
  updatedAt: string
}

export function ResearchLog({ project }: ResearchLogProps) {
  const [researchLogs, setResearchLogs] = useState<ResearchLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingLog, setEditingLog] = useState<ResearchLog | null>(null)
  const [selectedLog, setSelectedLog] = useState<ResearchLog | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    author: "",
    content: "",
    category: ""
  })

  const categories = [
    "진행보고",
    "실험결과",
    "문헌조사",
    "회의록",
    "장비/시설",
    "기타"
  ]

  // 연구일지 목록 가져오기
  const fetchResearchLogs = async () => {
    try {
      const response = await apiFetch(`/api/research-log?projectId=${project.id}`)
      const result = await response.json()
      
      if (result.success) {
        setResearchLogs(result.data)
      }
    } catch (error) {
      console.error('연구일지 조회 오류:', error)
      toast.error('연구일지를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (project?.id) {
      fetchResearchLogs()
    }
  }, [project?.id])

  // 연구일지 생성/수정
  const handleSubmit = async () => {
    try {
      if (!formData.date || !formData.title || !formData.author) {
        toast.error('필수 필드를 입력해주세요.')
        return
      }

      const url = editingLog 
        ? `/api/research-log/${editingLog.id}`
        : '/api/research-log'
      
      const method = editingLog ? 'PUT' : 'POST'
      
      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          ...formData
        })
      })

      if (response.ok) {
        toast.success('연구일지가 저장되었습니다.')
        setShowDialog(false)
        setFormData({
          date: "",
          title: "",
          author: "",
          content: "",
          category: ""
        })
        setEditingLog(null)
        fetchResearchLogs()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || '연구일지 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('연구일지 저장 오류:', error)
      toast.error('연구일지 저장 중 오류가 발생했습니다.')
    }
  }

  // 연구일지 삭제
  const handleDelete = async (logId: number) => {
    if (!confirm('정말로 이 연구일지를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/research-log/${logId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('연구일지가 삭제되었습니다.')
        fetchResearchLogs()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || '연구일지 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('연구일지 삭제 오류:', error)
      toast.error('연구일지 삭제 중 오류가 발생했습니다.')
    }
  }

  // 편집 모드 시작
  const handleEdit = (log: ResearchLog) => {
    setEditingLog(log)
    setFormData({
      date: log.date.split('T')[0],
      title: log.title,
      author: log.author,
      content: "",
      category: ""
    })
    setShowDialog(true)
  }

  // 새 작성 모드 시작
  const handleNew = () => {
    setEditingLog(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      title: "",
      author: "",
      content: "",
      category: ""
    })
    setShowDialog(true)
  }

  // 상세 보기
  const handleViewDetail = (log: ResearchLog) => {
    setSelectedLog(log)
    setShowDetailDialog(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">연구일지를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 연구일지 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              연구일지 목록
            </CardTitle>
            <Button onClick={handleNew} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              연구일지 작성
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {researchLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-lg">{log.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(log.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {log.author}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(log)}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(log)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(log.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {researchLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                등록된 연구일지가 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 연구일지 작성/수정 다이얼로그 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingLog ? '연구일지 수정' : '새 연구일지 작성'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">날짜 *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="category">카테고리</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="연구일지 제목을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="author">작성자 *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="작성자를 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="연구일지 내용을 입력하세요"
                rows={6}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                취소
              </Button>
              <Button onClick={handleSubmit}>
                {editingLog ? '수정' : '작성'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 연구일지 상세 보기 다이얼로그 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>연구일지 상세</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{selectedLog.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedLog.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedLog.author}
                  </div>
                </div>
              </div>

              {/* 파일 목록 */}
              <div>
                <h4 className="font-medium mb-3">첨부 파일</h4>
                <FileView 
                  functionName="research_log" 
                  refIdx={selectedLog.id}
                  onFileUpload={() => {
                    // 파일 업로드 후 연구일지 목록 새로고침
                    fetchResearchLogs()
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
