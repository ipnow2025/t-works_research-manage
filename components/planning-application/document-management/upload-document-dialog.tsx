"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

interface UploadDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadDocument: (documentData: any) => void
  folderName: string
}

export function UploadDocumentDialog({ open, onOpenChange, onUploadDocument, folderName }: UploadDocumentDialogProps) {
  const [documentName, setDocumentName] = useState("")
  const [uploader, setUploader] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (documentName.trim() && uploader.trim()) {
      const documentData = {
        name: selectedFile ? selectedFile.name : documentName.trim(),
        uploader: uploader.trim(),
        description: description.trim(),
        size: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)}MB` : "0MB",
      }
      onUploadDocument(documentData)
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setDocumentName("")
    setUploader("")
    setDescription("")
    setSelectedFile(null)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!documentName) {
        setDocumentName(file.name)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">문서 업로드</DialogTitle>
          <DialogDescription className="text-gray-600">{folderName} 폴더에 새 문서를 업로드합니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right text-gray-700">
                파일
              </Label>
              <div className="col-span-3">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  className="bg-white border-gray-300"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentName" className="text-right text-gray-700">
                문서명
              </Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="col-span-3 bg-white border-gray-300"
                placeholder="문서명을 입력하세요"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="uploader" className="text-right text-gray-700">
                업로더
              </Label>
              <Input
                id="uploader"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                className="col-span-3 bg-white border-gray-300"
                placeholder="업로더명을 입력하세요"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2 text-gray-700">
                설명
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 bg-white border-gray-300"
                placeholder="문서에 대한 설명을 입력하세요 (선택사항)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} className="border-gray-300 text-gray-700">
              취소
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              업로드
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
