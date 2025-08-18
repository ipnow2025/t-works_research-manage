"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Calculator, Save, Download } from "lucide-react"
import { apiFetch } from "@/lib/func"

interface BudgetCalculatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyTemplate: (budgetData: any) => void
  project?: any
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

export function BudgetCalculatorDialog({ open, onOpenChange, onApplyTemplate, project }: BudgetCalculatorDialogProps) {
  const [unit, setUnit] = useState("천원")
  const [totalBudget, setTotalBudget] = useState("1000000")
  const [governmentRatio, setGovernmentRatio] = useState("70")
  const [privateCashRatio, setPrivateCashRatio] = useState("15")
  const [privateInkindRatio, setPrivateInkindRatio] = useState("15")
  const [distributionMethod, setDistributionMethod] = useState("비율")
  const [institution1Ratio, setInstitution1Ratio] = useState("60")
  const [institution2Ratio, setInstitution2Ratio] = useState("40")
  const [institution1Amount, setInstitution1Amount] = useState("600000") // 금액 방식용
  const [institution2Amount, setInstitution2Amount] = useState("400000") // 금액 방식용
  const [projectDuration, setProjectDuration] = useState(12) // 기본 12개월
  const [yearlyDistribution, setYearlyDistribution] = useState("균등") // 배분 방식
  const [categoryRatios, setCategoryRatios] = useState<CategoryRatios>(DEFAULT_CATEGORY_RATIOS)
  const [yearlyCustomRatios, setYearlyCustomRatios] = useState<number[]>([]) // 사용자 정의 연차별 비율
  const [isSaving, setIsSaving] = useState(false) // 저장 중 상태
  const [isApplying, setIsApplying] = useState(false) // 템플릿 적용 중 상태

  // 프로젝트 total_cost 자동 로드
  useEffect(() => {
    if (project?.total_cost && project.total_cost > 0) {
      setTotalBudget(project.total_cost.toString())
    }
  }, [project?.total_cost])

  // 프로젝트 기간 변경 시 사용자 정의 비율 초기화
  useEffect(() => {
    if (yearlyDistribution === "사용자정의") {
      initializeYearlyCustomRatios()
    }
  }, [projectDuration, yearlyDistribution])

  // 총 예산 변경 시 금액 방식 기본값 업데이트
  useEffect(() => {
    if (distributionMethod === "금액") {
      const total = Number.parseInt(totalBudget) || 0
      const equalAmount = Math.round(total / 2)
      setInstitution1Amount(equalAmount.toString())
      setInstitution2Amount(equalAmount.toString())
    }
  }, [totalBudget, distributionMethod])

  const calculateResults = () => {
    const total = Number.parseInt(totalBudget) || 0
    const govRatio = Number.parseInt(governmentRatio) || 0
    const cashRatio = Number.parseInt(privateCashRatio) || 0
    const inkindRatio = Number.parseInt(privateInkindRatio) || 0

    return {
      totalBudget: total,
      government: Math.round((total * govRatio) / 100),
      privateCash: Math.round((total * cashRatio) / 100),
      privateInkind: Math.round((total * inkindRatio) / 100),
    }
  }

  const calculateInstitutionBudgets = () => {
    const results = calculateResults()
    
    let institution1Budget: number
    let institution2Budget: number
    
    if (distributionMethod === "비율") {
      // 비율 방식
      const inst1Ratio = Number.parseInt(institution1Ratio) || 0
      const inst2Ratio = Number.parseInt(institution2Ratio) || 0
      
      institution1Budget = Math.round((results.totalBudget * inst1Ratio) / 100)
      institution2Budget = Math.round((results.totalBudget * inst2Ratio) / 100)
    } else {
      // 금액 방식
      institution1Budget = Number.parseInt(institution1Amount) || 0
      institution2Budget = Number.parseInt(institution2Amount) || 0
    }

    return {
      institution1: {
        total: institution1Budget,
        government: Math.round((institution1Budget * Number.parseInt(governmentRatio)) / 100),
        privateCash: Math.round((institution1Budget * Number.parseInt(privateCashRatio)) / 100),
        privateInkind: Math.round((institution1Budget * Number.parseInt(privateInkindRatio)) / 100),
      },
      institution2: {
        total: institution2Budget,
        government: Math.round((institution2Budget * Number.parseInt(governmentRatio)) / 100),
        privateCash: Math.round((institution2Budget * Number.parseInt(privateCashRatio)) / 100),
        privateInkind: Math.round((institution2Budget * Number.parseInt(privateInkindRatio)) / 100),
      },
    }
  }

  // 연차별 예산 분배 계산
  const calculateYearlyBudgets = () => {
    const results = calculateResults()
    const years = Math.ceil(projectDuration / 12)
    
    if (yearlyDistribution === "균등") {
      // 균등 분배: 각 연차에 동일한 금액
      const yearlyAmount = Math.round(results.totalBudget / years)
      const remainder = results.totalBudget - (yearlyAmount * years) // 반올림으로 인한 차이 보정
      
      return Array.from({ length: years }, (_, i) => {
        const amount = i === years - 1 ? yearlyAmount + remainder : yearlyAmount
        return {
          year: i + 1,
          amount,
          government: Math.round((amount * Number.parseInt(governmentRatio)) / 100),
          privateCash: Math.round((amount * Number.parseInt(privateCashRatio)) / 100),
          privateInkind: Math.round((amount * Number.parseInt(privateInkindRatio)) / 100),
        }
      })
    } else if (yearlyDistribution === "점진적") {
      // 점진적 증가: 첫해 60%, 이후 연차별로 증가
      const firstYearRatio = 0.6
      const remainingRatio = 1 - firstYearRatio
      const remainingYears = years - 1
      
      return Array.from({ length: years }, (_, i) => {
        let ratio: number
        if (i === 0) {
          ratio = firstYearRatio
        } else {
          // 나머지 연차에 균등하게 분배하되, 연차가 늘어날수록 약간씩 증가
          const baseRatio = remainingRatio / remainingYears
          const increaseFactor = 1 + (i * 0.1) // 연차별 10%씩 증가
          ratio = baseRatio * increaseFactor
        }
        
        const amount = Math.round(results.totalBudget * ratio)
        return {
          year: i + 1,
          amount,
          government: Math.round((amount * Number.parseInt(governmentRatio)) / 100),
          privateCash: Math.round((amount * Number.parseInt(privateCashRatio)) / 100),
          privateInkind: Math.round((amount * Number.parseInt(privateInkindRatio)) / 100),
        }
      })
    } else if (yearlyDistribution === "사용자정의") {
      // 사용자 정의 분배: 각 연차별 비율을 직접 입력
      return Array.from({ length: years }, (_, i) => {
        const customRatio = yearlyCustomRatios[i] || 0
        const amount = Math.round((results.totalBudget * customRatio) / 100)
        return {
          year: i + 1,
          amount,
          government: Math.round((amount * Number.parseInt(governmentRatio)) / 100),
          privateCash: Math.round((amount * Number.parseInt(privateCashRatio)) / 100),
          privateInkind: Math.round((amount * Number.parseInt(privateInkindRatio)) / 100),
        }
      })
    } else {
      // 기본값: 균등 분배
      const yearlyAmount = Math.round(results.totalBudget / years)
      return Array.from({ length: years }, (_, i) => ({
        year: i + 1,
        amount: yearlyAmount,
        government: Math.round((yearlyAmount * Number.parseInt(governmentRatio)) / 100),
        privateCash: Math.round((yearlyAmount * Number.parseInt(privateCashRatio)) / 100),
        privateInkind: Math.round((yearlyAmount * Number.parseInt(privateInkindRatio)) / 100),
      }))
    }
  }

  // 카테고리별 예산 계산
  const calculateCategoryBudgets = () => {
    const results = calculateResults()
    const categoryBudgets: Record<string, CategoryBudget> = {}
    
    Object.entries(categoryRatios).forEach(([category, ratio]) => {
      const amount = Math.round((results.totalBudget * ratio) / 100)
      categoryBudgets[category] = {
        amount,
        government: Math.round((amount * Number.parseInt(governmentRatio)) / 100),
        privateCash: Math.round((amount * Number.parseInt(privateCashRatio)) / 100),
        privateInkind: Math.round((amount * Number.parseInt(privateInkindRatio)) / 100),
      }
    })
    
    return categoryBudgets
  }

  const handleEqualDistribution = () => {
    if (distributionMethod === "비율") {
      setInstitution1Ratio("50")
      setInstitution2Ratio("50")
    } else {
      const results = calculateResults()
      const equalAmount = Math.round(results.totalBudget / 2)
      setInstitution1Amount(equalAmount.toString())
      setInstitution2Amount(equalAmount.toString())
    }
  }

  // 기관별 배분 합계 계산
  const calculateInstitutionDistributionSum = () => {
    if (distributionMethod === "비율") {
      return Number.parseInt(institution1Ratio) + Number.parseInt(institution2Ratio)
    } else {
      const results = calculateResults()
      const totalDistributed = Number.parseInt(institution1Amount) + Number.parseInt(institution2Amount)
      return Math.round((totalDistributed / results.totalBudget) * 100)
    }
  }

  // 기관별 배분 금액 합계 계산
  const calculateInstitutionDistributionAmountSum = () => {
    if (distributionMethod === "비율") {
      const results = calculateResults()
      const inst1Ratio = Number.parseInt(institution1Ratio) || 0
      const inst2Ratio = Number.parseInt(institution2Ratio) || 0
      return Math.round((results.totalBudget * (inst1Ratio + inst2Ratio)) / 100)
    } else {
      return Number.parseInt(institution1Amount) + Number.parseInt(institution2Amount)
    }
  }

  const handleResetCategoryRatios = () => {
    setCategoryRatios(DEFAULT_CATEGORY_RATIOS)
  }

  // 카테고리 비율 합계 계산
  const calculateCategoryRatioSum = () => {
    return Object.values(categoryRatios).reduce((sum, ratio) => sum + (ratio || 0), 0)
  }

  // 카테고리 비율 변경 핸들러
  const handleCategoryRatioChange = (category: string, value: number) => {
    const newRatios = { ...categoryRatios, [category]: value }
    setCategoryRatios(newRatios)
  }

  // 카테고리 비율 균등 분배
  const handleEqualCategoryDistribution = () => {
    const categoryCount = Object.keys(categoryRatios).length
    const equalRatio = Math.round(100 / categoryCount)
    const newRatios: CategoryRatios = {}
    
    Object.keys(categoryRatios).forEach((category, index) => {
      // 마지막 카테고리는 나머지를 모두 할당
      if (index === categoryCount - 1) {
        newRatios[category] = 100 - (equalRatio * (categoryCount - 1))
      } else {
        newRatios[category] = equalRatio
      }
    })
    
    setCategoryRatios(newRatios)
  }

  // 연차별 사용자 정의 비율 초기화
  const initializeYearlyCustomRatios = () => {
    const years = Math.ceil(projectDuration / 12)
    const equalRatio = Math.round(100 / years)
    const newRatios = Array.from({ length: years }, (_, i) => 
      i === years - 1 ? 100 - (equalRatio * (years - 1)) : equalRatio
    )
    setYearlyCustomRatios(newRatios)
  }

  // 연차별 사용자 정의 비율 변경
  const handleYearlyCustomRatioChange = (yearIndex: number, value: number) => {
    const newRatios = [...yearlyCustomRatios]
    newRatios[yearIndex] = value
    setYearlyCustomRatios(newRatios)
  }

  // 연차별 사용자 정의 비율 균등 분배
  const handleEqualYearlyDistribution = () => {
    initializeYearlyCustomRatios()
  }

  // 새로고침 기능
  const handleRefresh = () => {
    // 모든 계산을 다시 수행
    const results = calculateResults()
    const institutionBudgets = calculateInstitutionBudgets()
    const yearlyBudgets = calculateYearlyBudgets()
    const categoryBudgets = calculateCategoryBudgets()
    
    // 성공 메시지
    alert('계산 결과가 새로고침되었습니다!')
  }

  const handleApplyTemplate = () => {
    setIsApplying(true)
    const results = calculateResults()
    const institutions = calculateInstitutionBudgets()
    const yearlyBudgets = calculateYearlyBudgets()
    const categoryBudgets = calculateCategoryBudgets()

    const budgetData = {
      unit: unit,
      projectType: "single",
      results: results,
      institutions: institutions,
      yearlyBudgets: yearlyBudgets,
      categoryBudgets: categoryBudgets,
      categoryRatios: categoryRatios,
      projectDuration: projectDuration,
    }

    onApplyTemplate(budgetData)
    onOpenChange(false)
    setIsApplying(false)
  }

  const handleSaveToProject = async () => {
    if (!project?.id) {
      alert('프로젝트 정보가 없습니다.')
      return
    }

    setIsSaving(true)
    try {
      const results = calculateResults()
      const yearlyBudgets = calculateYearlyBudgets()
      const categoryBudgets = calculateCategoryBudgets()
      const institutions = calculateInstitutionBudgets()

      // 1. 프로젝트 예산 생성/업데이트
      const budgetPromises = yearlyBudgets.map(async (yearBudget) => {
        const budgetData = {
          projectIdx: project.id,
          budgetYear: yearBudget.year,
          totalBudget: yearBudget.amount,
          usedBudget: 0,
          remainingBudget: yearBudget.amount,
          budgetStatus: 'ACTIVE',
          budgetNotes: `사업비 계산기로 생성된 ${yearBudget.year}년차 예산`
        }

        const response = await apiFetch('/api/project-budgets', {
          method: 'POST',
          body: JSON.stringify(budgetData)
        })

        if (!response.ok) {
          throw new Error(`예산 생성 실패: ${yearBudget.year}년차`)
        }

        return await response.json()
      })

      const createdBudgets = await Promise.all(budgetPromises)

      // 2. 예산 항목 생성
      const itemPromises = createdBudgets.flatMap((budget: any, budgetIndex: number) => {
        const yearBudget = yearlyBudgets[budgetIndex]
        
        return Object.entries(categoryBudgets).map(async ([category, catData]) => {
          // 카테고리 ID 찾기 (실제로는 API에서 가져와야 함)
          const categoryId = 1 // 임시 값, 실제로는 카테고리 매핑 필요
          
          const itemData = {
            budgetIdx: budget.idx,
            categoryIdx: categoryId,
            itemName: `${CATEGORY_NAMES[category] || category} - ${yearBudget.year}년차`,
            plannedAmount: Math.round(catData.amount / yearlyBudgets.length), // 연차별 균등 분배
            actualAmount: 0,
            itemStatus: 'PLANNED'
          }

          const response = await apiFetch('/api/budget-items', {
            method: 'POST',
            body: JSON.stringify(itemData)
          })

          if (!response.ok) {
            throw new Error(`예산 항목 생성 실패: ${category}`)
          }

          return await response.json()
        })
      })

      await Promise.all(itemPromises.flat())

      // 3. 성공 메시지
      alert('예산이 성공적으로 프로젝트에 저장되었습니다!')
      
      // 4. 다이얼로그 닫기
      onOpenChange(false)

    } catch (error) {
      console.error('예산 저장 오류:', error)
      alert(`예산 저장에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const results = calculateResults()
  const institutionBudgets = calculateInstitutionBudgets()
  const yearlyBudgets = calculateYearlyBudgets()
  const categoryBudgets = calculateCategoryBudgets()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            사업비 계산기
          </DialogTitle>
          <p className="text-sm text-gray-500">프로젝트 예산을 계산하고 실제 데이터에 적용합니다.</p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* 기본 설정 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">기본 설정</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="project-duration" className="text-gray-700">
                    총 사업기간
                  </Label>
                  <Select
                    value={projectDuration.toString()}
                    onValueChange={(value) => setProjectDuration(Number(value))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 36 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}개월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="total-budget" className="text-gray-700">
                    정부 사업비 (천원)
                  </Label>
                  <Input
                    id="total-budget"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="mt-1"
                    placeholder="프로젝트 총 사업비"
                  />
                </div>
                <div>
                  <Label htmlFor="unit" className="text-gray-700">
                    단위
                  </Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="원">원</SelectItem>
                      <SelectItem value="천원">천원</SelectItem>
                      <SelectItem value="백만원">백만원</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="yearly-distribution" className="text-gray-700">
                    배분 방식
                  </Label>
                  <Select value={yearlyDistribution} onValueChange={setYearlyDistribution}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="균등">균등 분배</SelectItem>
                      <SelectItem value="점진적">점진적 증가</SelectItem>
                      <SelectItem value="사용자정의">사용자 정의</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비율 조정 */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">예산 비율 조정</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700">정부지원금 비율 (%)</Label>
                  <Input
                    value={governmentRatio}
                    onChange={(e) => setGovernmentRatio(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">민간현금 비율 (%)</Label>
                  <Input
                    value={privateCashRatio}
                    onChange={(e) => setPrivateCashRatio(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">민간현물 비율 (%)</Label>
                  <Input
                    value={privateInkindRatio}
                    onChange={(e) => setPrivateInkindRatio(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 계산 결과 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">계산 결과</h3>
              <Button variant="outline" size="sm" className="text-gray-600" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                새로고침
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-blue-600 text-sm mb-1">정부 사업비</div>
                  <div className="text-blue-700 text-lg font-bold">
                    {results.totalBudget.toLocaleString()}
                    {unit}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-green-600 text-sm mb-1">정부지원금</div>
                  <div className="text-green-700 text-lg font-bold">
                    {results.government.toLocaleString()}
                    {unit}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <div className="text-orange-600 text-sm mb-1">민간현금</div>
                  <div className="text-orange-700 text-lg font-bold">
                    {results.privateCash.toLocaleString()}
                    {unit}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="text-purple-600 text-sm mb-1">민간현물</div>
                  <div className="text-purple-700 text-lg font-bold">
                    {results.privateInkind.toLocaleString()}
                    {unit}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 연차별 예산 분배 */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">연차별 예산 분배</h3>
                {yearlyDistribution === "사용자정의" && (
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">연차별 비율 합계: </span>
                      <span className={`font-semibold ${yearlyCustomRatios.reduce((sum, ratio) => sum + ratio, 0) === 100 ? 'text-green-600' : 'text-red-600'}`}>
                        {yearlyCustomRatios.reduce((sum, ratio) => sum + ratio, 0)}%
                      </span>
                      {yearlyCustomRatios.reduce((sum, ratio) => sum + ratio, 0) !== 100 && (
                        <span className="text-red-500 text-xs ml-2">(100%가 되어야 합니다)</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleEqualYearlyDistribution}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      균등 분배
                    </Button>
                  </div>
                )}
              </div>

              {/* 사용자 정의 분배 입력 */}
              {yearlyDistribution === "사용자정의" && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">연차별 비율 설정</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Array.from({ length: Math.ceil(projectDuration / 12) }, (_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Label className="text-sm text-gray-600 whitespace-nowrap">{i + 1}년차:</Label>
                        <Input
                          type="number"
                          value={yearlyCustomRatios[i] || ""}
                          onChange={(e) => handleYearlyCustomRatioChange(i, Number(e.target.value))}
                          className="w-16 text-center"
                          placeholder="비율"
                          min="0"
                          max="100"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-700">연차</th>
                      <th className="text-left py-2 text-gray-700">총사업비</th>
                      <th className="text-left py-2 text-gray-700">정부사업비</th>
                      <th className="text-left py-2 text-gray-700">민간부담금 중 현금</th>
                      <th className="text-left py-2 text-gray-700">민간부담금 중 현물</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyBudgets.map((year) => (
                      <tr key={year.year} className="border-b border-gray-100">
                        <td className="py-2 text-gray-900">{year.year}년차</td>
                        <td className="py-2 text-gray-900">
                          {year.amount.toLocaleString()}{unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {year.government.toLocaleString()}{unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {year.privateCash.toLocaleString()}{unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {year.privateInkind.toLocaleString()}{unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리별 예산 계산 */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">카테고리별 예산 계산</h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">비율 합계: </span>
                    <span className={`font-semibold ${calculateCategoryRatioSum() === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateCategoryRatioSum()}%
                    </span>
                    {calculateCategoryRatioSum() !== 100 && (
                      <span className="text-red-500 text-xs ml-2">(100%가 되어야 합니다)</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleResetCategoryRatios}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    기본 비율로 초기화
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleEqualCategoryDistribution}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    균등 분배
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-700">카테고리</th>
                      <th className="text-left py-2 text-gray-700">비율 (%)</th>
                      <th className="text-left py-2 text-gray-700">총사업비</th>
                      <th className="text-left py-2 text-gray-700">정부사업비</th>
                      <th className="text-left py-2 text-gray-700">민간부담금 중 현금</th>
                      <th className="text-left py-2 text-gray-700">민간부담금 중 현물</th>
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
                          {data.amount.toLocaleString()}{unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {data.government.toLocaleString()}{unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {data.privateCash.toLocaleString()}{unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {data.privateInkind.toLocaleString()}{unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 기관별 배분 */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기관별 예산 배분</h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>총 사업비를 기관별로 배분합니다.</span>
                <div className="flex items-center gap-2">
                  <Label>배분방식:</Label>
                  <Select value={distributionMethod} onValueChange={setDistributionMethod}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="비율">비율</SelectItem>
                      <SelectItem value="금액">금액</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" onClick={handleEqualDistribution}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  균등 배분
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">주관기관</span>
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-24 text-center"
                      value={distributionMethod === "비율" ? institution1Ratio : institution1Amount}
                      onChange={(e) => {
                        if (distributionMethod === "비율") {
                          setInstitution1Ratio(e.target.value)
                        } else {
                          setInstitution1Amount(e.target.value)
                        }
                      }}
                      placeholder={distributionMethod === "비율" ? "비율" : "금액"}
                    />
                    <span className="text-gray-600">
                      {distributionMethod === "비율" ? "%" : unit}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">참여기관</span>
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-24 text-center"
                      value={distributionMethod === "비율" ? institution2Ratio : institution2Amount}
                      onChange={(e) => {
                        if (distributionMethod === "비율") {
                          setInstitution2Ratio(e.target.value)
                        } else {
                          setInstitution2Amount(e.target.value)
                        }
                      }}
                      placeholder={distributionMethod === "비율" ? "비율" : "금액"}
                    />
                    <span className="text-gray-600">
                      {distributionMethod === "비율" ? "%" : unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right mb-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-green-600">
                    {distributionMethod === "비율" ? "기관 배분 비율 합계" : "기관 배분 금액 합계"}: {
                      distributionMethod === "비율" 
                        ? `${calculateInstitutionDistributionSum()}%`
                        : `${calculateInstitutionDistributionAmountSum().toLocaleString()}${unit}`
                    }
                  </div>
                  {distributionMethod === "금액" && (
                    <div className="text-xs text-gray-500">
                      총 예산 대비: {calculateInstitutionDistributionSum()}%
                    </div>
                  )}
                </div>
              </div>

              {/* 기관별 계산 결과 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">기관별 계산 결과</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-200">
                        <th className="text-left py-2 text-gray-700">기관명</th>
                        <th className="text-left py-2 text-gray-700">기관분류</th>
                        <th className="text-left py-2 text-gray-700">
                          {distributionMethod === "비율" ? "배분비율" : "배분금액"}
                        </th>
                        <th className="text-left py-2 text-gray-700">총사업비</th>
                        <th className="text-left py-2 text-gray-700">정부사업비</th>
                        <th className="text-left py-2 text-gray-700">민간부담금 중 현금</th>
                        <th className="text-left py-2 text-gray-700">민간부담금 중 현물</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blue-100">
                        <td className="py-2 text-gray-900">주관기관</td>
                        <td className="py-2 text-gray-600">주관</td>
                        <td className="py-2 text-gray-600">
                          {distributionMethod === "비율" 
                            ? `${institution1Ratio}%`
                            : `${Number.parseInt(institution1Amount).toLocaleString()}${unit}`
                          }
                        </td>
                        <td className="py-2 text-gray-900">
                          {institutionBudgets.institution1.total.toLocaleString()}
                          {unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {institutionBudgets.institution1.government.toLocaleString()}
                          {unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {institutionBudgets.institution1.privateCash.toLocaleString()}
                          {unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {institutionBudgets.institution1.privateInkind.toLocaleString()}
                          {unit}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-900">참여기관</td>
                        <td className="py-2 text-gray-600">참여</td>
                        <td className="py-2 text-gray-600">
                          {distributionMethod === "비율" 
                            ? `${institution2Ratio}%`
                            : `${Number.parseInt(institution2Amount).toLocaleString()}${unit}`
                          }
                        </td>
                        <td className="py-2 text-gray-900">
                          {institutionBudgets.institution2.total.toLocaleString()}
                          {unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {institutionBudgets.institution2.government.toLocaleString()}
                          {unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {institutionBudgets.institution2.privateCash.toLocaleString()}
                          {unit}
                        </td>
                        <td className="py-2 text-gray-900">
                          {institutionBudgets.institution2.privateInkind.toLocaleString()}
                          {unit}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          {/* <Button variant="outline" onClick={handleSaveToProject} disabled={isSaving}>
            {isSaving ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            프로젝트에 저장
          </Button> */}
          <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={handleApplyTemplate} disabled={isApplying}>
            {isApplying ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Download className="w-4 h-4 mr-1" />
            )}
            예산 템플릿 적용
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
