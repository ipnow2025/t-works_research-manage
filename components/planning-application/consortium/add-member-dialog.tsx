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

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: {
    name: string
    position: string
    role: string
    phone: string
    mobile: string
    email: string
  }) => void
}

export function AddMemberDialog({ open, onOpenChange, onAddMember }: AddMemberDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    role: "",
    phone: "",
    mobile: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.position && formData.role) {
      onAddMember(formData)
      setFormData({
        name: "",
        position: "",
        role: "",
        phone: "",
        mobile: "",
        email: "",
      })
      onOpenChange(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-white">멤버 추가</DialogTitle>
          <DialogDescription className="text-gray-400">새로운 컨소시엄 멤버 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                이름 *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-300">
                직급 *
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                placeholder="직급을 입력하세요"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300">
              역할 *
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              placeholder="역할을 입력하세요"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">
                전화번호
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                placeholder="031-400-5114"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-gray-300">
                휴대폰
              </Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                placeholder="010-1234-5678"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              placeholder="example@hanyang.ac.kr"
            />
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
