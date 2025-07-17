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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddFolder: (folderName: string) => void
  isSubFolder?: boolean
  parentFolderName?: string
}

export function AddFolderDialog({
  open,
  onOpenChange,
  onAddFolder,
  isSubFolder,
  parentFolderName,
}: AddFolderDialogProps) {
  const [folderName, setFolderName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (folderName.trim()) {
      onAddFolder(folderName.trim())
      setFolderName("")
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setFolderName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isSubFolder ? "하위 폴더 추가" : "새 폴더 추가"}</DialogTitle>
          <DialogDescription>
            {isSubFolder ? `"${parentFolderName}" 폴더에 하위 폴더를 생성합니다.` : "새로운 폴더를 생성합니다."}
          </DialogDescription>
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
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
