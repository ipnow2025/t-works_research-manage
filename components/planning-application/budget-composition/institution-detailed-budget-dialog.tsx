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
  onSave: (budgetData: InstitutionBudgetData) => Promise<void>
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

// 카테고리별 자금 유형 제한 설정
const CATEGORY_FUNDING_RULES = {
  personnel: { cash: true, inkind: true },           // 인건비: 현금+현물
  studentPersonnel: { cash: true, inkind: true },    // 학생인건비: 현금+현물
  researchFacilities: { cash: true, inkind: false }, // 연구시설·장비비: 현금만
  researchMaterials: { cash: true, inkind: false },  // 연구재료비: 현금만
  contractedRD: { cash: true, inkind: true },        // 위탁연구개발비: 현금+현물
  internationalJointRD: { cash: true, inkind: true }, // 국제공동연구개발비: 현금+현물
  researchDevelopmentBurden: { cash: true, inkind: true }, // 연구개발부담비: 현금+현물
  researchActivities: { cash: true, inkind: false }, // 연구활동비: 현금만
  researchAllowance: { cash: true, inkind: true },   // 연구수당: 현금+현물
  indirectCosts: { cash: true, inkind: true },      // 간접비: 현금+현물
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

interface InstitutionBudgetData {
  categoryBudgets: InstitutionCategoryBudget;
  institutionCustomRatios?: {
    governmentRatio: number;
    privateCashRatio: number;
    privateInkindRatio: number;
  } | null;
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
  
  // 기관별 개별 비율 설정 상태 추가
  const [useCustomRatios, setUseCustomRatios] = useState(false)
  const [customGovernmentRatio, setCustomGovernmentRatio] = useState(governmentRatio)
  const [customPrivateCashRatio, setCustomPrivateCashRatio] = useState(privateCashRatio)
  const [customPrivateInkindRatio, setCustomPrivateInkindRatio] = useState(privateInkindRatio)

  // 카테고리별 예산 상태를 별도로 관리
  const [categoryBudgets, setCategoryBudgets] = useState<InstitutionCategoryBudget>({})

  // 기본 비율이 변경되면 커스텀 비율도 업데이트
  useEffect(() => {
    if (!useCustomRatios) {
      setCustomGovernmentRatio(governmentRatio)
      setCustomPrivateCashRatio(privateCashRatio)
      setCustomPrivateInkindRatio(privateInkindRatio)
    }
  }, [governmentRatio, privateCashRatio, privateInkindRatio, useCustomRatios])

  // 실제 사용할 비율 계산
  const actualGovernmentRatio = useCustomRatios ? customGovernmentRatio : governmentRatio
  const actualPrivateCashRatio = useCustomRatios ? customPrivateCashRatio : privateCashRatio
  const actualPrivateInkindRatio = useCustomRatios ? customPrivateInkindRatio : privateInkindRatio

  // 카테고리별 예산 계산
  const calculateCategoryBudgets = (): InstitutionCategoryBudget => {
    const calculatedBudgets: InstitutionCategoryBudget = {}
    
    // totalBudget이 이미 총 연구개발비이므로 직접 사용
    const totalResearchBudget = totalBudget
    
    Object.entries(categoryRatios).forEach(([category, ratio]) => {
      // 카테고리별 총 연구개발비
      const amount = Math.round((totalResearchBudget * ratio) / 100)
      
      // 카테고리별 정부지원예산
      const governmentAmount = Math.round((amount * actualGovernmentRatio) / 100)
      
      // 카테고리별 민간 예산 (정부지원 제외)
      const privateAmount = amount - governmentAmount
      
      // 민간 부담금 내에서의 현금과 현물 비율 적용
      const privateCashAmount = Math.round((privateAmount * actualPrivateCashRatio) / 100)
      const privateInkindAmount = privateAmount - privateCashAmount
      
      calculatedBudgets[category] = {
        amount,
        government: governmentAmount,
        privateCash: privateCashAmount,
        privateInkind: privateInkindAmount,
      }
    })
    
    return calculatedBudgets
  }

  // 카테고리 비율이 변경될 때마다 예산 재계산
  useEffect(() => {
    const newBudgets = calculateCategoryBudgets()
    setCategoryBudgets(newBudgets)
  }, [categoryRatios, totalBudget, actualGovernmentRatio, actualPrivateCashRatio])

  // 카테고리 비율 합계 계산
  const calculateCategoryRatioSum = () => {
    return Object.values(categoryRatios).reduce((sum, ratio) => sum + (ratio || 0), 0)
  }

  // 현금 변경 핸들러
  const handlePrivateCashChange = (category: string, newPrivateCash: number) => {
    const currentData = categoryBudgets[category]
    if (!currentData) return

    const fundingRules = CATEGORY_FUNDING_RULES[category as keyof typeof CATEGORY_FUNDING_RULES]
    
    // 민간 현금이 변경되면 민간 현물 자동 조정
    if (fundingRules.inkind) {
      const remainingPrivate = currentData.amount - newPrivateCash
      const newPrivateInkind = Math.max(0, remainingPrivate)
      
      // 현금과 현물의 합이 민간 예산을 초과하지 않도록 조정
      const adjustedPrivateCash = Math.min(newPrivateCash, currentData.amount)
      const adjustedPrivateInkind = currentData.amount - adjustedPrivateCash
      
      const updatedBudgets = { ...categoryBudgets }
      updatedBudgets[category] = {
        ...currentData,
        privateCash: adjustedPrivateCash,
        privateInkind: adjustedPrivateInkind
      }
      setCategoryBudgets(updatedBudgets)
      
      // 비율도 자동으로 재계산
      const newRatio = Math.round((currentData.amount / totalBudget) * 100)
      setCategoryRatios(prev => ({ ...prev, [category]: newRatio }))
    }
  }

  // 현물 변경 핸들러
  const handlePrivateInkindChange = (category: string, newPrivateInkind: number) => {
    const currentData = categoryBudgets[category]
    if (!currentData) return

    const fundingRules = CATEGORY_FUNDING_RULES[category as keyof typeof CATEGORY_FUNDING_RULES]
    
    // 민간 현물이 변경되면 민간 현금 자동 조정
    if (fundingRules.cash) {
      const remainingPrivate = currentData.amount - newPrivateInkind
      const newPrivateCash = Math.max(0, remainingPrivate)
      
      // 현물과 현금의 합이 민간 예산을 초과하지 않도록 조정
      const adjustedPrivateInkind = Math.min(newPrivateInkind, currentData.amount)
      const adjustedPrivateCash = currentData.amount - adjustedPrivateInkind
      
      const updatedBudgets = { ...categoryBudgets }
      updatedBudgets[category] = {
        ...currentData,
        privateCash: adjustedPrivateCash,
        privateInkind: adjustedPrivateInkind
      }
      setCategoryBudgets(updatedBudgets)
      
      // 비율도 자동으로 재계산
      const newRatio = Math.round((currentData.amount / totalBudget) * 100)
      setCategoryRatios(prev => ({ ...prev, [category]: newRatio }))
    }
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
    
    // 비율이 변경되면 해당 카테고리의 예산도 자동으로 재계산
    const newAmount = Math.round((totalBudget * limitedValue) / 100)
    const newGovernmentAmount = Math.round((newAmount * actualGovernmentRatio) / 100)
    const newPrivateAmount = newAmount - newGovernmentAmount
    const newPrivateCashAmount = Math.round((newPrivateAmount * actualPrivateCashRatio) / 100)
    const newPrivateInkindAmount = newPrivateAmount - newPrivateCashAmount
    
    const updatedBudgets = { ...categoryBudgets }
    updatedBudgets[category] = {
      amount: newAmount,
      government: newGovernmentAmount,
      privateCash: newPrivateCashAmount,
      privateInkind: newPrivateInkindAmount,
    }
    setCategoryBudgets(updatedBudgets)
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
    const totalCategoryBudget = Object.values(categoryBudgets).reduce((sum, data) => sum + data.amount, 0)
    
    if (totalCategoryBudget !== totalBudget) {
      alert(`카테고리별 예산 합계(${totalCategoryBudget.toLocaleString()}천원)가 총 연구개발비(${totalBudget.toLocaleString()}천원)와 일치하지 않습니다.`)
      return
    }

    if (useCustomRatios && (customPrivateCashRatio + customPrivateInkindRatio !== 100)) {
      alert("민간 부담금 내에서 현금과 현물 비율의 합계가 100%가 되어야 합니다.")
      return
    }

    setIsSaving(true)
    try {
      const budgetData: InstitutionBudgetData = {
        categoryBudgets: categoryBudgets,
        // 기관별 개별 비율 설정 정보 추가
        institutionCustomRatios: useCustomRatios ? {
          governmentRatio: customGovernmentRatio,
          privateCashRatio: customPrivateCashRatio,
          privateInkindRatio: customPrivateInkindRatio,
        } : null
      }
      await onSave(budgetData)
      onOpenChange(false)
    } catch (error) {
      console.error("저장 중 오류 발생:", error)
      alert("저장 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

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
          {/* 기관별 비율 설정 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">기관별 비율 설정</CardTitle>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useCustomRatios"
                    checked={useCustomRatios}
                    onChange={(e) => setUseCustomRatios(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="useCustomRatios" className="text-sm text-gray-700">
                    개별 비율 사용
                  </label>
                  {!useCustomRatios && (
                    <div className="text-sm text-gray-500">
                      (전체 비율 사용: {governmentRatio}% : {privateCashRatio}% : {privateInkindRatio}%)
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                이 기관에만 적용할 정부지원예산, 민간 현금, 민간 현물 비율을 설정할 수 있습니다.
              </p>
            </CardHeader>
            <CardContent>
              {useCustomRatios ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        정부지원예산 비율 (%)
                      </label>
                      <Input
                        type="number"
                        value={customGovernmentRatio}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          setCustomGovernmentRatio(value)
                          // 합계가 100%가 되도록 자동 조정
                          setCustomPrivateCashRatio(Math.min(customPrivateCashRatio, 100 - value))
                          setCustomPrivateInkindRatio(100 - value - Math.min(customPrivateCashRatio, 100 - value))
                        }}
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        민간 현금 부담금 비율 (민간 부담금 내 %)
                      </label>
                      <Input
                        type="number"
                        value={customPrivateCashRatio}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          setCustomPrivateCashRatio(value)
                          // 민간 부담금 내에서 현물 비율 자동 조정
                          setCustomPrivateInkindRatio(100 - value)
                        }}
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        민간 현물 부담금 비율 (민간 부담금 내 %)
                      </label>
                      <Input
                        type="number"
                        value={customPrivateInkindRatio}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          setCustomPrivateInkindRatio(value)
                          // 민간 부담금 내에서 현금 비율 자동 조정
                          setCustomPrivateCashRatio(100 - value)
                        }}
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 mt-0.5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm text-blue-800">
                        <p>정부지원예산 비율을 먼저 설정하고, 나머지 민간 부담금에 대해 현금과 현물 비율을 설정합니다. (예: 정부지원 67%, 민간 부담금 33% 내에서 현금 10%, 현물 90%)</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-center text-gray-600">
                    <p className="font-medium">전체 비율 사용 중</p>
                    <p className="text-sm">정부지원예산 {governmentRatio}% : 민간 현금 {privateCashRatio}% : 민간 현물 {privateInkindRatio}%</p>
                    <p className="text-xs mt-1">개별 비율을 사용하려면 위의 체크박스를 선택하세요.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 예산 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">예산 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((totalBudget * actualGovernmentRatio) / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-800">정부지원예산 (천원)</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Object.values(categoryBudgets).reduce((sum, data) => sum + data.privateCash, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-yellow-800">현금 (천원)</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.values(categoryBudgets).reduce((sum, data) => sum + data.privateInkind, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-800">현물 (천원)</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalBudget.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-800">총 연구개발비 (천원)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리별 예산 설정 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">카테고리별 예산 설정</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <span className="text-gray-600">총 예산: </span>
                    <span className={`font-semibold ${Object.values(categoryBudgets).reduce((sum, data) => sum + data.amount, 0) === totalBudget ? 'text-green-600' : 'text-red-600'}`}>
                      {Object.values(categoryBudgets).reduce((sum, data) => sum + data.amount, 0).toLocaleString()}천원
                    </span>
                    {Object.values(categoryBudgets).reduce((sum, data) => sum + data.amount, 0) !== totalBudget && (
                      <span className="text-red-500 text-xs ml-2">(목표: {totalBudget.toLocaleString()}천원)</span>
                    )}
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
                      <th className="text-left py-2 text-gray-700">현금</th>
                      <th className="text-left py-2 text-gray-700">현물</th>
                      <th className="text-left py-2 text-gray-700">총 연구개발비</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoryBudgets).map(([category, data]) => {
                      const fundingRules = CATEGORY_FUNDING_RULES[category as keyof typeof CATEGORY_FUNDING_RULES]
                      
                      return (
                        <tr key={category} className="border-b border-gray-100">
                          <td className="py-2 text-gray-900">
                            <div>{CATEGORY_NAMES[category] || category}</div>
                            <div className="text-xs text-gray-500">
                              {fundingRules.cash && fundingRules.inkind ? '현금+현물' : 
                               fundingRules.cash ? '현금만' : '현물만'}
                            </div>
                          </td>
                          <td className="py-2 text-gray-600">
                            <Input
                              type="number"
                              value={categoryRatios[category] || 0}
                              onChange={(e) => {
                                const newRatio = Number(e.target.value)
                                handleCategoryRatioChange(category, newRatio)
                              }}
                              className="w-20 text-center"
                              placeholder="%"
                              min="0"
                              max="100"
                            />
                          </td>
                          <td className="py-2 text-gray-600">
                            <Input
                              type="number"
                              value={Math.round(data.privateCash)}
                              onChange={(e) => {
                                const newPrivateCash = Number(e.target.value)
                                handlePrivateCashChange(category, newPrivateCash)
                              }}
                              className="w-24 text-center"
                              placeholder="현금"
                              min="0"
                              max={data.amount}
                            />
                          </td>
                          <td className="py-2 text-gray-600">
                            <Input
                              type="number"
                              value={Math.round(data.privateInkind)}
                              onChange={(e) => {
                                const newPrivateInkind = Number(e.target.value)
                                handlePrivateInkindChange(category, newPrivateInkind)
                              }}
                              className="w-24 text-center"
                              placeholder="현물"
                              min="0"
                              max={data.amount}
                            />
                          </td>
                          <td className="py-2 text-gray-600">
                            <div className="w-24 text-center text-gray-900">
                              {data.amount.toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {/* 합계 행 */}
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                      <td className="py-2 text-gray-900">합계</td>
                      <td className="py-2 text-gray-900">
                        {Object.values(categoryRatios).reduce((sum, ratio) => sum + (ratio || 0), 0)}%
                      </td>
                      <td className="py-2 text-gray-900">
                        {Object.values(categoryBudgets).reduce((sum, data) => sum + data.privateCash, 0).toLocaleString()}천원
                      </td>
                      <td className="py-2 text-gray-900">
                        {Object.values(categoryBudgets).reduce((sum, data) => sum + data.privateInkind, 0).toLocaleString()}천원
                      </td>
                      <td className="py-2 text-gray-600">
                        <span className={`${Object.values(categoryBudgets).reduce((sum, data) => sum + data.amount, 0) === totalBudget ? 'text-green-600' : 'text-red-600'}`}>
                          {Object.values(categoryBudgets).reduce((sum, data) => sum + data.amount, 0).toLocaleString()}천원
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
            disabled={isSaving || Object.values(categoryBudgets).reduce((sum, data) => sum + data.amount, 0) !== totalBudget}
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
