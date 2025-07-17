"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, MoreHorizontal, Eye } from "lucide-react"
import { apiFetch } from "@/lib/func"
import { formatDateString } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Announcement {
  id: number
  title: string
  content: string
  important: boolean
  member_name: string
  last_editor: string
  created_at: string
  updated_at: string
}

interface AnnouncementsProps {
  projectId?: string
}

export function Announcements({ projectId }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    important: false
  })

  // 공지사항 목록 가져오기
  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/api/schedule/announcements?limit=5')
      const result = await response.json()
      
      if (result.success) {
        setAnnouncements(result.data)
      }
    } catch (error) {
      console.error('공지사항 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      important: false
    })
    setEditingAnnouncement(null)
  }

  // 공지사항 생성/수정
  const handleSubmit = async () => {
    try {
      const url = editingAnnouncement 
        ? `/api/schedule/announcements/${editingAnnouncement.id}`
        : '/api/schedule/announcements'
      
      const method = editingAnnouncement ? 'PUT' : 'POST'
      
      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowDialog(false)
        resetForm()
        fetchAnnouncements()
      } else {
        const errorData = await response.json()
        alert(`저장 실패: ${errorData.error || '알 수 없는 오류가 발생했습니다.'}`)
      }
    } catch (error) {
      console.error('공지사항 저장 오류:', error)
      alert('공지사항 저장 중 오류가 발생했습니다.')
    }
  }

  // 공지사항 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/schedule/announcements/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchAnnouncements()
        // 상세보기가 열려있다면 닫기
        if (selectedAnnouncement?.id === id) {
          setShowDetailDialog(false)
          setSelectedAnnouncement(null)
        }
      } else {
        const errorData = await response.json()
        alert(`삭제 실패: ${errorData.error || '알 수 없는 오류가 발생했습니다.'}`)
      }
    } catch (error) {
      console.error('공지사항 삭제 오류:', error)
      alert('공지사항 삭제 중 오류가 발생했습니다.')
    }
  }

  // 편집 모드 시작
  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      important: announcement.important
    })
    setShowDialog(true)
  }

  // 새 공지사항 작성 모드 시작
  const handleNew = () => {
    resetForm()
    setShowDialog(true)
  }

  // 상세보기 모드 시작
  const handleViewDetail = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setShowDetailDialog(true)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">공지사항</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600"
            onClick={handleNew}
          >
            <Plus className="h-4 w-4 mr-1" />
            작성
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            로딩 중...
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onClick={() => handleViewDetail(announcement)}
                >
                  {announcement.important && (
                    <Badge variant="destructive" className="text-xs">
                      중요
                    </Badge>
                  )}
                  <span className="text-sm font-medium truncate">{announcement.title}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetail(announcement)}>
                      <Eye className="h-4 w-4 mr-2" />
                      상세보기
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(announcement)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="text-xs text-muted-foreground ml-4">
                {formatDateString(announcement.created_at)} · {announcement.member_name}
              </div>
            </div>
          ))
        )}
      </CardContent>

      {/* 공지사항 상세보기 다이얼로그 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedAnnouncement?.important && (
                <Badge variant="destructive" className="text-xs">
                  중요
                </Badge>
              )}
              <DialogTitle className="text-lg">
                {selectedAnnouncement?.title}
              </DialogTitle>
            </div>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              {/* 메타 정보 */}
              <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
                <div className="flex items-center gap-4">
                  <span>작성자: {selectedAnnouncement.member_name}</span>
                  <span>작성일: {formatDateString(selectedAnnouncement.created_at)}</span>
                </div>
                {selectedAnnouncement.last_editor && selectedAnnouncement.last_editor !== selectedAnnouncement.member_name && (
                  <span>수정자: {selectedAnnouncement.last_editor}</span>
                )}
              </div>
              
              {/* 내용 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">내용</Label>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedAnnouncement.content}
                </div>
              </div>

              {/* 수정일 정보 */}
              {selectedAnnouncement.updated_at !== selectedAnnouncement.created_at && (
                <div className="text-xs text-muted-foreground border-t pt-2">
                  최종 수정일: {formatDateString(selectedAnnouncement.updated_at)}
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(selectedAnnouncement)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDetailDialog(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 공지사항 작성/수정 다이얼로그 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? '공지사항 수정' : '새 공지사항 작성'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="content">내용 *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="공지사항 내용을 입력하세요"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="important"
                checked={formData.important}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, important: checked as boolean }))
                }
              />
              <Label htmlFor="important">중요 공지사항</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                취소
              </Button>
              <Button onClick={handleSubmit}>
                {editingAnnouncement ? '수정' : '작성'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 