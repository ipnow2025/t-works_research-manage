"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Upload, FileText, Folder, FolderOpen, Check, X } from "lucide-react"

interface DocumentChecklistProps {
  project: any
}

interface Document {
  id: string
  name: string
  uploader: string
  uploadDate: string
  size: string
  status: string
  folderId: string
}

interface FolderType {
  id: string
  name: string
  parentId?: string
  documentCount: number
  isExpanded?: boolean
  level: number
  isEditing?: boolean
  isNew?: boolean
}

export function DocumentChecklist({ project }: DocumentChecklistProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [folders, setFolders] = useState<FolderType[]>([
    { id: "1", name: "사업공고", documentCount: 0, level: 0 },
    { id: "2", name: "제출서류", documentCount: 0, level: 0, isExpanded: true },
    { id: "3", name: "주관", parentId: "2", documentCount: 0, level: 1 },
    { id: "4", name: "공동", parentId: "2", documentCount: 0, level: 1 },
    { id: "5", name: "위탁", parentId: "2", documentCount: 0, level: 1 },
    { id: "6", name: "계획서", documentCount: 1, isExpanded: true, level: 0 },
    { id: "7", name: "예산", documentCount: 0, level: 0 },
  ])

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "사업계획서_v1.0.pdf",
      uploader: "김연구",
      uploadDate: "2025-01-05",
      size: "2.5MB",
      status: "수정완료",
      folderId: "6",
    },
  ])

  const [selectedFolder, setSelectedFolder] = useState<string>("1")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingFolderName, setEditingFolderName] = useState("")

  const selectedFolderData = folders.find((f) => f.id === selectedFolder)
  const filteredDocuments = documents.filter(
    (doc) => doc.folderId === selectedFolder && doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 폴더를 계층 구조로 정렬
  const getSortedFolders = () => {
    const rootFolders = folders.filter((f) => !f.parentId)
    const result: FolderType[] = []

    const addFolderWithChildren = (folder: FolderType) => {
      result.push(folder)
      if (folder.isExpanded) {
        const children = folders.filter((f) => f.parentId === folder.id)
        children.forEach(addFolderWithChildren)
      }
    }

    rootFolders.forEach(addFolderWithChildren)
    return result
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const newDocument: Document = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          uploader: "사용자",
          uploadDate: new Date().toISOString().split("T")[0],
          size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
          status: "업로드완료",
          folderId: selectedFolder,
        }
        setDocuments((prev) => [...prev, newDocument])
      })

      // 폴더의 문서 개수 업데이트
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === selectedFolder ? { ...folder, documentCount: folder.documentCount + files.length } : folder,
        ),
      )
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleAddFolder = (parentId?: string) => {
    const parentFolder = parentId ? folders.find((f) => f.id === parentId) : null
    const newFolder: FolderType = {
      id: Date.now().toString(),
      name: "새 폴더",
      parentId: parentId,
      documentCount: 0,
      level: parentFolder ? parentFolder.level + 1 : 0,
      isEditing: true,
      isNew: true,
    }

    setFolders([...folders, newFolder])
    setEditingFolderName("새 폴더")

    // 부모 폴더가 있으면 확장 상태로 만들기
    if (parentId) {
      setFolders((prev) => prev.map((f) => (f.id === parentId ? { ...f, isExpanded: true } : f)))
    }
  }

  const handleStartEdit = (folder: FolderType) => {
    setFolders(folders.map((f) => (f.id === folder.id ? { ...f, isEditing: true } : f)))
    setEditingFolderName(folder.name)
  }

  const handleSaveEdit = (folderId: string) => {
    if (editingFolderName.trim()) {
      setFolders(
        folders.map((f) =>
          f.id === folderId ? { ...f, name: editingFolderName.trim(), isEditing: false, isNew: false } : f,
        ),
      )
    } else {
      // 이름이 비어있으면 새 폴더인 경우 삭제
      const folder = folders.find((f) => f.id === folderId)
      if (folder?.isNew) {
        setFolders(folders.filter((f) => f.id !== folderId))
      } else {
        // 기존 폴더는 편집 취소
        setFolders(folders.map((f) => (f.id === folderId ? { ...f, isEditing: false } : f)))
      }
    }
    setEditingFolderName("")
  }

  const handleCancelEdit = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId)
    if (folder?.isNew) {
      // 새 폴더인 경우 삭제
      setFolders(folders.filter((f) => f.id !== folderId))
    } else {
      // 기존 폴더는 편집 취소
      setFolders(folders.map((f) => (f.id === folderId ? { ...f, isEditing: false } : f)))
    }
    setEditingFolderName("")
  }

  const handleDeleteFolder = (folderId: string) => {
    // 하위 폴더들도 함께 삭제
    const getAllChildFolders = (parentId: string): string[] => {
      const children = folders.filter((f) => f.parentId === parentId).map((f) => f.id)
      const allChildren = [...children]
      children.forEach((childId) => {
        allChildren.push(...getAllChildFolders(childId))
      })
      return allChildren
    }

    const foldersToDelete = [folderId, ...getAllChildFolders(folderId)]

    setFolders(folders.filter((f) => !foldersToDelete.includes(f.id)))
    setDocuments(documents.filter((doc) => !foldersToDelete.includes(doc.folderId)))

    // 선택된 폴더가 삭제된 경우 첫 번째 폴더로 변경
    if (foldersToDelete.includes(selectedFolder)) {
      const remainingFolders = folders.filter((f) => !foldersToDelete.includes(f.id))
      if (remainingFolders.length > 0) {
        setSelectedFolder(remainingFolders[0].id)
      }
    }
  }

  const handleToggleFolder = (folderId: string) => {
    setFolders(folders.map((f) => (f.id === folderId ? { ...f, isExpanded: !f.isExpanded } : f)))
  }

  const handleDeleteDocument = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId)
    if (document) {
      setDocuments(documents.filter((doc) => doc.id !== documentId))

      // 폴더의 문서 개수 업데이트
      setFolders(
        folders.map((folder) =>
          folder.id === document.folderId
            ? { ...folder, documentCount: Math.max(0, folder.documentCount - 1) }
            : folder,
        ),
      )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "수정완료":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "업로드완료":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "검토중":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex h-[700px] bg-white">
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 왼쪽 폴더 트리 */}
      <div className="w-80 border-r bg-gray-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">폴더</h3>
          <Button size="sm" variant="ghost" onClick={() => handleAddFolder()} className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {getSortedFolders().map((folder) => (
            <div
              key={folder.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-blue-50 ${
                selectedFolder === folder.id ? "bg-blue-100 border border-blue-200" : ""
              }`}
              style={{ marginLeft: `${folder.level * 16}px` }}
            >
              <div
                className="flex items-center space-x-2 flex-1"
                onClick={() => !folder.isEditing && setSelectedFolder(folder.id)}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleFolder(folder.id)
                  }}
                >
                  {folder.isExpanded ? (
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Folder className="h-4 w-4 text-blue-500" />
                  )}
                </div>

                {folder.isEditing ? (
                  <div className="flex items-center space-x-1 flex-1">
                    <Input
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      className="h-6 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit(folder.id)
                        } else if (e.key === "Escape") {
                          handleCancelEdit(folder.id)
                        }
                      }}
                    />
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleSaveEdit(folder.id)}>
                      <Check className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleCancelEdit(folder.id)}
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm font-medium">{folder.name}</span>
                )}
              </div>

              {!folder.isEditing && (
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddFolder(folder.id)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartEdit(folder)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFolder(folder.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 문서 목록 */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-xl">
            {selectedFolderData?.name} ({filteredDocuments.length}개)
          </h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="문서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" className="text-gray-600" onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              업로드
            </Button>
            <Button onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              업로드
            </Button>
          </div>
        </div>

        {/* 문서 목록 */}
        <div className="space-y-3">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-6">문서가 없습니다.</p>
              <Button onClick={handleUploadClick} variant="outline" className="flex flex-col items-center p-6 h-auto">
                <Upload className="h-8 w-8 mb-2" />
                <span className="font-medium">파일 선택</span>
                <span className="text-sm text-gray-500">PDF, DOC, 이미지 파일</span>
              </Button>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">{document.name}</div>
                    <div className="text-sm text-gray-500">
                      {document.uploader} • {document.uploadDate} • {document.size}
                    </div>
                  </div>
                  <Badge className={getStatusColor(document.status)}>{document.status}</Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
