"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FolderType {
  id: string
  name: string
  parentId?: string
  documentCount: number
  isExpanded?: boolean
  level: number
}

interface EditFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder: FolderType | null
  onEditFolder: (folderId: string, newName: string) => void
}

export function EditFolderDialog({ open, onOpenChange, folder, onEditFolder }: EditFolderDialogProps) {
  const [folderName, setFolderName] = useState("")

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name)
    }
  }, [folder])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (folderName.trim() && folder) {
      onEditFolder(folder.id, folderName.trim())
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    if (folder) {
      setFolderName(folder.name)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>폴더 이름 수정</DialogTitle>
          <DialogDescription>폴더의 이름을 수정합니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folderName" className="text-right">
                폴더명
              </Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="col-span-3"
                placeholder="폴더명을 입력하세요"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit">수정</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
