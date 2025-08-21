"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Download, Plus, Minus, RefreshCw } from "lucide-react"

interface DetailedBudgetCalculatorDialogProps {
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
  // 기본 사업비 계산기에서 설정한 비율들
  basicCalculatorRatios?: {
    governmentRatio: number
    privateCashRatio: number
    privateInkindRatio: number
  }
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

interface CategoryRatios {
  [key: string]: number;
}

export function DetailedBudgetCalculatorDialog({ open, onOpenChange, onApplyTemplate, project, consortiumData, basicCalculatorRatios }: DetailedBudgetCalculatorDialogProps) {
  const [totalBudget, setTotalBudget] = useState("700000")
  const [governmentRatio, setGovernmentRatio] = useState("70")
  const [privateCashRatio, setPrivateCashRatio] = useState("15")
  const [privateInkindRatio, setPrivateInkindRatio] = useState("15")
  const [projectDuration, setProjectDuration] = useState(12) // 기본 12개월
  const [yearlyDistribution, setYearlyDistribution] = useState("균등") // 분배 방식
  const [categoryRatios, setCategoryRatios] = useState<CategoryRatios>(DEFAULT_CATEGORY_RATIOS)
  const [yearlyCustomAmounts, setYearlyCustomAmounts] = useState<number[]>([]) // 사용자 정의 연차별 금액
  const [institutionRatios, setInstitutionRatios] = useState<string[]>([])
  const [institutionInputMode, setInstitutionInputMode] = useState<"ratio" | "direct">("ratio") // 비율 설정 또는 직접 입력
  const [institutionDirectAmounts, setInstitutionDirectAmounts] = useState<{ type: "government" | "total", amount: number }[]>([]) // 직접 입력 금액들
  const [activeYear, setActiveYear] = useState(1) // 현재 선택된 연차 (1~5)
  const [yearlyInstitutionRatios, setYearlyInstitutionRatios] = useState<Record<number, string[]>>({}) // 연차별 기관 비율
  const [yearlyInstitutionDirectAmounts, setYearlyInstitutionDirectAmounts] = useState<Record<number, { type: "government" | "total", amount: number }[]>>({}) // 연차별 직접 입력 금액들
  const [isApplying, setIsApplying] = useState(false)

  // 프로젝트 total_cost 자동 로드
  useEffect(() => {
    if (project?.total_cost && project.total_cost > 0) {
      setTotalBudget(project.total_cost.toString())
    }
  }, [project?.total_cost])

  // 기본 사업비 계산기에서 설정한 비율들을 적용
  useEffect(() => {
    if (basicCalculatorRatios) {
      setGovernmentRatio(basicCalculatorRatios.governmentRatio.toString())
      setPrivateCashRatio(basicCalculatorRatios.privateCashRatio.toString())
      setPrivateInkindRatio(basicCalculatorRatios.privateInkindRatio.toString())
    }
  }, [basicCalculatorRatios])

  // 컨소시엄 기관 정보 자동 로드
  useEffect(() => {
    if (consortiumData?.organizations && consortiumData.organizations.length > 0) {
      const organizations = consortiumData.organizations
      const defaultRatio = Math.round(100 / organizations.length)
      const ratios = organizations.map((_, index) => {
        if (index === organizations.length - 1) {
          return (100 - (defaultRatio * (organizations.length - 1))).toString()
        }
        return defaultRatio.toString()
      })
      setInstitutionRatios(ratios)
      
      // 연차별 데이터 초기화
      const years = Math.ceil(projectDuration / 12)
      const yearlyData: Record<number, any> = {}
      const yearlyDirectData: Record<number, any> = {}
      
      for (let year = 1; year <= years; year++) {
        yearlyData[year] = [...ratios]
        yearlyDirectData[year] = organizations.map(() => ({ type: "government" as const, amount: 0 }))
      }
      
      setYearlyInstitutionRatios(yearlyData)
      setYearlyInstitutionDirectAmounts(yearlyDirectData)
    }
  }, [consortiumData, projectDuration])

  // 연차별 사용자 정의 금액 초기화
  useEffect(() => {
    if (yearlyDistribution === "사용자정의") {
      const years = Math.ceil(projectDuration / 12)
      const totalBudgetValue = Number(totalBudget) || 0
      const govRatio = Number(governmentRatio) || 70
      const governmentBudget = Math.round((totalBudgetValue * govRatio) / 100)
      const equalAmount = Math.round(governmentBudget / years)
      const newAmounts = Array.from({ length: years }, (_, i) => 
        i === years - 1 ? governmentBudget - (equalAmount * (years - 1)) : equalAmount
      )
      setYearlyCustomAmounts(newAmounts)
    }
  }, [projectDuration, yearlyDistribution, totalBudget, governmentRatio])

  // 기본 계산 결과
  const calculateResults = () => {
    const total = Number(totalBudget)
    const govRatio = Number(governmentRatio) / 100
    const cashRatio = Number(privateCashRatio) / 100
    const inkindRatio = Number(privateInkindRatio) / 100

    return {
      totalBudget: total,
      government: Math.round(total * govRatio),
      privateCash: Math.round(total * cashRatio),
      privateInkind: Math.round(total * inkindRatio)
    }
  }

  // 연차별 예산 분배 계산
  const calculateYearlyBudgets = () => {
    const results = calculateResults()
    const years = Math.ceil(projectDuration / 12)
    
    if (yearlyDistribution === "균등") {
      const yearlyAmount = Math.round(results.totalBudget / years)
      const remainder = results.totalBudget - (yearlyAmount * years)
      
      return Array.from({ length: years }, (_, i) => {
        const amount = i === years - 1 ? yearlyAmount + remainder : yearlyAmount
        return {
          year: i + 1,
          amount,
          government: Math.round((amount * Number(governmentRatio)) / 100),
          privateCash: Math.round((amount * Number(privateCashRatio)) / 100),
          privateInkind: Math.round((amount * Number(privateInkindRatio)) / 100),
        }
      })
    } else if (yearlyDistribution === "사용자정의") {
      return Array.from({ length: years }, (_, i) => {
        const governmentAmount = yearlyCustomAmounts[i] || 0
        
        // 기본 사업비 계산기의 비율을 사용하여 계산
        // 총 연구개발비 = 정부지원예산 ÷ 정부지원예산 비율
        const totalAmount = Math.round((governmentAmount * 100) / Number(governmentRatio))
        
        // 민간 현금 = 총 연구개발비 × 민간 현금 비율
        const privateCashAmount = Math.round((totalAmount * Number(privateCashRatio)) / 100)
        
        // 민간 현물 = 총 연구개발비 × 민간 현물 비율
        const privateInkindAmount = Math.round((totalAmount * Number(privateInkindRatio)) / 100)
        
        return {
          year: i + 1,
          amount: totalAmount, // 총 연구개발비
          government: governmentAmount, // 사용자가 입력한 정부지원예산
          privateCash: privateCashAmount, // 계산된 민간 현금
          privateInkind: privateInkindAmount, // 계산된 민간 현물
        }
      })
    }
    
    return []
  }

  // 카테고리별 예산 계산
  const calculateCategoryBudgets = () => {
    // 정부지원예산을 총 연구개발비로 변환
    const totalBudgetValue = Number(totalBudget) || 0  // 정부지원예산
    const govRatio = Number(governmentRatio) || 70
    const totalRD = Math.round((totalBudgetValue * 100) / govRatio)  // 총 연구개발비
    
    const categoryBudgets: Record<string, CategoryBudget> = {}
    
    Object.entries(categoryRatios).forEach(([category, ratio]) => {
      // 카테고리별 총 연구개발비
      const amount = Math.round((totalRD * ratio) / 100)
      
      // 카테고리별 정부지원예산 = 카테고리별 총 연구개발비 × 정부지원예산 비율
      const governmentAmount = Math.round((amount * govRatio) / 100)
      
      // 카테고리별 민간 현금 = 카테고리별 총 연구개발비 × 민간 현금 비율
      const privateCashAmount = Math.round((amount * Number(privateCashRatio)) / 100)
      
      // 카테고리별 민간 현물 = 카테고리별 총 연구개발비 × 민간 현물 비율
      const privateInkindAmount = Math.round((amount * Number(privateInkindRatio)) / 100)
      
      categoryBudgets[category] = {
        amount, // 총 연구개발비
        government: governmentAmount, // 계산된 정부지원예산
        privateCash: privateCashAmount, // 계산된 민간 현금
        privateInkind: privateInkindAmount, // 계산된 민간 현물
      }
    })
    
    return categoryBudgets
  }

  // 기관별 예산 배분 계산 (연차별)
  const calculateInstitutionBudgets = (year: number = activeYear) => {
    if (!consortiumData?.organizations) return []
    
    const organizations = consortiumData.organizations
    const budgets: any[] = []
    const govRatio = Number(governmentRatio) || 70
    
    if (institutionInputMode === "ratio") {
      // 비율 설정 모드: 기존 로직
      const totalBudgetValue = Number(totalBudget) || 0  // 정부지원예산
      const totalRD = Math.round((totalBudgetValue * 100) / govRatio)  // 총 연구개발비
      
      organizations.forEach((org, index) => {
        const ratio = Number(yearlyInstitutionRatios[year]?.[index] || institutionRatios[index] || 0)
        
        // 기관별 총 연구개발비 = 총 연구개발비 × 기관별 배분 비율
        const instBudget = Math.round((totalRD * ratio) / 100)
        
        // 기관별 정부지원예산 = 기관별 총 연구개발비 × 정부지원예산 비율
        const governmentAmount = Math.round((instBudget * govRatio) / 100)
        
        // 기관별 민간 현금 = 기관별 총 연구개발비 × 민간 현금 비율
        const privateCashAmount = Math.round((instBudget * Number(privateCashRatio)) / 100)
        
        // 기관별 민간 현물 = 기관별 총 연구개발비 × 민간 현물 비율
        const privateInkindAmount = Math.round((instBudget * Number(privateInkindRatio)) / 100)
        
        budgets[index] = {
          total: instBudget, // 총 연구개발비
          government: governmentAmount, // 계산된 정부지원예산
          privateCash: privateCashAmount, // 계산된 민간 현금
          privateInkind: privateInkindAmount, // 계산된 민간 현물
        }
      })
    } else {
      // 직접 입력 모드: 사용자가 입력한 금액을 기준으로 계산
      organizations.forEach((org, index) => {
        const directInput = yearlyInstitutionDirectAmounts[year]?.[index] || institutionDirectAmounts[index]
        
        if (directInput && directInput.amount > 0) {
          let instBudget: number
          let governmentAmount: number
          
          if (directInput.type === "government") {
            // 정부지원예산 입력 시
            governmentAmount = directInput.amount
            instBudget = Math.round((governmentAmount * 100) / govRatio) // 총 연구개발비 계산
          } else {
            // 총 연구개발비 입력 시
            instBudget = directInput.amount
            governmentAmount = Math.round((instBudget * govRatio) / 100) // 정부지원예산 계산
          }
          
          // 민간 현금과 현물 계산
          const privateCashAmount = Math.round((instBudget * Number(privateCashRatio)) / 100)
          const privateInkindAmount = Math.round((instBudget * Number(privateInkindRatio)) / 100)
          
          budgets[index] = {
            total: instBudget,
            government: governmentAmount,
            privateCash: privateCashAmount,
            privateInkind: privateInkindAmount,
          }
        } else {
          budgets[index] = {
            total: 0,
            government: 0,
            privateCash: 0,
            privateInkind: 0,
          }
        }
      })
    }
    
    return budgets
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
    const newRatios: CategoryRatios = {}
    
    Object.keys(categoryRatios).forEach((category, index) => {
      if (index === categoryCount - 1) {
        newRatios[category] = 100 - (equalRatio * (categoryCount - 1))
      } else {
        newRatios[category] = equalRatio
      }
    })
    
    setCategoryRatios(newRatios)
  }

  // 연차별 사용자 정의 금액 변경
  const handleYearlyCustomAmountChange = (yearIndex: number, value: number) => {
    const newAmounts = [...yearlyCustomAmounts]
    newAmounts[yearIndex] = value
    setYearlyCustomAmounts(newAmounts)
  }

  // 연차별 사용자 정의 금액 균등 분배
  const handleEqualYearlyAmountDistribution = () => {
    const years = Math.ceil(projectDuration / 12)
    const totalBudgetValue = Number(totalBudget) || 0
    const govRatio = Number(governmentRatio) || 70
    const governmentBudget = Math.round((totalBudgetValue * govRatio) / 100)
    const equalAmount = Math.round(governmentBudget / years)
    const newAmounts = Array.from({ length: years }, (_, i) => 
      i === years - 1 ? governmentBudget - (equalAmount * (years - 1)) : equalAmount
    )
    setYearlyCustomAmounts(newAmounts)
  }

  // 연차별 사용자 정의 금액 합계 검증
  const validateYearlyCustomAmounts = () => {
    const totalBudgetValue = Number(totalBudget) || 0  // 이미 정부지원예산
    const totalCustomAmount = yearlyCustomAmounts.reduce((sum, amount) => sum + amount, 0)
    return {
      isValid: totalCustomAmount === totalBudgetValue,
      total: totalCustomAmount,
      target: totalBudgetValue,
      difference: totalCustomAmount - totalBudgetValue
    }
  }

  // 기관별 배분 합계 계산
  const calculateInstitutionDistributionSum = () => {
    return institutionRatios.reduce((sum, ratio) => sum + Number(ratio || "0"), 0)
  }

  // 기관별 균등 배분
  const handleEqualInstitutionDistribution = () => {
    if (!consortiumData?.organizations) return
    
    const organizations = consortiumData.organizations
    const defaultRatio = Math.round(100 / organizations.length)
    const ratios = organizations.map((_, index) => {
      if (index === organizations.length - 1) {
        return (100 - (defaultRatio * (organizations.length - 1))).toString()
      }
      return defaultRatio.toString()
    })
    setInstitutionRatios(ratios)
  }

  const results = calculateResults()
  const yearlyBudgets = calculateYearlyBudgets()
  const categoryBudgets = calculateCategoryBudgets()
  const institutionBudgets = calculateInstitutionBudgets()

  // 예산 템플릿 적용
  const handleApplyTemplate = async () => {
    setIsApplying(true)
    try {
      const budgetData = {
        results,
        totalBudget: Number(totalBudget),
        governmentRatio: Number(governmentRatio),
        privateCashRatio: Number(privateCashRatio),
        privateInkindRatio: Number(privateInkindRatio),
        yearlyDistribution,
        yearlyBudgets,
        categoryBudgets,
        categoryRatios,
        institutionNames: consortiumData?.organizations?.map(org => org.name) || [],
        institutionRatios,
        projectDuration
      }
      
      await onApplyTemplate(budgetData)
      onOpenChange(false)
    } catch (error) {
      console.error('상세 예산 템플릿 적용 오류:', error)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Calculator className="w-5 h-5" />
            상세 사업비 계산기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 연차별 예산분배 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">연차별 예산분배</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>정부지원예산 (천원)</Label>
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="정부지원예산을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label>프로젝트 기간 (개월)</Label>
                  <Select value={projectDuration.toString()} onValueChange={(value) => setProjectDuration(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}개월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>분배 방식</Label>
                  <Select value={yearlyDistribution} onValueChange={setYearlyDistribution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="균등">균등 분배</SelectItem>
                      <SelectItem value="사용자정의">사용자 정의</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 사용자 정의 분배 입력 */}
              {yearlyDistribution === "사용자정의" && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">연차별 정부지원예산 설정</h4>
                    <Button variant="outline" size="sm" onClick={handleEqualYearlyAmountDistribution}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      균등 분배
                    </Button>
                  </div>
                  
                  {/* 실시간 합계 검증 표시 */}
                  {(() => {
                    const validation = validateYearlyCustomAmounts()
                    return (
                      <div className={`mb-3 p-2 rounded text-sm ${
                        validation.isValid 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span>
                            연차별 금액 합계: <strong>{validation.total.toLocaleString()}천원</strong>
                          </span>
                          <span>
                            {validation.isValid ? (
                              <span className="text-green-600">✓ 정확함</span>
                            ) : (
                              <span className="text-red-600">
                                ✗ 차이: {validation.difference > 0 ? '+' : ''}{validation.difference.toLocaleString()}천원
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Array.from({ length: Math.ceil(projectDuration / 12) }, (_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-600 whitespace-nowrap">{i + 1}년차:</Label>
                          <Input
                            type="number"
                            value={yearlyCustomAmounts[i] || ""}
                            onChange={(e) => handleYearlyCustomAmountChange(i, Number(e.target.value))}
                            className="w-24 text-center"
                            placeholder="금액"
                            min="0"
                          />
                          <span className="text-sm text-gray-500">천원</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 연차별 예산 분배 결과 */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-700">연차</th>
                      <th className="text-left py-2 text-gray-700">정부지원예산</th>
                      <th className="text-left py-2 text-gray-700">민간 현금</th>
                      <th className="text-left py-2 text-gray-700">민간 현물</th>
                      <th className="text-left py-2 text-gray-700">총 연구개발비</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyBudgets.map((year) => (
                      <tr key={year.year} className="border-b border-gray-100">
                        <td className="py-2 text-gray-900">{year.year}년차</td>
                        <td className="py-2 text-gray-900">
                          {year.government.toLocaleString()}천원
                        </td>
                        <td className="py-2 text-gray-900">
                          {year.privateCash.toLocaleString()}천원
                        </td>
                        <td className="py-2 text-gray-900">
                          {year.privateInkind.toLocaleString()}천원
                        </td>
                        <td className="py-2 text-gray-900">
                          {year.amount.toLocaleString()}천원
                        </td>
                      </tr>
                    ))}
                    {/* 합계 행 */}
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                      <td className="py-3 text-gray-900">합계</td>
                      <td className="py-3 text-gray-900">
                        {yearlyBudgets.reduce((sum, year) => sum + year.government, 0).toLocaleString()}천원
                      </td>
                      <td className="py-3 text-gray-900">
                        {yearlyBudgets.reduce((sum, year) => sum + year.privateCash, 0).toLocaleString()}천원
                      </td>
                      <td className="py-3 text-gray-900">
                        {yearlyBudgets.reduce((sum, year) => sum + year.privateInkind, 0).toLocaleString()}천원
                      </td>
                      <td className="py-3 text-gray-900">
                        {yearlyBudgets.reduce((sum, year) => sum + year.amount, 0).toLocaleString()}천원
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리별 예산 계산 카드 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">카테고리별 예산 계산</CardTitle>
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

          {/* 기관별 예산 배분 설정 카드 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">기관별 예산 배분 설정</CardTitle>
                <div className="flex items-center gap-2">
                  {/* 입력 모드 토글 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">입력 모드:</span>
                    <div className="flex border border-gray-300 rounded-md">
                      <button
                        onClick={() => setInstitutionInputMode("ratio")}
                        className={`px-3 py-1 text-sm ${
                          institutionInputMode === "ratio"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        비율 설정
                      </button>
                      <button
                        onClick={() => setInstitutionInputMode("direct")}
                        className={`px-3 py-1 text-sm ${
                          institutionInputMode === "direct"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        직접 입력
                      </button>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleEqualInstitutionDistribution}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    균등 배분
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {consortiumData?.organizations && consortiumData.organizations.length > 0 ? (
                <div className="space-y-4">
                  {/* 연차별 탭 */}
                  <div className="border-b border-gray-200">
                    <div className="flex space-x-0 overflow-x-auto">
                      {Array.from({ length: Math.ceil(projectDuration / 12) }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setActiveYear(i + 1)}
                          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                            activeYear === i + 1
                              ? "border-blue-500 text-blue-600 bg-blue-50"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {i + 1}차년도
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      기관 배분 비율 합계: {calculateInstitutionDistributionSum()}%
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-700">기관명</th>
                          <th className="text-left py-2 text-gray-700">배분비율 (%)</th>
                          <th className="text-left py-2 text-gray-700">정부지원예산</th>
                          <th className="text-left py-2 text-gray-700">민간 현금</th>
                          <th className="text-left py-2 text-gray-700">민간 현물</th>
                          <th className="text-left py-2 text-gray-700">총 연구개발비</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consortiumData.organizations.map((org, index) => (
                          <tr key={org.id} className="border-b border-gray-100">
                            <td className="py-2 text-gray-900">
                              <div className="font-medium">{org.name}</div>
                              <div className="text-xs text-gray-500">{org.type}기관</div>
                            </td>
                            <td className="py-2 text-gray-600">
                              {institutionInputMode === "ratio" ? (
                                <Input
                                  className="w-20 text-center text-sm"
                                  type="number"
                                  value={yearlyInstitutionRatios[activeYear]?.[index] || institutionRatios[index] || ""}
                                  onChange={(e) => {
                                    const newRatios = [...(yearlyInstitutionRatios[activeYear] || institutionRatios)]
                                    newRatios[index] = e.target.value
                                    setYearlyInstitutionRatios({
                                      ...yearlyInstitutionRatios,
                                      [activeYear]: newRatios
                                    })
                                  }}
                                  placeholder="비율"
                                  min="0"
                                  max="100"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={yearlyInstitutionDirectAmounts[activeYear]?.[index]?.type || "government"}
                                    onValueChange={(value: "government" | "total") => {
                                      const newAmounts = [...(yearlyInstitutionDirectAmounts[activeYear] || institutionDirectAmounts)]
                                      newAmounts[index] = { 
                                        type: value, 
                                        amount: newAmounts[index]?.amount || 0 
                                      }
                                      setYearlyInstitutionDirectAmounts({
                                        ...yearlyInstitutionDirectAmounts,
                                        [activeYear]: newAmounts
                                      })
                                    }}
                                  >
                                    <SelectTrigger className="w-28 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="government">정부지원예산</SelectItem>
                                      <SelectItem value="total">총 연구개발비</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    className="w-24 text-center text-sm"
                                    type="number"
                                    value={yearlyInstitutionDirectAmounts[activeYear]?.[index]?.amount || ""}
                                    onChange={(e) => {
                                      const newAmounts = [...(yearlyInstitutionDirectAmounts[activeYear] || institutionDirectAmounts)]
                                      newAmounts[index] = { 
                                        type: newAmounts[index]?.type || "government", 
                                        amount: Number(e.target.value) 
                                      }
                                      setYearlyInstitutionDirectAmounts({
                                        ...yearlyInstitutionDirectAmounts,
                                        [activeYear]: newAmounts
                                      })
                                    }}
                                    placeholder="금액"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="py-2 text-gray-900">
                              {calculateInstitutionBudgets(activeYear)[index]?.government.toLocaleString() || 0}천원
                            </td>
                            <td className="py-2 text-gray-900">
                              {calculateInstitutionBudgets(activeYear)[index]?.privateCash.toLocaleString() || 0}천원
                            </td>
                            <td className="py-2 text-gray-900">
                              {calculateInstitutionBudgets(activeYear)[index]?.privateInkind.toLocaleString() || 0}천원
                            </td>
                            <td className="py-2 text-gray-900">
                              {calculateInstitutionBudgets(activeYear)[index]?.total.toLocaleString() || 0}천원
                            </td>
                          </tr>
                        ))}
                        
                        {/* 합계 행 */}
                        <tr className="border-t-2 border-blue-300 bg-blue-100 font-semibold">
                          <td className="py-2 text-gray-900">합계</td>
                          <td className="py-2 text-gray-600">
                            {institutionInputMode === "ratio" ? (
                              `${calculateInstitutionDistributionSum()}%`
                            ) : (
                              "직접 입력"
                            )}
                          </td>
                          <td className="py-2 text-gray-900">
                            {calculateInstitutionBudgets(activeYear).reduce((sum, budget) => sum + (budget?.government || 0), 0).toLocaleString()}천원
                          </td>
                          <td className="py-2 text-gray-900">
                            {calculateInstitutionBudgets(activeYear).reduce((sum, budget) => sum + (budget?.privateCash || 0), 0).toLocaleString()}천원
                          </td>
                          <td className="py-2 text-gray-900">
                            {calculateInstitutionBudgets(activeYear).reduce((sum, budget) => sum + (budget?.privateInkind || 0), 0).toLocaleString()}천원
                          </td>
                          <td className="py-2 text-gray-900">
                            {calculateInstitutionBudgets(activeYear).reduce((sum, budget) => sum + (budget?.total || 0), 0).toLocaleString()}천원
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  컨소시엄 기관 정보가 없습니다.
                </div>
              )}
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
              <Download className="w-4 h-4 mr-2" />
            )}
            상세 예산 템플릿 적용
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
