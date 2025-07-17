"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Calendar, Flag } from "lucide-react"
import { apiFetch } from "@/lib/func"
import { formatDateString } from "@/lib/utils"

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

interface MilestoneListProps {
  projectId: string
  onEdit?: (milestone: Milestone) => void
}

export function MilestoneList({ projectId, onEdit }: MilestoneListProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMilestones = async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/project-milestones?projectId=${projectId}`)
      const result = await response.json()
      
      if (response.ok && result.success) {
        setMilestones(result.data)
      } else {
        console.error('마일스톤 목록 조회 실패:', result.error)
        setMilestones([])
      }
    } catch (error) {
      console.error('마일스톤 목록 조회 오류:', error)
      setMilestones([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMilestones()
  }, [projectId])

  const handleDelete = async (milestoneId: number) => {
    if (!confirm('정말로 이 마일스톤을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/project-milestones/${milestoneId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchMilestones() // 목록 새로고침
      } else {
        alert('마일스톤 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('마일스톤 삭제 오류:', error)
      alert('마일스톤 삭제 중 오류가 발생했습니다.')
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "계획"
      case "IN_PROGRESS":
        return "진행중"
      case "COMPLETED":
        return "완료"
      case "DELAYED":
        return "지연"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "DELAYED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "text-green-600"
      case "MEDIUM":
        return "text-yellow-600"
      case "HIGH":
        return "text-orange-600"
      case "CRITICAL":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-sm text-muted-foreground">마일스톤을 불러오는 중...</div>
      </div>
    )
  }

  if (milestones.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-sm text-muted-foreground">등록된 마일스톤이 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-medium">{milestone.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                {getStatusText(milestone.status)}
              </span>
              <div className={`flex items-center gap-1 text-xs ${getPriorityColor(milestone.priority)}`}>
                <Flag className="h-3 w-3" />
                <span>{milestone.priority}</span>
              </div>
            </div>
            
            {milestone.description && (
              <p className="text-xs text-muted-foreground mb-2">{milestone.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {milestone.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>마감일: {formatDateString(milestone.dueDate)}</span>
                </div>
              )}
              {milestone.progressPercentage > 0 && (
                <span>진행률: {milestone.progressPercentage}%</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit?.(milestone)}
              className="p-1 text-muted-foreground hover:text-foreground"
              title="수정"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(milestone.id)}
              className="p-1 text-muted-foreground hover:text-red-600"
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 