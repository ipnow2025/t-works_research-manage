"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar, Upload, X } from "lucide-react"

interface AddResearchLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: any
}

export function AddResearchLogDialog({ open, onOpenChange, project }: AddResearchLogDialogProps) {
  const [formData, setFormData] = useState({
    date: "2025-06-17",
    author: "",
    newAuthor: "",
    title: "",
    relatedProject: "",
    content: "",
    attachments: [] as File[],
  })

  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...files],
      }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...files],
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const addNewAuthor = () => {
    if (formData.newAuthor.trim()) {
      setFormData((prev) => ({
        ...prev,
        author: prev.newAuthor,
        newAuthor: "",
      }))
    }
  }

  const handleSave = () => {
    // 폼 유효성 검사
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    // 폼 초기화 및 모달 닫기
    setFormData({
      date: "2025-06-17",
      author: "",
      newAuthor: "",
      title: "",
      relatedProject: "",
      content: "",
      attachments: [],
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    setFormData({
      date: "2025-06-17",
      author: "",
      newAuthor: "",
      title: "",
      relatedProject: "",
      content: "",
      attachments: [],
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 연구 기록 작성</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 날짜 선택 */}
          <div className="space-y-2">
            <Label className="text-blue-600">날짜 선택</Label>
            <div className="relative">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* 작성자 */}
          <div className="space-y-2">
            <Label>작성자</Label>
            <div className="flex gap-2">
              <Input
                placeholder="새 작성자 이름 입력"
                value={formData.newAuthor}
                onChange={(e) => setFormData((prev) => ({ ...prev, newAuthor: e.target.value }))}
                className="flex-1"
              />
              <Button
                onClick={addNewAuthor}
                className="bg-black text-white hover:bg-gray-800"
                disabled={!formData.newAuthor.trim()}
              >
                추가
              </Button>
            </div>
            <Select
              value={formData.author}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, author: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="작성자 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="김교수">김교수</SelectItem>
                <SelectItem value="김동성">김동성</SelectItem>
                <SelectItem value="이연구원">이연구원</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <Label>제목</Label>
            <Input
              placeholder="제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* 관련 과제 */}
          <div className="space-y-2">
            <Label>관련 과제</Label>
            <Select
              value={formData.relatedProject}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, relatedProject: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="관련 과제 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="인공지능 기반 사용자별 기술 개발">인공지능 기반 사용자별 기술 개발</SelectItem>
                <SelectItem value="고효율 배터리 시스템 개발">고효율 배터리 시스템 개발</SelectItem>
                <SelectItem value="스마트 IoT 플랫폼 구축">스마트 IoT 플랫폼 구축</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label className="text-blue-600">내용</Label>
            <Textarea
              placeholder="연구 내용을 입력하세요"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-[120px]"
            />
          </div>

          {/* 첨부 파일 */}
          <div className="space-y-2">
            <Label className="text-blue-600">첨부 파일</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">파일을 선택하거나 여기에 드래그하세요</p>
              <Button variant="outline" className="text-blue-600" asChild>
                <label>
                  파일 선택
                  <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                </label>
              </Button>
            </div>

            {/* 업로드된 파일 목록 */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
