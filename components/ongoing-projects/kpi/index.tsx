"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Target, TrendingUp, BarChart3, Award } from "lucide-react"
import { apiFetch } from "@/lib/func"
import { toast } from "sonner"

interface KPIProps {
  project: any
}

interface KpiType {
  idx: number
  name: string
  description?: string
  unit?: string
  project_id: number
  created_at: string
  updated_at: string
}

interface KpiGoal {
  id: number
  project_id: number
  year: number
  kpi_type: string
  target_value: number
  description?: string
  member_name: string
  created_at: string
  updated_at: string
}

interface KpiResult {
  id: number
  project_id: number
  year: number
  kpi_type: string
  actual_value: number
  achievement_date?: string
  description?: string
  attachment_files?: any
  member_name: string
  created_at: string
  updated_at: string
}

export function KPI({ project }: KPIProps) {
  const [kpiTypes, setKpiTypes] = useState<KpiType[]>([])
  const [kpiGoals, setKpiGoals] = useState<KpiGoal[]>([])
  const [kpiResults, setKpiResults] = useState<KpiResult[]>([])
  const [loading, setLoading] = useState(true)
  const [showTypeDialog, setShowTypeDialog] = useState(false)
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [editingType, setEditingType] = useState<KpiType | null>(null)
  const [editingGoal, setEditingGoal] = useState<KpiGoal | null>(null)
  const [editingResult, setEditingResult] = useState<KpiResult | null>(null)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  
  const [typeFormData, setTypeFormData] = useState({
    name: "",
    description: "",
    unit: ""
  })
  
  const [goalFormData, setGoalFormData] = useState({
    year: currentYear,
    kpiType: "",
    targetValue: "",
    description: ""
  })

  const [resultFormData, setResultFormData] = useState({
    year: currentYear,
    kpiType: "",
    actualValue: "",
    achievementDate: "",
    description: ""
  })

  // KPI 타입 목록 가져오기
  const fetchKpiTypes = async () => {
    try {
      const response = await apiFetch(`/api/kpi/types?projectId=${project.id}`)
      const result = await response.json()
      
      if (result.success) {
        setKpiTypes(result.data)
      }
    } catch (error) {
      console.error('KPI 타입 조회 오류:', error)
      toast.error('KPI 타입을 불러오는데 실패했습니다.')
    }
  }

  // KPI 목표 목록 가져오기
  const fetchKpiGoals = async () => {
    try {
      const response = await apiFetch(`/api/kpi/goals?projectId=${project.id}&year=${currentYear}`)
      const result = await response.json()
      
      if (result.success) {
        setKpiGoals(result.data)
      }
    } catch (error) {
      console.error('KPI 목표 조회 오류:', error)
      toast.error('KPI 목표를 불러오는데 실패했습니다.')
    }
  }

  // KPI 실적 목록 가져오기
  const fetchKpiResults = async () => {
    try {
      const response = await apiFetch(`/api/kpi/results?projectId=${project.id}&year=${currentYear}`)
      const result = await response.json()
      
      if (result.success) {
        setKpiResults(result.data)
      }
    } catch (error) {
      console.error('KPI 실적 조회 오류:', error)
      toast.error('KPI 실적을 불러오는데 실패했습니다.')
    }
  }

  useEffect(() => {
    if (project?.id) {
      fetchKpiTypes()
      fetchKpiGoals()
      fetchKpiResults()
    } else {
      console.log('KPI 컴포넌트 - 프로젝트 ID가 없음:', project)
    }
  }, [project?.id, currentYear])

  useEffect(() => {
    setLoading(false)
  }, [kpiTypes, kpiGoals, kpiResults])

  // KPI 타입 생성/수정
  const handleTypeSubmit = async () => {
    try {
      if (!typeFormData.name) {
        toast.error('목표 타입 이름을 입력해주세요.')
        return
      }

      const response = await apiFetch('/api/kpi/types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          ...typeFormData
        })
      })

      if (response.ok) {
        toast.success('목표 타입이 저장되었습니다.')
        setShowTypeDialog(false)
        setTypeFormData({ name: "", description: "", unit: "" })
        setEditingType(null)
        fetchKpiTypes()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || '목표 타입 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('KPI 타입 저장 오류:', error)
      toast.error('목표 타입 저장 중 오류가 발생했습니다.')
    }
  }

  // KPI 목표 생성/수정
  const handleGoalSubmit = async () => {
    try {
      if (!goalFormData.kpiType || !goalFormData.targetValue) {
        toast.error('목표 타입과 목표값을 입력해주세요.')
        return
      }

      const url = editingGoal 
        ? `/api/kpi/goals/${editingGoal.id}`
        : '/api/kpi/goals'
      
      const method = editingGoal ? 'PUT' : 'POST'
      
      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          ...goalFormData,
          targetValue: parseInt(goalFormData.targetValue)
        })
      })

      if (response.ok) {
        toast.success('목표 목표가 저장되었습니다.')
        setShowGoalDialog(false)
        setGoalFormData({
          year: currentYear,
          kpiType: "",
          targetValue: "",
          description: ""
        })
        setEditingGoal(null)
        fetchKpiGoals()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || '목표 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('목표 저장 오류:', error)
      toast.error('목표 저장 중 오류가 발생했습니다.')
    }
  }

  // KPI 실적 생성/수정
  const handleResultSubmit = async () => {
    try {
      if (!resultFormData.kpiType || !resultFormData.actualValue) {
        toast.error('목표 타입과 실적값을 입력해주세요.')
        return
      }

      const url = editingResult 
        ? `/api/kpi/results/${editingResult.id}`
        : '/api/kpi/results'
      
      const method = editingResult ? 'PUT' : 'POST'
      
      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          ...resultFormData,
          actualValue: parseInt(resultFormData.actualValue)
        })
      })

      if (response.ok) {
        toast.success('목표 실적이 저장되었습니다.')
        setShowResultDialog(false)
        setResultFormData({
          year: currentYear,
          kpiType: "",
          actualValue: "",
          achievementDate: "",
          description: ""
        })
        setEditingResult(null)
        fetchKpiResults()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || '목표 실적 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('목표 실적 저장 오류:', error)
      toast.error('실적 저장 중 오류가 발생했습니다.')
    }
  }

  // KPI 목표 삭제
  const handleGoalDelete = async (goalId: number) => {
    if (!confirm('정말로 이 목표를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/kpi/goals/${goalId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('목표가 삭제되었습니다.')
        fetchKpiGoals()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || '목표 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('KPI 목표 삭제 오류:', error)
      toast.error('목표 삭제 중 오류가 발생했습니다.')
    }
  }

  // KPI 실적 삭제
  const handleResultDelete = async (resultId: number) => {
    if (!confirm('정말로 이 실적을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/kpi/results/${resultId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('실적이 삭제되었습니다.')
        fetchKpiResults()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || '실적 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('KPI 실적 삭제 오류:', error)
      toast.error('실적 삭제 중 오류가 발생했습니다.')
    }
  }

  // 편집 모드 시작
  const handleEditGoal = (goal: KpiGoal) => {
    setEditingGoal(goal)
    setGoalFormData({
      year: goal.year,
      kpiType: goal.kpi_type,
      targetValue: goal.target_value.toString(),
      description: goal.description || ""
    })
    setShowGoalDialog(true)
  }

  const handleEditResult = (result: KpiResult) => {
    setEditingResult(result)
    setResultFormData({
      year: result.year,
      kpiType: result.kpi_type,
      actualValue: result.actual_value.toString(),
      achievementDate: result.achievement_date ? result.achievement_date.split('T')[0] : "",
      description: result.description || ""
    })
    setShowResultDialog(true)
  }

  // 새 작성 모드 시작
  const handleNewType = () => {
    setEditingType(null)
    setTypeFormData({ name: "", description: "", unit: "" })
    setShowTypeDialog(true)
  }

  const handleNewGoal = () => {
    setEditingGoal(null)
    setGoalFormData({
      year: currentYear,
      kpiType: "",
      targetValue: "",
      description: ""
    })
    setShowGoalDialog(true)
  }

  const handleNewResult = () => {
    setEditingResult(null)
    setResultFormData({
      year: currentYear,
      kpiType: "",
      actualValue: "",
      achievementDate: "",
      description: ""
    })
    setShowResultDialog(true)
  }

  // KPI 타입별 목표값 가져오기
  const getGoalByType = (kpiType: string) => {
    return kpiGoals.find(goal => goal.kpi_type === kpiType)
  }

  // KPI 타입별 실적값 가져오기 (실제 DB 데이터 사용)
  const getResultByType = (kpiType: string) => {
    return kpiResults.find(result => result.kpi_type === kpiType)
  }

  // KPI 타입별 현재값 계산 (실제 실적 데이터 사용)
  const getCurrentValue = (kpiType: string) => {
    const result = getResultByType(kpiType)
    return result ? result.actual_value : 0
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">데이터를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI 타입 관리 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              목표 타입 관리
            </CardTitle>
            <Button onClick={handleNewType} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              목표 타입 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiTypes.map((type) => (
              <div key={type.idx} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{type.name}</h3>
                  <Badge variant="outline">{type.unit || '개'}</Badge>
                </div>
                {type.description && (
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  생성일: {new Date(type.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {kpiTypes.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                등록된 목표 타입이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI 목표 및 실적 관리 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              목표 및 실적 관리 ({currentYear}년)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={currentYear.toString()} onValueChange={(value) => setCurrentYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleNewGoal} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                목표 추가
              </Button>
              <Button onClick={handleNewResult} size="sm" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                실적 입력
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kpiTypes.map((type) => {
              const goal = getGoalByType(type.name)
              const result = getResultByType(type.name)
              const currentValue = getCurrentValue(type.name)
              const targetValue = goal?.target_value || 0
              const percentage = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0

              return (
                <div key={type.idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        목표: {targetValue}{type.unit || '개'} | 현재: {currentValue}{type.unit || '개'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {goal && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditGoal(goal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGoalDelete(goal.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {!goal && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGoalFormData({
                              year: currentYear,
                              kpiType: type.name,
                              targetValue: "",
                              description: ""
                            })
                            setShowGoalDialog(true)
                          }}
                        >
                          목표 설정
                        </Button>
                      )}
                      {result && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditResult(result)}
                            className="text-blue-600"
                          >
                            <Award className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResultDelete(result.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {!result && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setResultFormData({
                              year: currentYear,
                              kpiType: type.name,
                              actualValue: "",
                              achievementDate: "",
                              description: ""
                            })
                            setShowResultDialog(true)
                          }}
                        >
                          실적 입력
                        </Button>
                      )}
                    </div>
                  </div>
                  {goal && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>진행률</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                    </div>
                  )}
                  {result && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-800">실적: {result.actual_value}{type.unit || '개'}</span>
                        {result.achievement_date && (
                          <span className="text-xs text-blue-600">
                            달성일: {new Date(result.achievement_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {result.description && (
                        <p className="text-sm text-blue-700 mt-1">{result.description}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {kpiTypes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                목표 타입을 먼저 추가해주세요.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI 타입 추가/수정 다이얼로그 */}
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingType ? '목표 타입 수정' : '새 목표 타입 추가'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type-name">목표 타입명 *</Label>
              <Input
                id="type-name"
                value={typeFormData.name}
                onChange={(e) => setTypeFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="예: 논문, 특허, 학술대회"
              />
            </div>
            <div>
              <Label htmlFor="type-description">설명</Label>
              <Textarea
                id="type-description"
                value={typeFormData.description}
                onChange={(e) => setTypeFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="목표 타입에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="type-unit">단위</Label>
              <Input
                id="type-unit"
                value={typeFormData.unit}
                onChange={(e) => setTypeFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="예: 개, 건, %"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTypeDialog(false)}>
                취소
              </Button>
              <Button onClick={handleTypeSubmit}>
                {editingType ? '수정' : '추가'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KPI 목표 추가/수정 다이얼로그 */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? '목표 수정' : '새 목표 추가'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-year">연도 *</Label>
              <Select 
                value={goalFormData.year.toString()} 
                onValueChange={(value) => setGoalFormData(prev => ({ ...prev, year: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="goal-type">목표 타입 *</Label>
              <Select 
                value={goalFormData.kpiType} 
                onValueChange={(value) => setGoalFormData(prev => ({ ...prev, kpiType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="목표 타입을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {kpiTypes.map((type) => (
                    <SelectItem key={type.idx} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="goal-target">목표값 *</Label>
              <Input
                id="goal-target"
                type="number"
                value={goalFormData.targetValue}
                onChange={(e) => setGoalFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                placeholder="목표값을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="goal-description">설명</Label>
              <Textarea
                id="goal-description"
                value={goalFormData.description}
                onChange={(e) => setGoalFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="목표에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
                취소
              </Button>
              <Button onClick={handleGoalSubmit}>
                {editingGoal ? '수정' : '추가'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KPI 실적 추가/수정 다이얼로그 */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingResult ? '목표 실적 수정' : '새 목표 실적 입력'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="result-year">연도 *</Label>
              <Select 
                value={resultFormData.year.toString()} 
                onValueChange={(value) => setResultFormData(prev => ({ ...prev, year: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="result-type">목표 타입 *</Label>
              <Select 
                value={resultFormData.kpiType} 
                onValueChange={(value) => setResultFormData(prev => ({ ...prev, kpiType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="목표 타입을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {kpiTypes.map((type) => (
                    <SelectItem key={type.idx} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="result-actual">실적값 *</Label>
              <Input
                id="result-actual"
                type="number"
                value={resultFormData.actualValue}
                onChange={(e) => setResultFormData(prev => ({ ...prev, actualValue: e.target.value }))}
                placeholder="실적값을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="result-date">달성일</Label>
              <Input
                id="result-date"
                type="date"
                value={resultFormData.achievementDate}
                onChange={(e) => setResultFormData(prev => ({ ...prev, achievementDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="result-description">설명</Label>
              <Textarea
                id="result-description"
                value={resultFormData.description}
                onChange={(e) => setResultFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="실적에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowResultDialog(false)}>
                취소
              </Button>
              <Button onClick={handleResultSubmit}>
                {editingResult ? '수정' : '입력'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
