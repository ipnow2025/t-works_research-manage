"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Task {
  title: string
  description: string
  dueDate?: string
  startDate?: string
  status: "planned" | "in-progress" | "completed"
}

interface AddTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (task: Task) => void
  onEdit?: (task: Task) => void
  defaultStatus: Task["status"]
  editingTask?: Task | null
}

export function AddTaskDialog({ isOpen, onClose, onAdd, onEdit, defaultStatus, editingTask }: AddTaskDialogProps) {
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    dueDate: "",
    startDate: "",
    status: defaultStatus,
  })

  // 편집 모드일 때 기존 데이터로 폼을 채움
  useEffect(() => {
    if (editingTask) {
      setFormData(editingTask)
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        startDate: "",
        status: defaultStatus,
      })
    }
  }, [editingTask, defaultStatus, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim()) {
      if (editingTask && onEdit) {
        onEdit(formData)
      } else {
        onAdd(formData)
      }
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        startDate: "",
        status: defaultStatus,
      })
    }
  }

  const handleChange = (field: keyof Task, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getStatusLabel = () => {
    switch (defaultStatus) {
      case "planned":
        return "예정된 작업"
      case "in-progress":
        return "진행중인 작업"
      case "completed":
        return "완료된 작업"
      default:
        return "작업"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {editingTask ? `${getStatusLabel()} 수정` : `${getStatusLabel()} 추가`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-700">
              제목
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="작업 제목을 입력하세요"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-700">
              설명
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="작업 설명을 입력하세요"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          {/* 진행중인 작업일 때는 시작일 입력 필드를 표시하지 않음 */}
          {/* {defaultStatus === "in-progress" && (
            <div>
              <Label htmlFor="startDate" className="text-gray-700">
                시작일
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
          )} */}
          <div>
            <Label htmlFor="dueDate" className="text-gray-700">
              마감일
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              취소
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingTask ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
