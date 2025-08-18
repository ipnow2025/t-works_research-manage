"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { apiFetch } from "@/lib/func"

interface Milestone {
  id: number
  projectId: number
  title: string
  description?: string
  status: string
  dueDate?: string
  completionDate?: string
  progressPercentage: number
  priority: string
  createdAt: string
  updatedAt: string
}

interface MilestoneDialogProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  milestone?: Milestone | null
  onSuccess?: () => void
}

export function MilestoneDialog({ 
  isOpen, 
  onClose, 
  projectId, 
  milestone = null, 
  onSuccess 
}: MilestoneDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PLANNED",
    due_date: "",
    completion_date: "",
    progress_percentage: 0,
    priority: "MEDIUM"
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (milestone) {
      setFormData({
        title: milestone.title,
        description: milestone.description || "",
        status: milestone.status,
        due_date: milestone.dueDate ? milestone.dueDate.split('T')[0] : "",
        completion_date: milestone.completionDate ? milestone.completionDate.split('T')[0] : "",
        progress_percentage: milestone.progressPercentage,
        priority: milestone.priority
      })
    } else {
      setFormData({
        title: "",
        description: "",
        status: "PLANNED",
        due_date: "",
        completion_date: "",
        progress_percentage: 0,
        priority: "MEDIUM"
      })
    }
  }, [milestone, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }

    setLoading(true)

    try {
      const url = milestone 
        ? `/api/project-milestones/${milestone.id}`
        : '/api/project-milestones'
      
      const method = milestone ? 'PUT' : 'POST'
      const body = milestone 
        ? { 
            title: formData.title,
            description: formData.description,
            status: formData.status,
            due_date: formData.due_date,
            completion_date: formData.completion_date,
            progress_percentage: formData.progress_percentage,
            priority: formData.priority
          }
        : { 
            title: formData.title,
            description: formData.description,
            status: formData.status,
            due_date: formData.due_date,
            completion_date: formData.completion_date,
            progress_percentage: formData.progress_percentage,
            priority: formData.priority,
            projectId: parseInt(projectId)
          }

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert(milestone ? "마일스톤이 수정되었습니다." : "마일스톤이 생성되었습니다.")
        onSuccess?.()
        onClose()
      } else {
        alert(result.error || "마일스톤 저장에 실패했습니다.")
      }
    } catch (error) {
      console.error('마일스톤 저장 오류:', error)
      alert("마일스톤 저장 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress_percentage' ? (value === '' ? 0 : parseInt(value) || 0) : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {milestone ? "마일스톤 수정" : "마일스톤 추가"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-input rounded-md bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">상태</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="PLANNED">계획</option>
                <option value="IN_PROGRESS">진행중</option>
                <option value="COMPLETED">완료</option>
                <option value="DELAYED">지연</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">우선순위</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="LOW">낮음</option>
                <option value="MEDIUM">보통</option>
                <option value="HIGH">높음</option>
                <option value="CRITICAL">긴급</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">마감일</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="w-full p-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">완료일</label>
              <input
                type="date"
                name="completion_date"
                value={formData.completion_date}
                onChange={handleInputChange}
                className="w-full p-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">진행률 (%)</label>
            <input
              type="number"
              name="progress_percentage"
              value={formData.progress_percentage.toString()}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-input rounded-md hover:bg-muted"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "저장 중..." : (milestone ? "수정" : "추가")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 