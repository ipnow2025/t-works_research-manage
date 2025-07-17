"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"

interface KPIGoalSettingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KPIGoalSettingDialog({ open, onOpenChange }: KPIGoalSettingDialogProps) {
  const [showKPITypeDialog, setShowKPITypeDialog] = useState(false)
  const [kpiTypes, setKpiTypes] = useState([
    { id: 1, name: "기술 이전", description: "국제 학회 조직" },
    { id: 2, name: "특허 수", description: "SCI급 논문 학술" },
    { id: 3, name: "학회 발표", description: "국제 학회 조직" },
  ])

  const [newKpiType, setNewKpiType] = useState({
    name: "",
    description: "",
    unit: "",
  })

  const handleAddKpiType = () => {
    if (newKpiType.name && newKpiType.description) {
      setKpiTypes([
        ...kpiTypes,
        {
          id: Date.now(),
          name: newKpiType.name,
          description: newKpiType.description,
        },
      ])
      setNewKpiType({ name: "", description: "", unit: "" })
      setShowKPITypeDialog(false)
    }
  }

  const handleDeleteKpiType = (id: number) => {
    setKpiTypes(kpiTypes.filter((kpi) => kpi.id !== id))
  }

  return (
    <>
      {/* 메인 KPI 목표 설정 다이얼로그 */}
      <Dialog open={open && !showKPITypeDialog} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">목표 설정</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 기존 KPI 유형 섹션 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium">기존 목표 유형</h3>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />새 목표 추가
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowKPITypeDialog(true)}>
                    <Plus className="h-4 w-4" />
                    목표 유형 관리
                  </Button>
                </div>
              </div>

              {/* KPI 유형 테이블 */}
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
                  <div className="col-span-3">목표 유형</div>
                  <div className="col-span-7">설명</div>
                  <div className="col-span-2 text-center">관리</div>
                </div>

                {kpiTypes.map((kpi) => (
                  <div key={kpi.id} className="grid grid-cols-12 gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="col-span-3 text-sm font-medium">{kpi.name}</div>
                    <div className="col-span-7 text-sm text-gray-600">{kpi.description}</div>
                    <div className="col-span-2 flex justify-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteKpiType(kpi.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {kpiTypes.length === 0 && (
                  <div className="p-8 text-center text-gray-500">등록된 목표 유형이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KPI 유형 관리 다이얼로그 */}
      <Dialog open={showKPITypeDialog} onOpenChange={setShowKPITypeDialog}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">목표 유형 관리</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 기존 KPI 유형 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium">기존 목표 유형</h3>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />새 목표 추가
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    목표 유형 관리
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
                  <div className="col-span-4">목표 유형</div>
                  <div className="col-span-6">설명</div>
                  <div className="col-span-2 text-center">관리</div>
                </div>

                {kpiTypes.map((kpi) => (
                  <div key={kpi.id} className="grid grid-cols-12 gap-2 p-3 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="col-span-4 text-sm font-medium">{kpi.name}</div>
                    <div className="col-span-6 text-sm text-gray-600">{kpi.description}</div>
                    <div className="col-span-2 flex justify-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteKpiType(kpi.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 새 KPI 유형 추가 */}
            <div>
              <h3 className="text-base font-medium mb-4">새 목표 유형 추가</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="kpi-name" className="text-sm font-medium">
                    목표 유형 이름
                  </Label>
                  <Input
                    id="kpi-name"
                    placeholder="예: 논문 수"
                    value={newKpiType.name}
                    onChange={(e) => setNewKpiType({ ...newKpiType, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="kpi-description" className="text-sm font-medium">
                    설명
                  </Label>
                  <Input
                    id="kpi-description"
                    placeholder="예: 학술 논문 발표 건수"
                    value={newKpiType.description}
                    onChange={(e) => setNewKpiType({ ...newKpiType, description: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="kpi-unit" className="text-sm font-medium">
                    단위
                  </Label>
                  <Input
                    id="kpi-unit"
                    placeholder="예: 편"
                    value={newKpiType.unit}
                    onChange={(e) => setNewKpiType({ ...newKpiType, unit: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleAddKpiType} disabled={!newKpiType.name || !newKpiType.description}>
                    추가
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
