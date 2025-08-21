"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Save } from "lucide-react"

interface BudgetCalculatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyTemplate: (budgetData: any) => Promise<void>
  project?: any
  consortiumData?: {
    projectType: "single" | "multi"
    projectDuration: number
    organizations: Array<{
      id: string
      name: string
      type: string
      members: Array<any>
    }>
    yearlyOrganizations?: Record<number, any>
  }
}

export function BudgetCalculatorDialog({ open, onOpenChange, onApplyTemplate, project, consortiumData }: BudgetCalculatorDialogProps) {
  const [totalBudget, setTotalBudget] = useState("700000")
  const [governmentRatio, setGovernmentRatio] = useState("70")
  const [privateCashRatio, setPrivateCashRatio] = useState("15")
  const [privateInkindRatio, setPrivateInkindRatio] = useState("15")
  const [isApplying, setIsApplying] = useState(false)

  // 프로젝트 total_cost 자동 로드 (정부지원예산으로 설정)
  useEffect(() => {
    if (project?.total_cost && project.total_cost > 0) {
      setTotalBudget(project.total_cost.toString())
    }
  }, [project?.total_cost])

  // 기본 계산 결과 - 정부지원예산을 기준으로 총 연구개발비 계산
  const calculateResults = () => {
    const governmentBudget = Number(totalBudget) // 정부지원예산
    const govRatio = Number(governmentRatio) / 100
    
    // 총 연구개발비 = 정부지원예산 / 정부지원예산 비율
    const totalRD = Math.round(governmentBudget / govRatio)
    
    // 민간 현금과 현물 계산
    const privateCash = Math.round(totalRD * (Number(privateCashRatio) / 100))
    const privateInkind = Math.round(totalRD * (Number(privateInkindRatio) / 100))

    return {
      totalRD: totalRD,
      government: governmentBudget,
      privateCash: privateCash,
      privateInkind: privateInkind
    }
  }

  const results = calculateResults()

  // 예산 템플릿 적용 및 자동 저장
  const handleApplyTemplate = async () => {
    setIsApplying(true)
    try {
      // 입력값들을 자동으로 저장
      const budgetData = {
        results,
        totalBudget: Number(totalBudget),
        governmentRatio: Number(governmentRatio),
        privateCashRatio: Number(privateCashRatio),
        privateInkindRatio: Number(privateInkindRatio),
        // 기본값들
        yearlyDistribution: "균등",
        yearlyBudgets: [{ amount: results.totalRD }],
        categoryBudgets: {},
        categoryRatios: {},
        institutionNames: [],
        institutionRatios: []
      }
      
      // 로컬 스토리지에 자동 저장
      if (project?.id) {
        const saveData = {
        totalBudget,
        governmentRatio,
        privateCashRatio,
        privateInkindRatio,
        timestamp: Date.now()
      }
        localStorage.setItem(`basic_budget_calculator_${project.id}`, JSON.stringify(saveData))
      }
      
      await onApplyTemplate(budgetData)
      onOpenChange(false)
    } catch (error) {
      console.error('예산 템플릿 적용 오류:', error)
    } finally {
      setIsApplying(false)
    }
  }

  // 저장된 데이터 로드
  useEffect(() => {
    if (project?.id) {
      const savedData = localStorage.getItem(`basic_budget_calculator_${project.id}`)
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          if (parsed.totalBudget) setTotalBudget(parsed.totalBudget)
          if (parsed.governmentRatio) setGovernmentRatio(parsed.governmentRatio)
          if (parsed.privateCashRatio) setPrivateCashRatio(parsed.privateCashRatio)
          if (parsed.privateInkindRatio) setPrivateInkindRatio(parsed.privateInkindRatio)
        } catch (error) {
          console.error('저장된 데이터 로드 오류:', error)
        }
      }
    }
  }, [project?.id])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Calculator className="w-5 h-5" />
            기본 사업비 계산기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 설정 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">기본 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalBudget">정부지원예산 (천원)</Label>
                  <Input
                    id="totalBudget"
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="정부지원예산을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label>정부지원예산 비율 (%)</Label>
                    <Input
                    type="number"
                      value={governmentRatio}
                      onChange={(e) => setGovernmentRatio(e.target.value)}
                    placeholder="70"
                    />
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>민간 현금 비율 (%)</Label>
                    <Input
                    type="number"
                      value={privateCashRatio}
                      onChange={(e) => setPrivateCashRatio(e.target.value)}
                    placeholder="15"
                    />
                  </div>
                <div className="space-y-2">
                  <Label>민간 현물 비율 (%)</Label>
                    <Input
                    type="number"
                      value={privateInkindRatio}
                      onChange={(e) => setPrivateInkindRatio(e.target.value)}
                    placeholder="15"
                    />
                  </div>
                </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  • 비율의 합이 100%가 되도록 입력해주세요
                </p>
                <p className="text-sm text-gray-600">
                  • 현재 비율 합계: {Number(governmentRatio) + Number(privateCashRatio) + Number(privateInkindRatio)}%
                </p>
                    </div>
                  </CardContent>
                </Card>

          {/* 계산 결과 카드 */}
                <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-900">계산 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-green-600 text-sm mb-1">정부지원예산</div>
                  <div className="text-green-700 text-xl font-bold">
                    {results.government.toLocaleString()}천원
                     </div>
                   </div>
                <div className="text-center">
                  <div className="text-orange-600 text-sm mb-1">민간 현금</div>
                  <div className="text-orange-700 text-xl font-bold">
                    {results.privateCash.toLocaleString()}천원
               </div>
                         </div>
                <div className="text-center">
                  <div className="text-purple-600 text-sm mb-1">민간 현물</div>
                  <div className="text-purple-700 text-xl font-bold">
                    {results.privateInkind.toLocaleString()}천원
                           </div>
                       </div>
                <div className="text-center">
                    <div className="text-blue-600 text-sm mb-1">총 연구개발비</div>
                  <div className="text-blue-700 text-xl font-bold">
                    {results.totalRD.toLocaleString()}천원
                    </div>
              </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white" 
            onClick={handleApplyTemplate} 
            disabled={isApplying}
          >
            {isApplying ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            사용하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
