"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Upload, Download, Edit, Trash2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AttachmentFile {
  id: string
  name: string
  date: string
  type: string
  file?: File
}

interface DocumentOverviewProps {
  project: any
}

export function DocumentOverview({ project }: DocumentOverviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<AttachmentFile | null>(null)
  const [newFileName, setNewFileName] = useState("")
  
  // 예시 첨부 파일 데이터 (실제로는 API에서 가져올 데이터)
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentFile[]>([
    {
      id: "1",
      name: "공고문.pdf",
      date: "2024-01-15",
      type: "pdf"
    },
    {
      id: "2", 
      name: "사업신청서.docx",
      date: "2024-01-15",
      type: "docx"
    },
    {
      id: "3",
      name: "사업계획서_양식.docx",
      date: "2024-01-15",
      type: "docx"
    },
    {
      id: "4",
      name: "예산계획서_양식.xlsx",
      date: "2024-01-20",
      type: "xlsx"
    },
    {
      id: "5",
      name: "기업정보_양식.docx",
      date: "2024-01-20",
      type: "docx"
    }
  ])

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const fileType = file.name.split('.').pop()?.toLowerCase() || ''
      const newFile: AttachmentFile = {
        id: Date.now().toString(),
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        type: fileType,
        file: file
      }
      
      setAttachmentFiles(prev => [...prev, newFile])
      
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDownload = (file: AttachmentFile) => {
    if (file.file) {
      // 실제 파일이 있는 경우 다운로드
      const url = URL.createObjectURL(file.file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // 예시 데이터인 경우 다운로드 시뮬레이션
      console.log('파일 다운로드:', file.name)
      alert(`${file.name} 파일을 다운로드합니다.`)
    }
  }

  const handleEditFilename = (file: AttachmentFile) => {
    setEditingFile(file)
    setNewFileName(file.name)
    setIsEditDialogOpen(true)
  }

  const handleSaveFilename = () => {
    if (editingFile && newFileName.trim()) {
      setAttachmentFiles(prev => 
        prev.map(file => 
          file.id === editingFile.id 
            ? { ...file, name: newFileName.trim() }
            : file
        )
      )
      setIsEditDialogOpen(false)
      setEditingFile(null)
      setNewFileName("")
    }
  }

  const handleDelete = (fileId: string) => {
    if (confirm('정말로 이 파일을 삭제하시겠습니까?')) {
      setAttachmentFiles(prev => prev.filter(file => file.id !== fileId))
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'xlsx':
        return <FileText className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 첨부 파일 관리 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-xl">첨부 파일</h3>
            <Button 
              onClick={handleFileUpload}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              새 파일 업로드
            </Button>
          </div>

          {/* 숨겨진 파일 input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept=".pdf,.docx,.xlsx,.doc,.xls,.txt"
          />

          {/* 파일 목록 */}
          <div className="space-y-3">
            {attachmentFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">{file.date}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    다운로드
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditFilename(file)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    파일명 수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 파일명 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>파일명 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                새 파일명
              </label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="파일명을 입력하세요"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingFile(null)
                  setNewFileName("")
                }}
              >
                취소
              </Button>
              <Button onClick={handleSaveFilename}>
                저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
