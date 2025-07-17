"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Document {
  name: string
  type: "PDF" | "DOC" | "XLS"
  required: boolean
  status: "제출" | "미제출" | "검토중"
  uploadDate?: string
  note?: string
}

interface AddDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (document: Omit<Document, "id">) => void
}

export function AddDocumentDialog({ open, onOpenChange, onAdd }: AddDocumentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "PDF" as "PDF" | "DOC" | "XLS",
    required: false,
    note: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("서류명을 입력해주세요.")
      return
    }

    const newDocument: Omit<Document, "id"> = {
      name: formData.name.trim(),
      type: formData.type,
      required: formData.required,
      status: "미제출",
      note: formData.note.trim() || undefined,
    }

    onAdd(newDocument)

    // 폼 초기화
    setFormData({
      name: "",
      type: "PDF",
      required: false,
      note: "",
    })

    onOpenChange(false)
  }

  const handleCancel = () => {
    // 폼 초기화
    setFormData({
      name: "",
      type: "PDF",
      required: false,
      note: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>서류 추가</DialogTitle>
          <DialogDescription>새로운 제출 서류를 추가합니다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                서류명
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="예: 사업계획서"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                파일 형식
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "PDF" | "DOC" | "XLS") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="파일 형식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOC">DOC</SelectItem>
                  <SelectItem value="XLS">XLS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="required" className="text-right">
                필수 여부
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData({ ...formData, required: checked as boolean })}
                />
                <Label htmlFor="required" className="text-sm font-normal">
                  필수 서류
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                비고
              </Label>
              <Input
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="col-span-3"
                placeholder="추가 설명 (선택사항)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
