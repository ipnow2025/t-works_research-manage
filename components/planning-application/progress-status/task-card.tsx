"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Edit, Trash2, ArrowLeft, Check, X } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  dueDate?: string
  startDate?: string
  status: "planned" | "in-progress" | "completed"
}

interface TaskCardProps {
  task: Task
  onDelete: (taskId: string) => void
  onEdit: (taskId: string, updatedTask: Partial<Task>) => void
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void
  onDoubleClick?: (task: Task) => void
}

export function TaskCard({ task, onDelete, onEdit, onStatusChange, onDoubleClick }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const handleCardDoubleClick = (e: React.MouseEvent) => {
    // 버튼 영역을 더블클릭한 경우 상세보기 실행하지 않음
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onDoubleClick?.(task)
  }

  const isOverdue = () => {
    // 완료된 작업은 지연 상태가 아님
    if (task.status === "completed") return false
    if (!task.dueDate) return false
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  const getCardBackground = () => {
    // 마감일이 지난 작업은 빨간색 테두리로 강조
    if (isOverdue()) {
      return "bg-red-50 border-red-300"
    }
    
    switch (task.status) {
      case "in-progress":
        return "bg-white border-blue-200"
      case "completed":
        return "bg-white border-green-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  const getDateText = () => {
    if (task.status === "in-progress" && task.startDate && task.dueDate) {
      return (
        <div className="text-xs text-gray-500 mt-2">
          <div>시작: {task.startDate}</div>
          <div className={isOverdue() ? "text-red-600 font-medium" : ""}>
            마감: {task.dueDate}
            {isOverdue() && <span className="ml-1 text-red-600">(지연)</span>}
          </div>
        </div>
      )
    } else if (task.dueDate) {
      return (
        <div className={`text-xs mt-2 ${isOverdue() ? "text-red-600 font-medium" : "text-gray-500"}`}>
          마감: {task.dueDate}
          {isOverdue() && <span className="ml-1 text-red-600">(지연)</span>}
        </div>
      )
    }
    return null
  }

  const moveToNext = () => {
    if (task.status === "planned") {
      onStatusChange(task.id, "in-progress")
    } else if (task.status === "in-progress") {
      onStatusChange(task.id, "completed")
    }
  }

  const moveToPrevious = () => {
    if (task.status === "in-progress") {
      onStatusChange(task.id, "planned")
    } else if (task.status === "completed") {
      onStatusChange(task.id, "in-progress")
    }
  }

  const handleSave = () => {
    onEdit(task.id, editedTask)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  const handleEdit = () => {
    setEditedTask(task)
    setIsEditing(true)
  }

  const handleDelete = () => {
    if (confirm(`"${task.title}" 작업을 정말 삭제하시겠습니까?`)) {
      onDelete(task.id)
    }
  }

  if (isEditing) {
    return (
      <div className={`p-4 rounded-lg border ${getCardBackground()} shadow-sm`}>
        <div className="space-y-3">
          <Input
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            placeholder="작업 제목"
            className="text-sm"
          />
          <Textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            placeholder="작업 설명"
            className="text-xs resize-none"
            rows={2}
          />
          <Input
            type="date"
            value={editedTask.dueDate || ""}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
            className="text-xs"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 px-2">
              <X className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleSave} className="h-7 px-2">
              <Check className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`p-4 rounded-lg border ${getCardBackground()} shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
      onDoubleClick={handleCardDoubleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1 text-gray-900">{task.title}</h4>
          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
          {getDateText()}
        </div>
        <div className="flex items-center gap-1 ml-3">
          {task.status !== "planned" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-gray-100"
              onClick={moveToPrevious}
              title="이전 단계로"
            >
              <ArrowLeft className="h-3 w-3 text-gray-500" />
            </Button>
          )}
          {task.status !== "completed" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-gray-100"
              onClick={moveToNext}
              title="다음 단계로"
            >
              <ArrowRight className="h-3 w-3 text-gray-600" />
            </Button>
          )}
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100" onClick={handleEdit}>
            <Edit className="h-3 w-3 text-gray-500" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100" onClick={handleDelete}>
            <Trash2 className="h-3 w-3 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  )
}
