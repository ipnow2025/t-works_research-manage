"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddBudgetItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (item: any) => void
}

export function AddBudgetItemDialog({ open, onOpenChange, onAdd }: AddBudgetItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    total: 0,
    ratio: 0,
    direct: 0,
    indirect: 0,
    note: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({
      name: "",
      total: 0,
      ratio: 0,
      direct: 0,
      indirect: 0,
      note: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>비목 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">
              비목명
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total" className="text-gray-300">
                총액 (천원)
              </Label>
              <Input
                id="total"
                type="number"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: Number.parseInt(e.target.value) || 0 })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="ratio" className="text-gray-300">
                비율 (%)
              </Label>
              <Input
                id="ratio"
                type="number"
                value={formData.ratio}
                onChange={(e) => setFormData({ ...formData, ratio: Number.parseInt(e.target.value) || 0 })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="direct" className="text-gray-300">
                직접비 (천원)
              </Label>
              <Input
                id="direct"
                type="number"
                value={formData.direct}
                onChange={(e) => setFormData({ ...formData, direct: Number.parseInt(e.target.value) || 0 })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="indirect" className="text-gray-300">
                간접비 (천원)
              </Label>
              <Input
                id="indirect"
                type="number"
                value={formData.indirect}
                onChange={(e) => setFormData({ ...formData, indirect: Number.parseInt(e.target.value) || 0 })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="note" className="text-gray-300">
              비고
            </Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300"
            >
              취소
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              추가
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
