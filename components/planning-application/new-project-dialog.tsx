"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X } from "lucide-react"

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated: (projectData: any) => void
}

interface ProjectFormData {
  // 1단계: 참여유형
  participationType: "주관기관" | "참여기관" | ""

  // 2단계: 기본정보
  projectName: string
  leadOrganization: string
  principalInvestigator: string
  manager: string
  participatingOrganization: string
  participatingPI: string
  participatingManager: string

  // 3단계: 기간/예산
  announcementStartDate: string
  announcementEndDate: string
  leadingDepartment: string
  submissionTarget: string
  projectStartDate: string
  projectEndDate: string
  totalBudget: string

  // 4단계: 연구내용
  projectOverview: string
  businessGoals: string
  researchMethodology: string

  // 5단계: 성과목표
  expectedResults: string
  researchKPI: string
  expectedPatents: string
  expectedPapers: string
}

export function NewProjectDialog({ open, onOpenChange, onProjectCreated }: NewProjectDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormData>({
    participationType: "",
    projectName: "",
    leadOrganization: "",
    principalInvestigator: "",
    manager: "",
    participatingOrganization: "",
    participatingPI: "",
    participatingManager: "",
    announcementStartDate: "",
    announcementEndDate: "",
    leadingDepartment: "",
    submissionTarget: "",
    projectStartDate: "",
    projectEndDate: "",
    totalBudget: "",
    projectOverview: "",
    businessGoals: "",
    researchMethodology: "",
    expectedResults: "",
    researchKPI: "",
    expectedPatents: "",
    expectedPapers: "",
  })

  // 날짜 입력 핸들러 - 연도 6자리 문제 해결
  const handleDateChange = (field: keyof ProjectFormData, value: string) => {
    // 빈 값이면 그대로 설정
    if (!value) {
      setFormData(prev => ({ ...prev, [field]: value }));
      return;
    }

    // 8자리 숫자만 입력된 경우 자동으로 YYYY-MM-DD 형식으로 변환
    if (/^\d{8}$/.test(value)) {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      
      // 유효한 날짜인지 검증
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        const formattedValue = `${year}-${month}-${day}`;
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
        return;
      }
    }

    // 6자리 숫자 입력 시 (예: 202222) 자동으로 4자리 연도로 수정
    if (/^\d{6}$/.test(value)) {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const correctedValue = `${year}-${month}-`;
      setFormData(prev => ({ ...prev, [field]: correctedValue }));
      return;
    }

    // 4자리 숫자 입력 시 (예: 2024) 자동으로 하이픈 추가
    if (/^\d{4}$/.test(value)) {
      const correctedValue = `${value}-`;
      setFormData(prev => ({ ...prev, [field]: correctedValue }));
      return;
    }

    // YYYY-MM-DD 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      // 잘못된 형식이면 입력을 차단
      return;
    }

    // 연도가 4자리가 아닌 경우 수정
    const [year, month, day] = value.split('-');
    if (year.length !== 4) {
      // 연도가 4자리가 아니면 수정
      const correctedYear = year.padStart(4, '0').slice(0, 4);
      const correctedValue = `${correctedYear}-${month}-${day}`;
      setFormData(prev => ({ ...prev, [field]: correctedValue }));
      return;
    }

    // 유효한 날짜인지 검증
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 날짜 입력 필드 실시간 검증 및 수정
  const handleDateInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value;
    const field = input.name as keyof ProjectFormData;
    
    // 숫자만 입력된 경우 자동 형식 변환
    if (/^\d+$/.test(value)) {
      if (value.length === 4) {
        // 4자리 연도 입력 시 하이픈 추가
        const correctedValue = `${value}-`;
        setFormData(prev => ({ ...prev, [field]: correctedValue }));
        input.setSelectionRange(5, 5); // 하이픈 다음 위치로 커서 이동
        return;
      } else if (value.length === 6) {
        // 6자리 입력 시 (예: 202222) 4자리 연도 + 2자리 월로 변환
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const correctedValue = `${year}-${month}-`;
        setFormData(prev => ({ ...prev, [field]: correctedValue }));
        input.setSelectionRange(8, 8); // 일 입력 위치로 커서 이동
        return;
      } else if (value.length === 8) {
        // 8자리 입력 시 YYYY-MM-DD 형식으로 변환
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);
        const correctedValue = `${year}-${month}-${day}`;
        setFormData(prev => ({ ...prev, [field]: correctedValue }));
        input.setSelectionRange(correctedValue.length, correctedValue.length);
        return;
      }
    }
  };

  // 날짜 입력 필드 키 입력 제한 및 자동 포커스 이동
  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value;
    
    // 숫자, 하이픈, 백스페이스, 삭제, 화살표 키만 허용
    const allowedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '-', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Tab', 'Enter'
    ];
    
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }

    // 연도 입력 완료 시 자동으로 월 입력 필드로 이동
    if (e.key >= '0' && e.key <= '9') {
      const currentValue = value + e.key;
      
      // 연도 부분만 확인 (첫 번째 하이픈 이전)
      const yearPart = currentValue.split('-')[0];
      
      if (yearPart.length === 4) {
        // 연도가 4자리가 되면 자동으로 하이픈 추가하고 월 입력 필드로 포커스
        setTimeout(() => {
          const newValue = currentValue + '-';
          setFormData(prev => ({ ...prev, [input.name as keyof ProjectFormData]: newValue }));
          
          // 커서를 월 입력 필드로 이동 (하이픈 다음 위치)
          input.setSelectionRange(5, 5);
        }, 0);
      }

      // 8자리 숫자 입력 완료 시 자동으로 YYYY-MM-DD 형식으로 변환
      if (currentValue.length === 8 && /^\d{8}$/.test(currentValue)) {
        setTimeout(() => {
          const year = currentValue.substring(0, 4);
          const month = currentValue.substring(4, 6);
          const day = currentValue.substring(6, 8);
          
          // 유효한 날짜인지 검증
          const date = new Date(`${year}-${month}-${day}`);
          if (!isNaN(date.getTime())) {
            const formattedValue = `${year}-${month}-${day}`;
            setFormData(prev => ({ ...prev, [input.name as keyof ProjectFormData]: formattedValue }));
            
            // 커서를 끝에 위치
            input.setSelectionRange(formattedValue.length, formattedValue.length);
          }
        }, 0);
      }
    }
  };

  // 날짜 입력 필드 포커스 핸들러
  const handleDateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value;
    
    // 값이 없으면 연도 입력 필드에 포커스
    if (!value) {
      input.setSelectionRange(0, 0);
    } else {
      // 값이 있으면 적절한 위치에 포커스
      const parts = value.split('-');
      if (parts.length === 3) {
        if (parts[0].length < 4) {
          // 연도가 불완전하면 연도 끝에 포커스
          input.setSelectionRange(parts[0].length, parts[0].length);
        } else if (parts[1].length < 2) {
          // 월이 불완전하면 월 시작에 포커스
          input.setSelectionRange(5, 5);
        } else if (parts[2].length < 2) {
          // 일이 불완전하면 일 시작에 포커스
          input.setSelectionRange(8, 8);
        } else {
          // 모든 필드가 완성되면 끝에 포커스
          input.setSelectionRange(value.length, value.length);
        }
      }
    }
  };

  const steps = [
    { number: 1, title: "참여유형", completed: currentStep > 1 },
    { number: 2, title: "기본정보", completed: currentStep > 2 },
    { number: 3, title: "기간/예산", completed: currentStep > 3 },
    { number: 4, title: "연구내용", completed: currentStep > 4 },
    { number: 5, title: "성과목표", completed: currentStep > 5 },
  ]

  // 필수 필드 검증
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.participationType !== ""
      case 2:
        const basicRequired =
          formData.projectName && formData.leadOrganization && formData.principalInvestigator && formData.manager
        if (!basicRequired) return false

        // 참여기관이 입력된 경우 추가 필드 검증
        if (formData.participatingOrganization) {
          return !!(formData.participatingPI && formData.participatingManager)
        }
        return true
      case 3:
        return !!(
          formData.announcementStartDate &&
          formData.announcementEndDate &&
          formData.leadingDepartment &&
          formData.submissionTarget &&
          formData.projectStartDate &&
          formData.projectEndDate &&
          formData.totalBudget
        )
      case 4:
      case 5:
        return true // 선택사항
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    const projectData = {
      id: `PROJ-${Date.now()}`,
      projectName: formData.projectName,
      leadOrganization: formData.leadOrganization,
      principalInvestigator: formData.principalInvestigator,
      manager: formData.manager,
      participationType: formData.participationType === "주관기관" ? "주관" : "참여",
      status: "기획중" as const,
      startDate: formData.projectStartDate,
      endDate: formData.projectEndDate,
      budget: formData.totalBudget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onProjectCreated(projectData)
    onOpenChange(false)

    // 폼 초기화
    setCurrentStep(1)
    setFormData({
      participationType: "",
      projectName: "",
      leadOrganization: "",
      principalInvestigator: "",
      manager: "",
      participatingOrganization: "",
      participatingPI: "",
      participatingManager: "",
      announcementStartDate: "",
      announcementEndDate: "",
      leadingDepartment: "",
      submissionTarget: "",
      projectStartDate: "",
      projectEndDate: "",
      totalBudget: "",
      projectOverview: "",
      businessGoals: "",
      researchMethodology: "",
      expectedResults: "",
      researchKPI: "",
      expectedPatents: "",
      expectedPapers: "",
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
    setCurrentStep(1)
    setFormData({
      participationType: "",
      projectName: "",
      leadOrganization: "",
      principalInvestigator: "",
      manager: "",
      participatingOrganization: "",
      participatingPI: "",
      participatingManager: "",
      announcementStartDate: "",
      announcementEndDate: "",
      leadingDepartment: "",
      submissionTarget: "",
      projectStartDate: "",
      projectEndDate: "",
      totalBudget: "",
      projectOverview: "",
      businessGoals: "",
      researchMethodology: "",
      expectedResults: "",
      researchKPI: "",
      expectedPatents: "",
      expectedPapers: "",
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">참여 유형 선택</h3>
              <p className="text-sm text-muted-foreground mb-6">연구과제에서의 참여 형태를 선택해주세요.</p>
            </div>

            <RadioGroup
              value={formData.participationType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, participationType: value as "주관기관" | "참여기관" }))
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.participationType === "주관기관"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <RadioGroupItem value="주관기관" id="lead" className="sr-only" />
                  <label htmlFor="lead" className="cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          formData.participationType === "주관기관" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {formData.participationType === "주관기관" && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">주관기관</h4>
                        <p className="text-sm text-muted-foreground">연구과제를 주도하고 전체적인 관리를 담당합니다.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.participationType === "참여기관"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <RadioGroupItem value="참여기관" id="participant" className="sr-only" />
                  <label htmlFor="participant" className="cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          formData.participationType === "참여기관" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {formData.participationType === "참여기관" && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">참여기관</h4>
                        <p className="text-sm text-muted-foreground">주관기관과 협력하여 연구과제에 참여합니다.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">기본 정보</h3>
              <p className="text-sm text-muted-foreground mb-6">연구과제의 기본 정보를 입력해주세요.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">
                  프로젝트명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="projectName"
                  placeholder="예: AI 기반 의료진단 시스템 개발"
                  value={formData.projectName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadOrganization">
                    주관기관 명칭 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="leadOrganization"
                    placeholder="한양대학교에리카 산학협력단"
                    value={formData.leadOrganization}
                    onChange={(e) => setFormData((prev) => ({ ...prev, leadOrganization: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="participatingOrganization">참여기관 명칭</Label>
                  <Input
                    id="participatingOrganization"
                    placeholder="참여기관이 있는 경우 입력"
                    value={formData.participatingOrganization}
                    onChange={(e) => setFormData((prev) => ({ ...prev, participatingOrganization: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="principalInvestigator">
                    연구책임자명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="principalInvestigator"
                    placeholder="김연구"
                    value={formData.principalInvestigator}
                    onChange={(e) => setFormData((prev) => ({ ...prev, principalInvestigator: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="manager">
                    실무담당자명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="manager"
                    placeholder="박실무"
                    value={formData.manager}
                    onChange={(e) => setFormData((prev) => ({ ...prev, manager: e.target.value }))}
                  />
                </div>
              </div>

              {formData.participatingOrganization && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participatingPI">참여기관 연구책임자명</Label>
                    <Input
                      id="participatingPI"
                      placeholder="참여기관 연구책임자명"
                      value={formData.participatingPI}
                      onChange={(e) => setFormData((prev) => ({ ...prev, participatingPI: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="participatingManager">참여기관 실무담당자명</Label>
                    <Input
                      id="participatingManager"
                      placeholder="참여기관 실무담당자명"
                      value={formData.participatingManager}
                      onChange={(e) => setFormData((prev) => ({ ...prev, participatingManager: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">기간 및 예산</h3>
              <p className="text-sm text-muted-foreground mb-6">연구과제의 기간과 예산 정보를 입력해주세요.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="announcementStartDate">
                    공고시작일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="announcementStartDate"
                    name="announcementStartDate"
                    type="date"
                    value={formData.announcementStartDate}
                    onChange={(e) => handleDateChange("announcementStartDate", e.target.value)}
                    onKeyDown={handleDateKeyDown}
                    onFocus={handleDateFocus}
                    onInput={handleDateInput}
                    pattern="\d{4}-\d{2}-\d{2}"
                    maxLength={10}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <Label htmlFor="announcementEndDate">
                    공고종료일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="announcementEndDate"
                    name="announcementEndDate"
                    type="date"
                    value={formData.announcementEndDate}
                    onChange={(e) => handleDateChange("announcementEndDate", e.target.value)}
                    onKeyDown={handleDateKeyDown}
                    onFocus={handleDateFocus}
                    onInput={handleDateInput}
                    pattern="\d{4}-\d{2}-\d{2}"
                    maxLength={10}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadingDepartment">
                    주관부처 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="leadingDepartment"
                    placeholder="과학기술정보통신부"
                    value={formData.leadingDepartment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, leadingDepartment: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="submissionTarget">
                    제출처 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="submissionTarget"
                    placeholder="한국연구재단"
                    value={formData.submissionTarget}
                    onChange={(e) => setFormData((prev) => ({ ...prev, submissionTarget: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectStartDate">
                    사업시작일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectStartDate"
                    name="projectStartDate"
                    type="date"
                    value={formData.projectStartDate}
                    onChange={(e) => handleDateChange("projectStartDate", e.target.value)}
                    onKeyDown={handleDateKeyDown}
                    onFocus={handleDateFocus}
                    onInput={handleDateInput}
                    pattern="\d{4}-\d{2}-\d{2}"
                    maxLength={10}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <Label htmlFor="projectEndDate">
                    사업종료일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectEndDate"
                    name="projectEndDate"
                    type="date"
                    value={formData.projectEndDate}
                    onChange={(e) => handleDateChange("projectEndDate", e.target.value)}
                    onKeyDown={handleDateKeyDown}
                    onFocus={handleDateFocus}
                    onInput={handleDateInput}
                    pattern="\d{4}-\d{2}-\d{2}"
                    maxLength={10}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="totalBudget">
                  총 예산 (원) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalBudget"
                  placeholder="500000000"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData((prev) => ({ ...prev, totalBudget: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">연구 내용</h3>
              <p className="text-sm text-muted-foreground mb-6">연구과제의 상세 내용을 입력해주세요.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="projectOverview">프로젝트 개요</Label>
                <Textarea
                  id="projectOverview"
                  placeholder="인공지능 기술을 활용하여 의료진단의 정확도를 향상시키고, 진단 시간을 단축하는 시스템을 개발합니다..."
                  rows={4}
                  value={formData.projectOverview}
                  onChange={(e) => setFormData((prev) => ({ ...prev, projectOverview: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="businessGoals">업무목표</Label>
                <Textarea
                  id="businessGoals"
                  placeholder="• AI 기반 의료영상 분석 알고리즘 개발&#10;• 환자 데이터 통합 분석 시스템 구축&#10;• 의료진 진단 보조 인터페이스 개발&#10;• 임상 검증 및 성능 평가"
                  rows={4}
                  value={formData.businessGoals}
                  onChange={(e) => setFormData((prev) => ({ ...prev, businessGoals: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="researchMethodology">연구방법론</Label>
                <Textarea
                  id="researchMethodology"
                  placeholder="딥러닝 알고리즘 기반 의료 영상 분석, 환자 데이터 분석 등의 방법론을 설명해주세요..."
                  rows={4}
                  value={formData.researchMethodology}
                  onChange={(e) => setFormData((prev) => ({ ...prev, researchMethodology: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">성과 목표</h3>
              <p className="text-sm text-muted-foreground mb-6">연구과제의 기대성과와 목표를 입력해주세요.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="expectedResults">기대성과</Label>
                <Textarea
                  id="expectedResults"
                  placeholder="• 진단 정확도 15% 향상&#10;• 진단 시간 30% 단축&#10;• 의료진 업무 효율성 증대&#10;• 특허 출원 3건 이상"
                  rows={4}
                  value={formData.expectedResults}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expectedResults: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="researchKPI">연구성과(목표)</Label>
                <Textarea
                  id="researchKPI"
                  placeholder="논문 게재 5편, 특허 출원 3건, 기술이전 1건 등 구체적인 성과지표를 입력해주세요..."
                  rows={4}
                  value={formData.researchKPI}
                  onChange={(e) => setFormData((prev) => ({ ...prev, researchKPI: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedPatents">예상 특허 출원 건수</Label>
                  <Input
                    id="expectedPatents"
                    placeholder="3"
                    value={formData.expectedPatents}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expectedPatents: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedPapers">예상 논문 게재 건수</Label>
                  <Input
                    id="expectedPapers"
                    placeholder="5"
                    value={formData.expectedPapers}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expectedPapers: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">새 과제 기획</DialogTitle>
          <Button variant="ghost" size="sm" onClick={handleCancel} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* 단계 표시 */}
        <div className="flex items-center justify-center space-x-4 py-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.number === currentStep
                    ? "bg-blue-600 text-white"
                    : step.completed
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`ml-2 text-sm ${
                  step.number === currentStep
                    ? "text-blue-600 font-medium"
                    : step.completed
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${step.completed ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* 단계별 내용 */}
        <div className="py-6">{renderStepContent()}</div>

        {/* 버튼 */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            이전
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            {currentStep === 5 ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
                과제 생성
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!validateStep(currentStep)}>
                다음
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
