"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Download, Plus, Minus, RefreshCw } from "lucide-react"
import { InstitutionDetailedBudgetDialog } from "./institution-detailed-budget-dialog"

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

// InstitutionCategoryBudget 인터페이스 제거 (더 이상 사용하지 않음)

export function DetailedBudgetCalculatorDialog({ open, onOpenChange, onApplyTemplate, project, consortiumData, basicCalculatorRatios }: DetailedBudgetCalculatorDialogProps) {
  const [totalBudget, setTotalBudget] = useState("700000")
  const [governmentRatio, setGovernmentRatio] = useState("70")
  const [privateCashRatio, setPrivateCashRatio] = useState("15")
  const [privateInkindRatio, setPrivateInkindRatio] = useState("15")
  const [projectDuration, setProjectDuration] = useState(12) // 기본 12개월
  const [yearlyDistribution, setYearlyDistribution] = useState("균등") // 분배 방식
  const [yearlyCustomAmounts, setYearlyCustomAmounts] = useState<number[]>([]) // 사용자 정의 연차별 금액
  const [institutionRatios, setInstitutionRatios] = useState<string[]>([])
  const [institutionInputMode, setInstitutionInputMode] = useState<"ratio" | "direct">("ratio") // 비율 설정 또는 직접 입력
  const [institutionDirectAmounts, setInstitutionDirectAmounts] = useState<{ type: "government" | "total", amount: number }[]>([]) // 직접 입력 금액들
  const [activeYear, setActiveYear] = useState(1) // 현재 선택된 연차 (1~5)
  const [yearlyInstitutionRatios, setYearlyInstitutionRatios] = useState<Record<number, string[]>>({}) // 연차별 기관 비율
  const [yearlyInstitutionDirectAmounts, setYearlyInstitutionDirectAmounts] = useState<Record<number, { type: "government" | "total", amount: number }[]>>({}) // 연차별 직접 입력 금액들
  
  // 기관별 상세 사업비 계산기 상태 추가
  const [institutionDetailedBudgetOpen, setInstitutionDetailedBudgetOpen] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null)
  const [selectedInstitutionBudget, setSelectedInstitutionBudget] = useState<number>(0)
  
  const [isApplying, setIsApplying] = useState(false)

  // 로컬 스토리지에서 데이터 불러오기
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('detailedBudgetCalculatorData')
      if (savedData) {
        const parsed = JSON.parse(savedData)
        if (parsed.totalBudget) setTotalBudget(parsed.totalBudget)
        if (parsed.governmentRatio) setGovernmentRatio(parsed.governmentRatio)
        if (parsed.privateCashRatio) setPrivateCashRatio(parsed.privateCashRatio)
        if (parsed.privateInkindRatio) setPrivateInkindRatio(parsed.privateInkindRatio)
        if (parsed.projectDuration) setProjectDuration(parsed.projectDuration)
        if (parsed.yearlyDistribution) setYearlyDistribution(parsed.yearlyDistribution)
        if (parsed.yearlyCustomAmounts) setYearlyCustomAmounts(parsed.yearlyCustomAmounts)
        if (parsed.institutionRatios) setInstitutionRatios(parsed.institutionRatios)
        if (parsed.institutionInputMode) setInstitutionInputMode(parsed.institutionInputMode)
        if (parsed.institutionDirectAmounts) setInstitutionDirectAmounts(parsed.institutionDirectAmounts)
        if (parsed.yearlyInstitutionRatios) setYearlyInstitutionRatios(parsed.yearlyInstitutionRatios)
        if (parsed.yearlyInstitutionDirectAmounts) setYearlyInstitutionDirectAmounts(parsed.yearlyInstitutionDirectAmounts)
      }
    } catch (error) {
      console.error('로컬 스토리지에서 데이터 불러오기 실패:', error)
    }
  }

  // 로컬 스토리지에 데이터 저장
  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        totalBudget,
        governmentRatio,
        privateCashRatio,
        privateInkindRatio,
        projectDuration,
        yearlyDistribution,
        yearlyCustomAmounts,
        institutionRatios,
        institutionInputMode,
        institutionDirectAmounts,
        yearlyInstitutionRatios,
        yearlyInstitutionDirectAmounts,
      }
      localStorage.setItem('detailedBudgetCalculatorData', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('로컬 스토리지에 데이터 저장 실패:', error)
    }
  }

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    loadFromLocalStorage()
  }, [])

  // 데이터 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    saveToLocalStorage()
  }, [
    totalBudget, 
    governmentRatio, 
    privateCashRatio, 
    privateInkindRatio, 
    projectDuration, 
    yearlyDistribution, 
    yearlyCustomAmounts, 
    institutionRatios, 
    institutionInputMode, 
    institutionDirectAmounts, 
    yearlyInstitutionRatios, 
    yearlyInstitutionDirectAmounts
  ])

  // 프로젝트 total_cost 자동 로드 (한 번만 실행되도록 수정)
  useEffect(() => {
    if (project?.total_cost && project.total_cost > 0) {
      // 로컬 스토리지에 저장된 값이 있으면 그것을 우선 사용
      const savedData = localStorage.getItem('detailedBudgetCalculatorData')
      if (!savedData || !JSON.parse(savedData).totalBudget) {
        setTotalBudget(project.total_cost.toString())
      }
    }
  }, [project?.total_cost])

  // 기본 사업비 계산기에서 설정한 비율들을 적용 (한 번만 실행되도록 수정)
  useEffect(() => {
    if (basicCalculatorRatios) {
      // 로컬 스토리지에 저장된 값이 있으면 그것을 우선 사용
      const savedData = localStorage.getItem('detailedBudgetCalculatorData')
      if (!savedData || !JSON.parse(savedData).governmentRatio) {
        setGovernmentRatio(basicCalculatorRatios.governmentRatio.toString())
        setPrivateCashRatio(basicCalculatorRatios.privateCashRatio.toString())
        setPrivateInkindRatio(basicCalculatorRatios.privateInkindRatio.toString())
      }
    }
  }, [basicCalculatorRatios])

  // 컨소시엄 데이터가 로드되면 초기화 (한 번만 실행되도록 수정)
  useEffect(() => {
    if (consortiumData?.organizations && consortiumData.organizations.length > 0) {
      // 기존 데이터가 없을 때만 초기화
      if (institutionRatios.length === 0) {
        const organizationCount = consortiumData.organizations.length
        const equalRatio = Math.round(100 / organizationCount)
        const newRatios = Array.from({ length: organizationCount }, (_, i) => 
          i === organizationCount - 1 ? (100 - (equalRatio * (organizationCount - 1))).toString() : equalRatio.toString()
        )
        setInstitutionRatios(newRatios)
        
        // 연차별 비율도 초기화
        const years = Math.ceil(projectDuration / 12)
        const newYearlyRatios: Record<number, string[]> = {}
        for (let year = 1; year <= years; year++) {
          newYearlyRatios[year] = [...newRatios]
        }
        setYearlyInstitutionRatios(newYearlyRatios)
      }
    }
  }, [consortiumData?.organizations, projectDuration])

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

  // 카테고리별 예산 계산 (더 이상 사용하지 않음 - 제거)
  const calculateCategoryBudgets = () => {
    // 정부지원예산을 총 연구개발비로 변환
    const totalBudgetValue = Number(totalBudget) || 0  // 정부지원예산
    const govRatio = Number(governmentRatio) || 70
    const totalRD = Math.round((totalBudgetValue * 100) / govRatio)  // 총 연구개발비
    
    const categoryBudgets: Record<string, CategoryBudget> = {}
    
    Object.entries(DEFAULT_CATEGORY_RATIOS).forEach(([category, ratio]) => {
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

  // 카테고리 비율 합계 계산 (더 이상 사용하지 않음 - 제거)
  const calculateCategoryRatioSum = () => {
    return Object.values(DEFAULT_CATEGORY_RATIOS).reduce((sum, ratio) => sum + (ratio || 0), 0)
  }

  // 카테고리 비율 변경 핸들러 (더 이상 사용하지 않음 - 제거)
  const handleCategoryRatioChange = (category: string, value: number) => {
    // 현재 카테고리를 제외한 다른 카테고리들의 비율 합계 계산
    const otherCategoriesSum = Object.entries(DEFAULT_CATEGORY_RATIOS)
      .filter(([cat]) => cat !== category)
      .reduce((sum, [, ratio]) => sum + (ratio || 0), 0)
    
    // 새로운 비율이 100%를 넘지 않도록 제한
    const maxAllowedValue = Math.max(0, 100 - otherCategoriesSum)
    const limitedValue = Math.min(value, maxAllowedValue)
    
    const newRatios = { ...DEFAULT_CATEGORY_RATIOS, [category]: limitedValue }
    // setCategoryRatios(newRatios) // 이 부분은 사용하지 않으므로 제거
  }

  // 카테고리 비율 균등 분배 (더 이상 사용하지 않음 - 제거)
  const handleEqualCategoryDistribution = () => {
    const categoryCount = Object.keys(DEFAULT_CATEGORY_RATIOS).length
    const equalRatio = Math.round(100 / categoryCount)
    const newRatios: CategoryRatios = {}
    
    Object.keys(DEFAULT_CATEGORY_RATIOS).forEach((category, index) => {
      if (index === categoryCount - 1) {
        newRatios[category] = 100 - (equalRatio * (categoryCount - 1))
      } else {
        newRatios[category] = equalRatio
      }
    })
    
    // setCategoryRatios(newRatios) // 이 부분은 사용하지 않으므로 제거
  }

  // 기관별 예산 배분 계산 (연차별) - 정부지원예산을 총 연구개발비로 잘못 계산하는 문제 수정
  const calculateInstitutionBudgets = (year: number = activeYear) => {
    if (!consortiumData?.organizations) return []
    
    const organizations = consortiumData.organizations
    const budgets: any[] = []
    const govRatio = Number(governmentRatio) || 70
    
    if (institutionInputMode === "ratio") {
      // 비율 설정 모드: 정부지원예산을 기준으로 계산
      const totalBudgetValue = Number(totalBudget) || 0  // 정부지원예산 (총 연구개발비가 아님!)
      
      organizations.forEach((org, index) => {
        const ratio = Number(yearlyInstitutionRatios[year]?.[index] || institutionRatios[index] || 0)
        
        // 기관별 정부지원예산 = 전체 정부지원예산 × 기관별 배분 비율
        const governmentAmount = Math.round((totalBudgetValue * ratio) / 100)
        
        // 기관별 총 연구개발비 = 기관별 정부지원예산 × (100 / 정부지원예산 비율)
        const instBudget = Math.round((governmentAmount * 100) / govRatio)
        
        // 기관별 민간 현금 = 기관별 총 연구개발비 × 민간 현금 비율
        const privateCashAmount = Math.round((instBudget * Number(privateCashRatio)) / 100)
        
        // 기관별 민간 현물 = 기관별 총 연구개발비 × 민간 현물 비율
        const privateInkindAmount = Math.round((instBudget * Number(privateInkindRatio)) / 100)
        
        budgets[index] = {
          total: instBudget, // 총 연구개발비
          government: governmentAmount, // 정부지원예산
          privateCash: privateCashAmount, // 민간 현금
          privateInkind: privateInkindAmount, // 민간 현물
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

  // 연차별 사용자 정의 금액 변경
  const handleYearlyCustomAmountChange = (yearIndex: number, value: number) => {
    const newAmounts = [...yearlyCustomAmounts]
    newAmounts[yearIndex] = value
    setYearlyCustomAmounts(newAmounts)
  }

  // 연차별 사용자 정의 금액 균등 분배 - 정부지원예산을 기준으로 수정
  const handleEqualYearlyAmountDistribution = () => {
    const years = Math.ceil(projectDuration / 12)
    const totalBudgetValue = Number(totalBudget) || 0  // 정부지원예산
    const equalAmount = Math.round(totalBudgetValue / years)
    const newAmounts = Array.from({ length: years }, (_, i) => 
      i === years - 1 ? totalBudgetValue - (equalAmount * (years - 1)) : equalAmount
    )
    setYearlyCustomAmounts(newAmounts)
  }

  // 연차별 사용자 정의 금액 합계 검증 - 정부지원예산 기준으로 수정
  const validateYearlyCustomAmounts = () => {
    const totalBudgetValue = Number(totalBudget) || 0  // 정부지원예산
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
    
    const organizationCount = consortiumData.organizations.length
    const equalRatio = Math.round(100 / organizationCount)
    const newRatios = Array.from({ length: organizationCount }, (_, i) => 
      i === organizationCount - 1 ? (100 - (equalRatio * (organizationCount - 1))).toString() : equalRatio.toString()
    )
    
    setInstitutionRatios(newRatios)
    
    // 연차별 비율도 업데이트
    const newYearlyRatios = { ...yearlyInstitutionRatios }
    for (let year = 1; year <= Math.ceil(projectDuration / 12); year++) {
      newYearlyRatios[year] = [...newRatios]
    }
    setYearlyInstitutionRatios(newYearlyRatios)
  }

  // 기관별 상세 사업비 계산기 열기
  const handleOpenInstitutionDetailedBudget = (institution: any, index: number) => {
    const budget = calculateInstitutionBudgets(activeYear)[index]
    if (budget) {
      setSelectedInstitution(institution)
      setSelectedInstitutionBudget(budget.total)
      setInstitutionDetailedBudgetOpen(true)
    }
  }

  // 기관별 상세 사업비 저장
  const handleSaveInstitutionDetailedBudget = async (budgetData: any) => {
    // TODO: 기관별 상세 사업비 데이터 저장 로직 구현
    console.log(`기관 ${selectedInstitution?.name}의 상세 사업비 저장:`, budgetData)
    
    // 여기서 API 호출하여 데이터베이스에 저장
    // await saveInstitutionDetailedBudget(selectedInstitution.id, budgetData)
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
        categoryRatios: DEFAULT_CATEGORY_RATIOS, // 카테고리 비율은 기본값 사용
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

  // 기관별 상세 사업비 계산기 다이얼로그
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Calculator className="w-5 h-5" />
              상세 사업비 계산기
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 기본 설정 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">기본 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 왼쪽 컬럼 */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="totalBudget" className="text-sm font-medium text-gray-700">
                        정부지원예산 (천원)
                      </Label>
                      <Input
                        id="totalBudget"
                        type="number"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(e.target.value)}
                        placeholder="정부지원예산을 입력하세요"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        프로젝트에서 정부로부터 지원받는 예산 금액입니다.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="projectDuration" className="text-sm font-medium text-gray-700">
                        프로젝트 기간 (개월)
                      </Label>
                      <Input
                        id="projectDuration"
                        type="number"
                        value={projectDuration}
                        onChange={(e) => setProjectDuration(Number(e.target.value))}
                        placeholder="프로젝트 기간을 입력하세요"
                        min="1"
                        max="60"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="yearlyDistribution" className="text-sm font-medium text-gray-700">
                        연차별 분배 방식
                      </Label>
                      <Select value={yearlyDistribution} onValueChange={setYearlyDistribution}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="균등">균등 분배</SelectItem>
                          <SelectItem value="사용자정의">사용자 정의</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 오른쪽 컬럼 */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="governmentRatio" className="text-sm font-medium text-gray-700">
                        정부지원예산 비율 (%)
                      </Label>
                      <Input
                        id="governmentRatio"
                        type="number"
                        value={governmentRatio}
                        onChange={(e) => setGovernmentRatio(e.target.value)}
                        placeholder="정부지원예산 비율"
                        min="0"
                        max="100"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        총 연구개발비 대비 정부지원예산의 비율입니다.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="privateCashRatio" className="text-sm font-medium text-gray-700">
                        민간 현금 비율 (%)
                      </Label>
                      <Input
                        id="privateCashRatio"
                        type="number"
                        value={privateCashRatio}
                        onChange={(e) => setPrivateCashRatio(e.target.value)}
                        placeholder="민간 현금 비율"
                        min="0"
                        max="100"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="privateInkindRatio" className="text-sm font-medium text-gray-700">
                        민간 현물 비율 (%)
                      </Label>
                      <Input
                        id="privateInkindRatio"
                        type="number"
                        value={privateInkindRatio}
                        onChange={(e) => setPrivateInkindRatio(e.target.value)}
                        placeholder="민간 현물 비율"
                        min="0"
                        max="100"
                        className="mt-1"
                      />
                    </div>


                  </div>
                </div>

                {/* 총 연구개발비 계산 결과 표시 */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-2">계산 결과</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {totalBudget ? Number(totalBudget).toLocaleString() : 0}
                      </div>
                      <div className="text-xs text-blue-700">정부지원예산 (천원)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">
                        {totalBudget && governmentRatio && privateCashRatio ? 
                          Math.round((Number(totalBudget) * Number(privateCashRatio)) / Number(governmentRatio)).toLocaleString() : 0
                        }
                      </div>
                      <div className="text-xs text-yellow-700">민간 현금 (천원)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {totalBudget && governmentRatio && privateInkindRatio ? 
                          Math.round((Number(totalBudget) * Number(privateInkindRatio)) / Number(governmentRatio)).toLocaleString() : 0
                        }
                      </div>
                      <div className="text-xs text-purple-700">민간 현물 (천원)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {totalBudget && governmentRatio ? 
                          Math.round((Number(totalBudget) * 100) / Number(governmentRatio)).toLocaleString() : 0
                        }
                      </div>
                      <div className="text-xs text-green-700">총 연구개발비 (천원)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">연차별 예산 분배 결과</CardTitle>
              </CardHeader>
              <CardContent>
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
                      {yearlyBudgets.map((year, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">{index + 1}차년도</td>
                          <td className="py-3 text-gray-900">{year.government.toLocaleString()}천원</td>
                          <td className="py-3 text-gray-900">{year.privateCash.toLocaleString()}천원</td>
                          <td className="py-3 text-gray-900">{year.privateInkind.toLocaleString()}천원</td>
                          <td className="py-3 text-gray-900">{year.amount.toLocaleString()}천원</td>
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
                            <th className="text-left py-2 text-gray-700">상세 예산</th>
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
                              <td className="py-2 text-gray-600">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOpenInstitutionDetailedBudget(org, index)}
                                  className="text-xs"
                                >
                                  상세 예산
                                </Button>
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
                              {calculateInstitutionBudgets(activeYear).reduce((sum: number, budget: any) => sum + (budget?.government || 0), 0).toLocaleString()}천원
                            </td>
                            <td className="py-2 text-gray-900">
                              {calculateInstitutionBudgets(activeYear).reduce((sum: number, budget: any) => sum + (budget?.privateCash || 0), 0).toLocaleString()}천원
                            </td>
                            <td className="py-2 text-gray-900">
                              {calculateInstitutionBudgets(activeYear).reduce((sum: number, budget: any) => sum + (budget?.privateInkind || 0), 0).toLocaleString()}천원
                            </td>
                            <td className="py-2 text-gray-900">
                              {calculateInstitutionBudgets(activeYear).reduce((sum: number, budget: any) => sum + (budget?.total || 0), 0).toLocaleString()}천원
                            </td>
                            <td className="py-2 text-gray-600">
                              {/* 상세 예산 열은 합계 행에서 제외 */}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* 안내 메시지 추가 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 mt-0.5">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">기관별 상세 예산 설정</p>
                          <p>각 기관의 "상세 예산" 버튼을 클릭하여 카테고리별 예산을 세부적으로 설정할 수 있습니다.</p>
                          <p className="mt-1 text-xs">예: 인건비, 연구재료비, 연구장비비 등 각 카테고리별 비율 및 금액 설정</p>
                        </div>
                      </div>
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

      {/* 기관별 상세 사업비 계산기 다이얼로그 */}
      {selectedInstitution && (
        <InstitutionDetailedBudgetDialog
          open={institutionDetailedBudgetOpen}
          onOpenChange={setInstitutionDetailedBudgetOpen}
          institution={selectedInstitution}
          totalBudget={selectedInstitutionBudget}
          governmentRatio={Number(governmentRatio)}
          privateCashRatio={Number(privateCashRatio)}
          privateInkindRatio={Number(privateInkindRatio)}
          onSave={handleSaveInstitutionDetailedBudget}
        />
      )}
    </>
  )
}
