"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle, PlayCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  dueDate?: string
  startDate?: string
  status: "planned" | "in-progress" | "completed"
}

interface TaskDetailDialogProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void
}

export function TaskDetailDialog({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}: TaskDetailDialogProps) {
  if (!task) return null

  const getStatusIcon = () => {
    switch (task.status) {
      case "planned":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "in-progress":
        return <PlayCircle className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (task.status) {
      case "planned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = () => {
    switch (task.status) {
      case "planned":
        return "계획됨"
      case "in-progress":
        return "진행중"
      case "completed":
        return "완료됨"
      default:
        return "알 수 없음"
    }
  }

  const handleEdit = () => {
    onEdit(task)
  }

  const handleDelete = () => {
    if (confirm(`"${task.title}" 작업을 정말 삭제하시겠습니까?`)) {
      onDelete(task.id)
      onClose()
    }
  }

  const handleStatusChange = (newStatus: Task["status"]) => {
    onStatusChange(task.id, newStatus)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getStatusIcon()}
            <span className="text-xl">{task.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 상태 정보 */}
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor()} border`}>
              {getStatusText()}
            </Badge>
            <span className="text-sm text-gray-500">
              작업 ID: {task.id}
            </span>
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4" />
              작업 설명
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
          </div>

          {/* 날짜 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {task.startDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <PlayCircle className="h-4 w-4" />
                  시작일
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-blue-700">{task.startDate}</span>
                </div>
              </div>
            )}
            
            {task.dueDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  마감일
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-700">{task.dueDate}</span>
                </div>
              </div>
            )}
          </div>

          {/* 진행률 표시 */}
          {task.status === "in-progress" && task.startDate && task.dueDate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span>진행률</span>
                <span className="text-blue-600">진행중</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {/* 상태 변경 버튼들 */}
            {task.status !== "planned" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("planned")}
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                계획 단계로
              </Button>
            )}
            
            {task.status !== "in-progress" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("in-progress")}
                className="flex items-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                진행 단계로
              </Button>
            )}
            
            {task.status !== "completed" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("completed")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                완료 단계로
              </Button>
            )}

            {/* 편집 및 삭제 버튼 */}
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center gap-2 ml-auto"
            >
              편집
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              삭제
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
