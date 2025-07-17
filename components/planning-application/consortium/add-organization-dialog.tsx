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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddOrganization: (org: {
    name: string
    type: string
  }) => void
}

export function AddOrganizationDialog({ open, onOpenChange, onAddOrganization }: AddOrganizationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.type) {
      onAddOrganization(formData)
      setFormData({
        name: "",
        type: "",
      })
      onOpenChange(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-white">컨소시엄 기관 추가</DialogTitle>
          <DialogDescription className="text-gray-400">새로운 컨소시엄 기관 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-gray-300">
              기관명 *
            </Label>
            <Input
              id="orgName"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              placeholder="기관명을 입력하세요"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgType" className="text-gray-300">
              참여 유형 *
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="참여 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="주관" className="text-white hover:bg-gray-600">
                  주관
                </SelectItem>
                <SelectItem value="참여" className="text-white hover:bg-gray-600">
                  참여
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              취소
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
