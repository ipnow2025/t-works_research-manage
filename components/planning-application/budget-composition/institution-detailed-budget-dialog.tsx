"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, Save, X } from "lucide-react"

interface InstitutionDetailedBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  institution: {
    id: string
    name: string
    type: string
  }
  totalBudget: number // 해당 기관의 총 예산
  governmentRatio: number // 정부지원예산 비율
  privateCashRatio: number // 민간 현금 비율
  privateInkindRatio: number // 민간 현물 비율
  onSave: (budgetData: InstitutionCategoryBudget) => Promise<void>
}

// 예산 카테고리별 기본 비율
const DEFAULT_CATEGORY_RATIOS = {
  personnel: 20, // 인건비
  studentPersonnel: 12, // 학생인건비
  researchFacilities: 18, // 연구시설·장비비
  researchMaterials: 15, // 연구재료비
  contractedRD: 8, // 위탁연구개발비
  internationalJointRD: 6, // 국제공동연구개발비
  researchDevelopmentBurden: 5, // 연구개발부담비
  researchActivities: 10, // 연구활동비
  researchAllowance: 3, // 연구수당
  indirectCosts: 3, // 간접비
}

// 카테고리 이름 매핑
const CATEGORY_NAMES: Record<string, string> = {
  personnel: "인건비",
  studentPersonnel: "학생인건비",
  researchFacilities: "연구시설·장비비",
  researchMaterials: "연구재료비",
  contractedRD: "위탁연구개발비",
  internationalJointRD: "국제공동연구개발비",
  researchDevelopmentBurden: "연구개발부담비",
  researchActivities: "연구활동비",
  researchAllowance: "연구수당",
  indirectCosts: "간접비",
}

interface CategoryBudget {
  amount: number;
  government: number;
  privateCash: number;
  privateInkind: number;
}

interface InstitutionCategoryBudget {
  [category: string]: CategoryBudget;
}

export function InstitutionDetailedBudgetDialog({ 
  open, 
  onOpenChange, 
  institution, 
  totalBudget, 
  governmentRatio, 
  privateCashRatio, 
  privateInkindRatio,
  onSave 
}: InstitutionDetailedBudgetDialogProps) {
  const [categoryRatios, setCategoryRatios] = useState<Record<string, number>>(DEFAULT_CATEGORY_RATIOS)
  const [isSaving, setIsSaving] = useState(false)

  // 카테고리별 예산 계산
  const calculateCategoryBudgets = (): InstitutionCategoryBudget => {
    const categoryBudgets: InstitutionCategoryBudget = {}
    
    Object.entries(categoryRatios).forEach(([category, ratio]) => {
      // 카테고리별 총 연구개발비
      const amount = Math.round((totalBudget * ratio) / 100)
      
      // 카테고리별 정부지원예산
      const governmentAmount = Math.round((amount * governmentRatio) / 100)
      
      // 카테고리별 민간 현금
      const privateCashAmount = Math.round((amount * privateCashRatio) / 100)
      
      // 카테고리별 민간 현물
      const privateInkindAmount = Math.round((amount * privateInkindRatio) / 100)
      
      categoryBudgets[category] = {
        amount,
        government: governmentAmount,
        privateCash: privateCashAmount,
        privateInkind: privateInkindAmount,
      }
    })
    
    return categoryBudgets
  }

  // 카테고리 비율 합계 계산
  const calculateCategoryRatioSum = () => {
    return Object.values(categoryRatios).reduce((sum, ratio) => sum + (ratio || 0), 0)
  }

  // 카테고리 비율 변경 핸들러
  const handleCategoryRatioChange = (category: string, value: number) => {
    // 현재 카테고리를 제외한 다른 카테고리들의 비율 합계 계산
    const otherCategoriesSum = Object.entries(categoryRatios)
      .filter(([cat]) => cat !== category)
      .reduce((sum, [, ratio]) => sum + (ratio || 0), 0)
    
    // 새로운 비율이 100%를 넘지 않도록 제한
    const maxAllowedValue = Math.max(0, 100 - otherCategoriesSum)
    const limitedValue = Math.min(value, maxAllowedValue)
    
    const newRatios = { ...categoryRatios, [category]: limitedValue }
    setCategoryRatios(newRatios)
  }

  // 카테고리 비율 균등 분배
  const handleEqualCategoryDistribution = () => {
    const categoryCount = Object.keys(categoryRatios).length
    const equalRatio = Math.round(100 / categoryCount)
    const newRatios: Record<string, number> = {}
    
    Object.keys(categoryRatios).forEach((category, index) => {
      if (index === categoryCount - 1) {
        newRatios[category] = 100 - (equalRatio * (categoryCount - 1))
      } else {
        newRatios[category] = equalRatio
      }
    })
    
    setCategoryRatios(newRatios)
  }

  // 저장 핸들러
  const handleSave = async () => {
    if (calculateCategoryRatioSum() !== 100) {
      alert("카테고리 비율의 합계가 100%가 되어야 합니다.")
      return
    }

    setIsSaving(true)
    try {
      const budgetData = calculateCategoryBudgets()
      await onSave(budgetData)
      onOpenChange(false)
    } catch (error) {
      console.error("저장 중 오류 발생:", error)
      alert("저장 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const categoryBudgets = calculateCategoryBudgets()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {institution.name} 상세 사업비 계산기
          </DialogTitle>
          <div className="text-sm text-gray-600">
            {institution.type}기관 - 총 예산: {totalBudget.toLocaleString()}천원
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 카테고리별 예산 설정 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">카테고리별 예산 설정</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <span className="text-gray-600">비율 합계: </span>
                    <span className={`font-semibold ${calculateCategoryRatioSum() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateCategoryRatioSum()}%
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleEqualCategoryDistribution}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    균등 분배
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-700">카테고리</th>
                      <th className="text-left py-2 text-gray-700">비율 (%)</th>
                      <th className="text-left py-2 text-gray-700">정부지원예산</th>
                      <th className="text-left py-2 text-gray-700">민간 현금</th>
                      <th className="text-left py-2 text-gray-700">민간 현물</th>
                      <th className="text-left py-2 text-gray-700">총 연구개발비</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoryBudgets).map(([category, data]) => (
                      <tr key={category} className="border-b border-gray-100">
                        <td className="py-2 text-gray-900">{CATEGORY_NAMES[category] || category}</td>
                        <td className="py-2 text-gray-600">
                          <Input
                            type="number"
                            value={categoryRatios[category] || ""}
                            onChange={(e) => handleCategoryRatioChange(category, Number(e.target.value))}
                            className="w-16 text-center"
                            placeholder="비율"
                            min="0"
                            max="100"
                          />
                        </td>
                        <td className="py-2 text-gray-900">
                          {data.government.toLocaleString()}천원
                        </td>
                        <td className="py-2 text-gray-900">
                          {data.privateCash.toLocaleString()}천원
                        </td>
                        <td className="py-2 text-gray-900">
                          {data.privateInkind.toLocaleString()}천원
                        </td>
                        <td className="py-2 text-gray-900">
                          {data.amount.toLocaleString()}천원
                        </td>
                      </tr>
                    ))}
                    {/* 합계 행 */}
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                      <td className="py-2 text-gray-900">합계</td>
                      <td className="py-2 text-gray-600">
                        <span className={`${calculateCategoryRatioSum() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                          {calculateCategoryRatioSum()}%
                        </span>
                      </td>
                      <td className="py-2 text-gray-900">
                        {Object.values(categoryBudgets).reduce((sum, data) => sum + data.government, 0).toLocaleString()}천원
                      </td>
                      <td className="py-2 text-gray-900">
                        {Object.values(categoryBudgets).reduce((sum, data) => sum + data.privateCash, 0).toLocaleString()}천원
                      </td>
                      <td className="py-2 text-gray-900">
                        {Object.values(categoryBudgets).reduce((sum, data) => sum + data.privateInkind, 0).toLocaleString()}천원
                      </td>
                      <td className="py-2 text-gray-900">
                        {Object.values(categoryBudgets).reduce((sum, data) => sum + data.amount, 0).toLocaleString()}천원
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 예산 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">예산 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalBudget.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-800">총 연구개발비 (천원)</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((totalBudget * governmentRatio) / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-800">정부지원예산 (천원)</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Math.round((totalBudget * privateCashRatio) / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-yellow-800">민간 현금 (천원)</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((totalBudget * privateInkindRatio) / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-800">민간 현물 (천원)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            취소
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleSave} 
            disabled={isSaving || calculateCategoryRatioSum() !== 100}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
