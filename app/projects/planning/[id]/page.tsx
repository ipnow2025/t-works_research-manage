"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  SaveIcon,
  UserPlusIcon,
  BuildingIcon,
  CalculatorIcon,
  SettingsIcon,
  UploadIcon,
  FileIcon,
  DownloadIcon,
  XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { apiFetch } from "@/lib/func"

export default function PlanningProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [showBudgetCalculator, setShowBudgetCalculator] = useState(false)
  const [showBudgetRatioSettings, setShowBudgetRatioSettings] = useState(false)
  const [showBudgetDetails, setShowBudgetDetails] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showAddOrganizationDialog, setShowAddOrganizationDialog] = useState(false)
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false)
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)
  const [selectedOrganizationType, setSelectedOrganizationType] = useState<"joint" | "consigned" | null>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<"main" | "joint" | "consigned">("main")
  const [selectedOrganizationIndex, setSelectedOrganizationIndex] = useState<number>(0)
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false)
  const [fileUploadType, setFileUploadType] = useState<"announcement" | "rfp" | "template" | null>(null)
  const [showAddBudgetItemDialog, setShowAddBudgetItemDialog] = useState(false)
  const [showEditBudgetItemDialog, setShowEditBudgetItemDialog] = useState(false)
  const [selectedBudgetItem, setSelectedBudgetItem] = useState<{ category: string; amount: number } | null>(null)
  const [newBudgetItem, setNewBudgetItem] = useState({ category: "", amount: 0 })
  const [showDocumentUploadDialog, setShowDocumentUploadDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [projectStatus, setProjectStatus] = useState("기획중")
  const [showStatusChangeConfirm, setShowStatusChangeConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState<any>(null)

  // 진행현황 관련 상태 변수
  const [completedTasks, setCompletedTasks] = useState([
    { id: 1, name: "공고문 및 RFP 분석", date: "2025-05-05" },
    { id: 2, name: "연구팀 구성 및 역할 분담", date: "2025-05-08" },
    { id: 3, name: "컨소시엄 구성 협의", date: "2025-05-12" },
  ])

  const [ongoingTasks, setOngoingTasks] = useState([
    { id: 4, name: "사업계획서 초안 작성", dueDate: "2025-05-25" },
    { id: 5, name: "예산 계획 수립", dueDate: "2025-05-20" },
  ])

  const [scheduledTasks, setScheduledTasks] = useState([
    { id: 6, name: "제출 서류 준비", startDate: "2025-05-26" },
    { id: 7, name: "사업계획서 최종 검토", startDate: "2025-06-05" },
    { id: 8, name: "제안서 제출", startDate: "2025-06-15" },
  ])

  const [showAddOngoingTaskDialog, setShowAddOngoingTaskDialog] = useState(false)
  const [showAddScheduledTaskDialog, setShowAddScheduledTaskDialog] = useState(false)
  const [newOngoingTask, setNewOngoingTask] = useState({ name: "", dueDate: "" })
  const [newScheduledTask, setNewScheduledTask] = useState({ name: "", startDate: "" })

  // 사업개요 상태
  const [projectOverview, setProjectOverview] = useState({
    title: "차세대 양자컴퓨팅 기술 개발",
    type: "기계제어비전업기술개발",
    status: "진행중",
    period: "33개월(총 3차년도)",
    budget: "178.9억원",
    category: "기계/소재 분야",
    subCategory: "양자컴퓨팅",
    projectType: "국고보조금",
    summary:
      "(기계제어비전업기술개발) 주력산업 생산활동의 기반인 제조장비와 산업용 기계 관련 핵심기술개발 및 실증지원을 통해 주력산업의 자립화와 고부가가치화 도모",
    subSummary: "(지원대상분야) 제조기반생산시스템, 기계제조장비첨증",
    supportScale: "178.9억원",
    supportProjects: "16개",
    supportForm: "연구개발과제별 특성에 따라 달라짐 (지원대상 사업 및 과제(RFP, 품목) 목록(첨부파일 참조))",
    supportPeriod: "33개월(총 3차년도)",
    developmentStages: [
      { stage: "1단계", period: "3년(33개월)" },
      { stage: "2단계", period: "-" },
    ],
    notes: [
      "'25년(1차년도)은 9개월 기준이며, 과제별 개발 기간은 첨부파일(공고계획서 또는 RFP) 참고",
      "기계제조장비첨증사업의 경우 '25년 개발기간은 12개월",
    ],
    announcementPeriod: "2025. 3. 19.(수) ~ 4. 17.(목)",
    applicationPeriod: "2025. 3. 19.(수) ~ 4. 17.(목)",
    applicationNote: "양식교부 및 접수안내 : 범부처통합연구지원시스템(www.iris.go.kr)",
    submissionPeriod: "2025. 3. 24.(월) ~ 4. 17.(목) 18:00까지",
    submissionNote: "접수마감시간 엄수 요망 (18시 이후 수정 또는 제출 불가)",
    files: {
      announcement: null,
      rfp: null,
      template: null,
    },
  })

  const [consortium, setConsortium] = useState({
    mainOrganization: {
      name: "한국과학기술연구원",
      role: "주관기관",
      members: [
        {
          name: "김연구",
          position: "책임연구원",
          role: "연구책임자",
          contact: "02-1234-5678",
          mobile: "010-1234-5678",
          email: "kim@kist.re.kr",
        },
        {
          name: "박실무",
          position: "선임연구원",
          role: "실무담당자",
          contact: "02-1234-5679",
          mobile: "010-2345-6789",
          email: "park@kist.re.kr",
        },
        {
          name: "이과학",
          position: "선임연구원",
          role: "알고리즘 개발",
          contact: "02-1234-5680",
          mobile: "010-3456-7890",
          email: "lee@kist.re.kr",
        },
      ],
    },
    jointOrganizations: [
      {
        name: "서울대학교",
        role: "공동연구개발기관",
        members: [
          {
            name: "정교수",
            position: "교수",
            role: "연구책임자",
            contact: "02-880-1234",
            mobile: "010-5678-9012",
            email: "jung@snu.ac.kr",
          },
          {
            name: "최실무",
            position: "연구교수",
            role: "실무담당자",
            contact: "02-880-1235",
            mobile: "010-6789-0123",
            email: "choi@snu.ac.kr",
          },
        ],
      },
    ],
    consignedOrganizations: [
      {
        name: "기술분석연구소",
        role: "위탁연구개발기관",
        members: [
          {
            name: "한분석",
            position: "수석연구원",
            role: "연구책임자",
            contact: "02-345-6789",
            mobile: "010-8901-2345",
            email: "han@tech-analysis.com",
          },
          {
            name: "김실무",
            position: "책임연구원",
            role: "실무담당자",
            contact: "02-345-6790",
            mobile: "010-9012-3456",
            email: "kim@tech-analysis.com",
          },
        ],
      },
    ],
  })

  const [budget, setBudget] = useState({
    total: 1789000000,
    government: 1431200000,
    private: {
      cash: 178900000,
      inkind: 178900000,
    },
    byOrganization: {
      main: 1252300000,
      joint: 357800000,
      consigned: 178900000,
    },
    details: [
      { category: "인건비", amount: 894500000 },
      { category: "연구시설·장비비", amount: 357800000 },
      { category: "연구활동비", amount: 268350000 },
      { category: "연구재료비", amount: 178900000 },
      { category: "위탁연구개발비", amount: 89450000 },
    ],
  })

  // 예산 계산기 상태
  const [calculatorState, setCalculatorState] = useState({
    organizationType: "public", // public 또는 private
    governmentFunding: 1431200000,
    totalBudget: 1789000000,
    privateFunding: {
      cash: 178900000,
      inkind: 178900000,
    },
    budgetRatio: {
      government: 80, // 국비 비율 (%)
      private: 20, // 민간부담금 비율 (%)
      privateCash: 50, // 민간부담금 중 현금 비율 (%)
      privateInkind: 50, // 민간부담금 중 현물 비율 (%)
    },
  })

  // 인건비 상세 내역
  const [personnelCosts, setPersonnelCosts] = useState([
    { name: "김연구", monthlySalary: 8000000, months: 12, participationRate: 30, total: 28800000 },
    { name: "이과학", monthlySalary: 6000000, months: 12, participationRate: 50, total: 36000000 },
  ])

  // 새 인건비 항목
  const [newPersonnelCost, setNewPersonnelCost] = useState({
    name: "",
    monthlySalary: 0,
    months: 12,
    participationRate: 100,
    total: 0,
  })

  // 기타 예산 항목 상세 내역
  const [otherBudgetDetails, setOtherBudgetDetails] = useState({
    연구시설·장비비: [
      { description: "양자컴퓨팅 시뮬레이터", amount: 200000000 },
      { description: "측정장비", amount: 157800000 },
    ],
    연구활동비: [
      { description: "국내출장비", amount: 50000000 },
      { description: "국외출장비", amount: 100000000 },
    ],
    연구재료비: [{ description: "시약 및 재료비", amount: 178900000 }],
    위탁연구개발비: [{ description: "위탁과제 1", amount: 89450000 }],
  })

  // 새 기관 정보
  const [newOrganization, setNewOrganization] = useState({
    name: "",
    role: "",
    members: [],
  })

  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    role: "",
    contact: "",
    mobile: "",
    email: "",
  })

  // 예산 직접 입력 상태
  const [directBudgetInput, setDirectBudgetInput] = useState({
    total: budget.total,
    government: budget.government,
    privateCash: budget.private.cash,
    privateInkind: budget.private.inkind,
    isDirectInput: false,
  })

  // 제출 서류 상태
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "연구개발계획서(필수)",
      format: "온라인 양식(hwp)",
      description: "- 기본정보에 대한 온라인 작성 입력이 완료되어야 함",
      status: "미첨부",
      responsible: "주관+공동연구개발기관 모두",
      action: "업로드",
    },
    {
      id: 2,
      name: "사업자등록증(필수)",
      format: "온라인 양식(PDF)",
      description: "- 원본 기관장 직인 날인 필",
      status: "미첨부",
      responsible: "주관+공동연구개발기관 모두",
      action: "업로드",
    },
    {
      id: 3,
      name: "연구개발기관 대표의 참여의사 확인서(필수)",
      format: "온라인 양식(PDF)",
      description: "- 모든 참여 연구개발기관의 장의 날인 또는 서명 기관 별 제출 기능",
      status: "미첨부",
      responsible: "주관+공동연구개발기관 모두",
      action: "업로드",
    },
    {
      id: 4,
      name: "(국외기관)참여기관 참여의사 확인서(비필수)",
      format: "온라인 양식(PDF로 스캔)",
      description: "",
      status: "해당사항 없음",
      responsible: "해당시 제출",
      action: "업로드",
    },
    {
      id: 5,
      name: "개인정보 및 과제정보 제공활용동의서(필수)",
      format: "온라인 양식(PDF로 스캔)",
      description: "",
      status: "미첨부",
      responsible: "주관+공동연구개발기관 모두",
      action: "업로드",
    },
  ])

  // 문서 목록
  const [projectDocuments, setProjectDocuments] = useState([
    {
      id: 1,
      name: "사업 공고문",
      author: "과학기술정보통신부",
      date: "2025-04-01",
      type: "pdf",
      url: "/documents/announcement.pdf",
      previewUrl: "/document-preview.png",
    },
    {
      id: 2,
      name: "RFP",
      author: "과학기술정보통신부",
      date: "2025-04-01",
      type: "pdf",
      url: "/documents/rfp.pdf",
      previewUrl: "/rfp-document-preview.png",
    },
    {
      id: 3,
      name: "사업계획서 초안",
      author: "김연구",
      date: "2025-05-10",
      type: "docx",
      url: "/documents/draft.docx",
      previewUrl: "/business-plan-draft.png",
    },
    {
      id: 4,
      name: "컨소시엄 협약서",
      author: "박실무",
      date: "2025-05-15",
      type: "pdf",
      url: "/documents/consortium.pdf",
      previewUrl: "/consortium-agreement.png",
    },
  ])

  // 새 문서 정보
  const [newDocument, setNewDocument] = useState({
    name: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    type: "pdf",
    file: null as File | null,
  })

  // 진행 중인 작업 추가
  const handleAddOngoingTask = () => {
    if (newOngoingTask.name && newOngoingTask.dueDate) {
      setOngoingTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newOngoingTask.name,
          dueDate: newOngoingTask.dueDate,
        },
      ])
      setNewOngoingTask({ name: "", dueDate: "" })
      setShowAddOngoingTaskDialog(false)
    }
  }

  // 예정된 작업 추가
  const handleAddScheduledTask = () => {
    if (newScheduledTask.name && newScheduledTask.startDate) {
      setScheduledTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newScheduledTask.name,
          startDate: newScheduledTask.startDate,
        },
      ])
      setNewScheduledTask({ name: "", startDate: "" })
      setShowAddScheduledTaskDialog(false)
    }
  }

  // 작업 완료 처리
  const handleCompleteTask = (taskId: number) => {
    const task = ongoingTasks.find((t) => t.id === taskId)
    if (task) {
      // 진행 중인 작업에서 제거
      setOngoingTasks((prev) => prev.filter((t) => t.id !== taskId))

      // 완료된 작업에 추가
      setCompletedTasks((prev) => [
        ...prev,
        {
          id: task.id,
          name: task.name,
          date: new Date().toISOString().split("T")[0],
        },
      ])
    }
  }

  // 작업 삭제
  const handleDeleteTask = (taskType: string, taskId: number) => {
    if (taskType === "ongoing") {
      setOngoingTasks((prev) => prev.filter((t) => t.id !== taskId))
    } else if (taskType === "scheduled") {
      setScheduledTasks((prev) => prev.filter((t) => t.id !== taskId))
    } else if (taskType === "completed") {
      setCompletedTasks((prev) => prev.filter((t) => t.id !== taskId))
    }
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.position && newMember.role) {
      if (selectedOrganization === "main") {
        setConsortium((prev) => ({
          ...prev,
          mainOrganization: {
            ...prev.mainOrganization,
            members: [...prev.mainOrganization.members, newMember],
          },
        }))
      } else if (selectedOrganization === "joint") {
        const updatedJointOrgs = [...consortium.jointOrganizations]
        updatedJointOrgs[selectedOrganizationIndex] = {
          ...updatedJointOrgs[selectedOrganizationIndex],
          members: [...updatedJointOrgs[selectedOrganizationIndex].members, newMember],
        }
        setConsortium((prev) => ({
          ...prev,
          jointOrganizations: updatedJointOrgs,
        }))
      } else if (selectedOrganization === "consigned") {
        const updatedConsignedOrgs = [...consortium.consignedOrganizations]
        updatedConsignedOrgs[selectedOrganizationIndex] = {
          ...updatedConsignedOrgs[selectedOrganizationIndex],
          members: [...updatedConsignedOrgs[selectedOrganizationIndex].members, newMember],
        }
        setConsortium((prev) => ({
          ...prev,
          consignedOrganizations: updatedConsignedOrgs,
        }))
      }
      setNewMember({ name: "", position: "", role: "", contact: "", mobile: "", email: "" })
      setShowAddMemberDialog(false)
    }
  }

  const handleDeleteMember = (orgType: string, orgIndex: number, memberIndex: number) => {
    if (orgType === "main") {
      setConsortium((prev) => ({
        ...prev,
        mainOrganization: {
          ...prev.mainOrganization,
          members: prev.mainOrganization.members.filter((_, i) => i !== memberIndex),
        },
      }))
    } else if (orgType === "joint") {
      const updatedJointOrgs = [...consortium.jointOrganizations]
      updatedJointOrgs[orgIndex] = {
        ...updatedJointOrgs[orgIndex],
        members: updatedJointOrgs[orgIndex].members.filter((_, i) => i !== memberIndex),
      }
      setConsortium((prev) => ({
        ...prev,
        jointOrganizations: updatedJointOrgs,
      }))
    } else if (orgType === "consigned") {
      const updatedConsignedOrgs = [...consortium.consignedOrganizations]
      updatedConsignedOrgs[orgIndex] = {
        ...updatedConsignedOrgs[orgIndex],
        members: updatedConsignedOrgs[orgIndex].members.filter((_, i) => i !== memberIndex),
      }
      setConsortium((prev) => ({
        ...prev,
        consignedOrganizations: updatedConsignedOrgs,
      }))
    }
  }

  const handleAddOrganization = () => {
    if (newOrganization.name) {
      if (selectedOrganizationType === "joint") {
        setConsortium((prev) => ({
          ...prev,
          jointOrganizations: [
            ...prev.jointOrganizations,
            {
              ...newOrganization,
              role: "공동연구개발기관",
              members: [],
            },
          ],
        }))
      } else if (selectedOrganizationType === "consigned") {
        setConsortium((prev) => ({
          ...prev,
          consignedOrganizations: [
            ...prev.consignedOrganizations,
            {
              ...newOrganization,
              role: "위탁연구개발기관",
              members: [],
            },
          ],
        }))
      }
      setNewOrganization({
        name: "",
        role: "",
        members: [],
      })
      setShowAddOrganizationDialog(false)
    }
  }

  const handleDeleteOrganization = (orgType: string, orgIndex: number) => {
    if (orgType === "joint") {
      setConsortium((prev) => ({
        ...prev,
        jointOrganizations: prev.jointOrganizations.filter((_, i) => i !== orgIndex),
      }))
    } else if (orgType === "consigned") {
      setConsortium((prev) => ({
        ...prev,
        consignedOrganizations: prev.consignedOrganizations.filter((_, i) => i !== orgIndex),
      }))
    }
  }

  // 예산 직접 입력 처리
  const handleDirectBudgetChange = (field: string, value: string) => {
    const numValue = Number(value) || 0
    setDirectBudgetInput((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  // 직접 입력한 예산 적용
  const applyDirectBudget = () => {
    setBudget((prev) => ({
      ...prev,
      total: directBudgetInput.total,
      government: directBudgetInput.government,
      private: {
        cash: directBudgetInput.privateCash,
        inkind: directBudgetInput.privateInkind,
      },
    }))
    setDirectBudgetInput((prev) => ({
      ...prev,
      isDirectInput: false,
    }))
  }

  // 사업비율 변경 처리
  const handleBudgetRatioChange = (field: string, value: string) => {
    const numValue = Number(value) || 0

    // 비율 업데이트
    setCalculatorState((prev) => {
      const newState = { ...prev }
      const newRatio = { ...prev.budgetRatio }

      if (field === "government") {
        newRatio.government = numValue
        newRatio.private = 100 - numValue
      } else if (field === "private") {
        newRatio.private = numValue
        newRatio.government = 100 - numValue
      } else if (field === "privateCash") {
        newRatio.privateCash = numValue
        newRatio.privateInkind = 100 - numValue
      } else if (field === "privateInkind") {
        newRatio.privateInkind = numValue
        newRatio.privateCash = 100 - numValue
      }

      newState.budgetRatio = newRatio
      return newState
    })
  }

  // 사업비율 적용
  const applyBudgetRatio = () => {
    const totalBudget = calculatorState.totalBudget
    const governmentFunding = Math.round(totalBudget * (calculatorState.budgetRatio.government / 100))
    const privateFunding = totalBudget - governmentFunding
    const privateCash = Math.round(privateFunding * (calculatorState.budgetRatio.privateCash / 100))
    const privateInkind = privateFunding - privateCash

    // 기관유형 변경 - 비율에 따라 자동 설정
    const newOrgType = calculatorState.budgetRatio.government === 100 ? "public" : "private"

    setCalculatorState((prev) => ({
      ...prev,
      organizationType: newOrgType,
      governmentFunding,
      privateFunding: {
        cash: privateCash,
        inkind: privateInkind,
      },
    }))

    setShowBudgetRatioSettings(false)
  }

  // 예산 계산기 함수
  const calculateBudget = () => {
    let totalBudget = 0
    const governmentFunding = calculatorState.governmentFunding
    let privateCash = 0
    let privateInkind = 0

    if (calculatorState.organizationType === "public") {
      // 공공기관: 국비 100%가 기본
      totalBudget = governmentFunding
    } else if (calculatorState.organizationType === "private") {
      // 민간기관: 국비 70%, 민간부담금 30% (현금 10%, 현물 90%)
      totalBudget = Math.round(governmentFunding / 0.7)
      const privateFunding = totalBudget - governmentFunding
      privateCash = Math.round(privateFunding * 0.1)
      privateInkind = Math.round(privateFunding * 0.9)
    }

    setCalculatorState((prev) => ({
      ...prev,
      totalBudget,
      privateFunding: {
        cash: privateCash,
        inkind: privateInkind,
      },
    }))
  }

  // 계산기 값을 예산에 적용
  const applyCalculatedBudget = () => {
    setBudget((prev) => ({
      ...prev,
      total: calculatorState.totalBudget,
      government: calculatorState.governmentFunding,
      private: {
        cash: calculatorState.privateFunding.cash,
        inkind: calculatorState.privateFunding.inkind,
      },
    }))

    setShowBudgetCalculator(false)
  }

  // 인건비 계산 함수
  const calculatePersonnelCost = (salary: number, months: number, rate: number) => {
    return Math.round((salary * months * rate) / 100)
  }

  // 새 인건비 항목 추가
  const handleAddPersonnelCost = () => {
    if (newPersonnelCost.name && newPersonnelCost.monthlySalary > 0) {
      const total = calculatePersonnelCost(
        newPersonnelCost.monthlySalary,
        newPersonnelCost.months,
        newPersonnelCost.participationRate,
      )
      setPersonnelCosts((prev) => [
        ...prev,
        {
          ...newPersonnelCost,
          total,
        },
      ])
      setNewPersonnelCost({
        name: "",
        monthlySalary: 0,
        months: 12,
        participationRate: 100,
        total: 0,
      })
    }
  }

  // 인건비 항목 삭제
  const handleDeletePersonnelCost = (index: number) => {
    setPersonnelCosts((prev) => prev.filter((_, i) => i !== index))
  }

  // 기타 예산 항목 추가
  const handleAddBudgetDetail = (category: string, description: string, amount: number) => {
    if (description && amount > 0) {
      setOtherBudgetDetails((prev) => ({
        ...prev,
        [category]: [...prev[category as keyof typeof prev], { description, amount }],
      }))
    }
  }

  // 기타 예산 항목 삭제
  const handleDeleteBudgetDetail = (category: string, index: number) => {
    setOtherBudgetDetails((prev) => {
      const updatedCategory = [...prev[category as keyof typeof prev]]
      updatedCategory.splice(index, 1)
      return {
        ...prev,
        [category]: updatedCategory,
      }
    })
  }

  // 총 인건비 계산
  const totalPersonnelCost = personnelCosts.reduce((sum, item) => sum + item.total, 0)

  // 각 카테고리별 총액 계산
  const calculateCategoryTotal = (category: string) => {
    return otherBudgetDetails[category as keyof typeof otherBudgetDetails].reduce((sum, item) => sum + item.amount, 0)
  }

  // 사업개요 수정 처리
  const handleOverviewChange = (field: string, value: string) => {
    setProjectOverview((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 계산기 입력값 변경 처리
  const handleCalculatorChange = (field: string, value: string) => {
    const numValue = Number(value.replace(/,/g, "")) || 0

    setCalculatorState((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  // 계산기 기관 유형 변경
  const handleOrgTypeChange = (value: string) => {
    setCalculatorState((prev) => ({
      ...prev,
      organizationType: value,
    }))
  }

  // 제출 서류 상태 변경
  const handleDocumentStatusChange = (id: number, status: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, status } : doc)))
  }

  // 문서 추가 처리
  const handleAddDocument = () => {
    if (newDocument.name && newDocument.author) {
      const newId = Math.max(...projectDocuments.map((doc) => doc.id), 0) + 1

      // 실제 구현에서는 파일 업로드 처리 후 URL을 받아와야 함
      const fileType = newDocument.type
      const previewUrl = `/placeholder.svg?height=800&width=600&query=${encodeURIComponent(newDocument.name)}`

      setProjectDocuments((prev) => [
        ...prev,
        {
          id: newId,
          name: newDocument.name,
          author: newDocument.author,
          date: newDocument.date,
          type: fileType,
          url: `/documents/document-${newId}.${fileType}`,
          previewUrl,
        },
      ])

      setNewDocument({
        name: "",
        author: "",
        date: new Date().toISOString().split("T")[0],
        type: "pdf",
        file: null,
      })

      setShowAddDocumentDialog(false)
    }
  }

  // 문서 미리보기
  const handleDocumentPreview = (document: any) => {
    setSelectedDocument(document)
    setShowDocumentPreview(true)
  }

  // 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && fileUploadType) {
      // 실제 구현에서는 파일 업로드 처리 후 URL을 받아와야 함
      setProjectOverview((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          [fileUploadType]: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
          },
        },
      }))
      setShowFileUploadDialog(false)
    }
  }

  // 문서 파일 선택 처리
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewDocument((prev) => ({
        ...prev,
        file,
        type: file.name.split(".").pop()?.toLowerCase() || "pdf",
      }))
    }
  }

  // 파일 업로드 다이얼로그 열기
  const openFileUploadDialog = (type: "announcement" | "rfp" | "template") => {
    setFileUploadType(type)
    setShowFileUploadDialog(true)
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }, 100)
  }

  // 비목별 예산 추가 함수
  const handleAddBudgetItem = () => {
    if (newBudgetItem.category && newBudgetItem.amount > 0) {
      setBudget((prev) => ({
        ...prev,
        details: [...prev.details, newBudgetItem],
      }))
      setNewBudgetItem({ category: "", amount: 0 })
      setShowAddBudgetItemDialog(false)
    }
  }

  // 비목별 예산 수정 함수
  const handleEditBudgetItem = () => {
    if (selectedBudgetItem && selectedBudgetItem.category && selectedBudgetItem.amount > 0) {
      setBudget((prev) => ({
        ...prev,
        details: prev.details.map((item) =>
          item.category === selectedBudgetItem.category ? selectedBudgetItem : item,
        ),
      }))
      setSelectedBudgetItem(null)
      setShowEditBudgetItemDialog(false)
    }
  }

  // 비목별 예산 삭제 함수
  const handleDeleteBudgetItem = (category: string) => {
    setBudget((prev) => ({
      ...prev,
      details: prev.details.filter((item) => item.category !== category),
    }))
  }

  // 문서 업로드 처리 함수
  const handleDocumentUpload = () => {
    if (selectedDocument) {
      setDocuments((prev) => prev.map((doc) => (doc.id === selectedDocument.id ? { ...doc, status: "완료" } : doc)))
      setSelectedDocument(null)
      setShowDocumentUploadDialog(false)
    }
  }

  // 프로젝트 상태 변경 함수
  const handleCompleteProject = () => {
    setShowStatusChangeConfirm(true)
  }

  // 프로젝트 상태 변경 확인 함수
  const confirmStatusChange = () => {
    setProjectStatus("신청완료")
    setShowStatusChangeConfirm(false)
  }

  // API에서 프로젝트 데이터 가져오기
  const fetchProjectData = async () => {
    if (!projectId) return
    
    try {
      setLoading(true)
      const response = await apiFetch(`/api/project-planning/${projectId}`)
      const result = await response.json()
            
      if (result.success) {
        setProjectData(result.data)
        setProjectStatus(result.data.status || "기획중")
        
        // 컨소시엄 구성원 데이터 가져오기
        await fetchConsortiumMembers(result.data.id)
      } else {
        console.error('프로젝트 데이터 조회 실패:', result.error)
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 컨소시엄 구성원 데이터 가져오기
  const fetchConsortiumMembers = async (projectId: number) => {
    try {
      const response = await apiFetch(`/api/project-consortium-members?projectId=${projectId}`)
      const result = await response.json()
            
      if (result.success) {
        // 기관별로 구성원 그룹화
        const membersByOrg = result.data.reduce((acc: any, member: any) => {
          const orgId = member.organization_id
          if (!acc[orgId]) {
            acc[orgId] = []
          }
          acc[orgId].push({
            id: member.id,
            name: member.member_name,
            position: member.position,
            role: member.role,
            contact: member.phone,
            mobile: member.mobile,
            email: member.email
          })
          return acc
        }, {})
                
        // 프로젝트 데이터의 컨소시엄 기관에 구성원 추가
        setProjectData((prev: any) => {
          if (prev?.consortium_organizations) {
            const updatedConsortiumOrgs = prev.consortium_organizations.map((org: any) => ({
              ...org,
              members: membersByOrg[org.id] || []
            }))
            return {
              ...prev,
              consortium_organizations: updatedConsortiumOrgs
            }
          }
          return prev
        })
      } else {
        console.error('컨소시엄 구성원 조회 실패:', result.error)
      }
    } catch (error) {
      console.error('컨소시엄 구성원 API 호출 오류:', error)
    }
  }

  // 연구자 추가
  const handleAddResearcher = async (organizationId: number) => {
    if (!newMember.name || !newMember.position || !newMember.role) {
      alert('필수 정보를 입력해주세요.')
      return
    }

    try {
      const response = await apiFetch('/api/project-consortium-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          projectPlanningId: parseInt(projectId),
          memberName: newMember.name,
          position: newMember.position,
          role: newMember.role,
          phone: newMember.contact,
          mobile: newMember.mobile,
          email: newMember.email
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // 성공 시 구성원 목록 새로고침
        await fetchConsortiumMembers(parseInt(projectId))
        setNewMember({ name: "", position: "", role: "", contact: "", mobile: "", email: "" })
        setShowAddMemberDialog(false)
      } else {
        alert('연구자 추가 실패: ' + result.error)
      }
    } catch (error) {
      console.error('연구자 추가 오류:', error)
      alert('연구자 추가 중 오류가 발생했습니다.')
    }
  }

  // 연구자 삭제
  const handleDeleteResearcher = async (memberId: number) => {
    if (!confirm('정말로 이 연구자를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/project-consortium-members?id=${memberId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        // 성공 시 구성원 목록 새로고침
        await fetchConsortiumMembers(parseInt(projectId))
      } else {
        alert('연구자 삭제 실패: ' + result.error)
      }
    } catch (error) {
      console.error('연구자 삭제 오류:', error)
      alert('연구자 삭제 중 오류가 발생했습니다.')
    }
  }

  // 페이지 로드 시 프로젝트 데이터 가져오기
  useEffect(() => {
    fetchProjectData()
  }, [projectId])

  return (
    <div className="p-6 space-y-6">
      {/* 디버그 정보 */}
      <div className="bg-yellow-100 p-2 rounded text-sm">
        <div>Debug: projectId = {projectId}</div>
        <div>Debug: loading = {loading ? 'true' : 'false'}</div>
        <div>Debug: projectData = {projectData ? '있음' : '없음'}</div>
        {projectData && <div>Debug: consortium_organizations = {projectData.consortium_organizations?.length || 0}개</div>}
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {projectData?.project_name || '프로젝트 정보를 불러오는 중...'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{projectData?.department || '미지정'}</Badge>
            <Badge variant="secondary">{projectStatus}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                저장
              </>
            ) : (
              <>
                <PencilIcon className="h-4 w-4 mr-2" />
                수정
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">사업개요</TabsTrigger>
          <TabsTrigger value="progress">진행현황</TabsTrigger>
          <TabsTrigger value="consortium">컨소시엄</TabsTrigger>
          <TabsTrigger value="budget">예산</TabsTrigger>
          <TabsTrigger value="documents-prep">제출서류준비</TabsTrigger>
          <TabsTrigger value="documents">문서</TabsTrigger>
        </TabsList>

        {/* 사업개요 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. 사업개요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1-1. 사업목적</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-md bg-gray-50 whitespace-pre-wrap">
                    <p className="mb-2">○ {projectOverview.summary}</p>
                    <p>- {projectOverview.subSummary}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">1-2. 연구개발비 지원 규모 및 기간</h3>
                <Table>
                  <TableBody>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium text-center border">세부사업명</TableCell>
                      <TableCell className="text-center border" colSpan={3}>
                        {projectOverview.type}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium text-center border">공고예산</TableCell>
                      <TableCell className="text-center border" colSpan={3}>
                        {projectOverview.supportScale}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium text-center border">신규 지원 연구개발과제</TableCell>
                      <TableCell className="text-center border" colSpan={3}>
                        {projectOverview.supportProjects}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium text-center border">지원규모</TableCell>
                      <TableCell className="text-center border" colSpan={3}>
                        {projectOverview.supportForm}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium text-center border">지원기간</TableCell>
                      <TableCell className="text-center border" colSpan={3}>
                        {projectOverview.supportPeriod}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-4">
                  <Table>
                    <TableHeader className="bg-blue-50">
                      <TableRow>
                        <TableHead className="text-center border">개발기간</TableHead>
                        <TableHead className="text-center border" colSpan={2}>
                          개발단계 및 연차
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-center border font-medium" rowSpan={2}>
                          {projectOverview.period}
                        </TableCell>
                        <TableCell className="text-center border font-medium">1단계</TableCell>
                        <TableCell className="text-center border">
                          {projectOverview.developmentStages[0].period}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-center border font-medium">2단계</TableCell>
                        <TableCell className="text-center border">
                          {projectOverview.developmentStages[1].period}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  {projectOverview.notes.map((note, index) => (
                    <p key={index}>* {note}</p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">1-3. 공고 및 접수 일정</h3>
                <Table>
                  <TableBody>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium text-center border">구분</TableCell>
                      <TableCell className="text-center border">기간</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-center border">공고기간</TableCell>
                      <TableCell className="border">
                        <p>○ {projectOverview.announcementPeriod}</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-center border">신청서 및 관련 양식 교부</TableCell>
                      <TableCell className="border">
                        <p>○ {projectOverview.applicationPeriod}</p>
                        <p>○ {projectOverview.applicationNote}</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-center border">접수기간</TableCell>
                      <TableCell className="border">
                        <p>○ {projectOverview.submissionPeriod}</p>
                        <p>○ {projectOverview.submissionNote}</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">공고문</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {projectOverview.files.announcement ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm truncate max-w-[150px]">
                            {(projectOverview.files.announcement as any)?.name}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm">파일이 없습니다</div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openFileUploadDialog("announcement")}
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      업로드
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">RFP</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {projectOverview.files.rfp ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm truncate max-w-[150px]">{(projectOverview.files.rfp as any)?.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm">파일이 없습니다</div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => openFileUploadDialog("rfp")}>
                      <UploadIcon className="h-4 w-4 mr-2" />
                      업로드
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">사업계획서 양식</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {projectOverview.files.template ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm truncate max-w-[150px]">{(projectOverview.files.template as any)?.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm">파일이 없습니다</div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openFileUploadDialog("template")}
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      업로드
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 진행현황 탭 */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>사업계획 수립현황</CardTitle>
              <CardDescription>전체 진행률: 45%</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={45} className="h-2 mb-6" />

              <div className="space-y-6">
                {/* 완료된 작업 */}
                <div>
                  <h3 className="text-lg font-medium mb-2">완료된 작업</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">상태</TableHead>
                        <TableHead>작업명</TableHead>
                        <TableHead className="w-[150px]">완료일</TableHead>
                        {isEditing && <TableHead className="w-[100px]">관리</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              완료
                            </Badge>
                          </TableCell>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.date}</TableCell>
                          {isEditing && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask("completed", task.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {completedTasks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isEditing ? 4 : 3} className="text-center text-muted-foreground">
                            완료된 작업이 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* 진행 중인 작업 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">진행 중인 작업</h3>
                    {isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setShowAddOngoingTaskDialog(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        추가
                      </Button>
                    )}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">상태</TableHead>
                        <TableHead>작업명</TableHead>
                        <TableHead className="w-[150px]">예상 완료일</TableHead>
                        <TableHead className="w-[150px]">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ongoingTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              진행중
                            </Badge>
                          </TableCell>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleCompleteTask(task.id)}>
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                완료
                              </Button>
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTask("ongoing", task.id)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {ongoingTasks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            진행 중인 작업이 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* 예정된 작업 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">예정된 작업</h3>
                    {isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setShowAddScheduledTaskDialog(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        추가
                      </Button>
                    )}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">상태</TableHead>
                        <TableHead>작업명</TableHead>
                        <TableHead className="w-[150px]">시작 예정일</TableHead>
                        {isEditing && <TableHead className="w-[100px]">관리</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              예정
                            </Badge>
                          </TableCell>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.startDate}</TableCell>
                          {isEditing && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask("scheduled", task.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      {scheduledTasks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isEditing ? 4 : 3} className="text-center text-muted-foreground">
                            예정된 작업이 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 진행 중인 작업 추가 다이얼로그 */}
          <Dialog open={showAddOngoingTaskDialog} onOpenChange={setShowAddOngoingTaskDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>진행 중인 작업 추가</DialogTitle>
                <DialogDescription>현재 진행 중인 작업을 추가합니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ongoing-task-name">작업명</Label>
                  <Input
                    id="ongoing-task-name"
                    placeholder="작업 이름을 입력하세요"
                    value={newOngoingTask.name}
                    onChange={(e) => setNewOngoingTask({ ...newOngoingTask, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ongoing-task-due-date">예상 완료일</Label>
                  <Input
                    id="ongoing-task-due-date"
                    type="date"
                    value={newOngoingTask.dueDate}
                    onChange={(e) => setNewOngoingTask({ ...newOngoingTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddOngoingTaskDialog(false)}>
                  취소
                </Button>
                <Button onClick={handleAddOngoingTask}>추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 예정된 작업 추가 다이얼로그 */}
          <Dialog open={showAddScheduledTaskDialog} onOpenChange={setShowAddScheduledTaskDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>예정된 작업 추가</DialogTitle>
                <DialogDescription>앞으로 예정된 작업을 추가합니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled-task-name">작업명</Label>
                  <Input
                    id="scheduled-task-name"
                    placeholder="작업 이름을 입력하세요"
                    value={newScheduledTask.name}
                    onChange={(e) => setNewScheduledTask({ ...newScheduledTask, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled-task-start-date">시작 예정일</Label>
                  <Input
                    id="scheduled-task-start-date"
                    type="date"
                    value={newScheduledTask.startDate}
                    onChange={(e) => setNewScheduledTask({ ...newScheduledTask, startDate: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddScheduledTaskDialog(false)}>
                  취소
                </Button>
                <Button onClick={handleAddScheduledTask}>추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 컨소시엄 탭 */}
        <TabsContent value="consortium" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>사업추진체계</CardTitle>
              <CardDescription>주관기관, 공동연구개발기관, 위탁연구개발기관으로 구성된 컨소시엄</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-lg">데이터를 불러오는 중...</div>
                </div>
              ) : projectData?.consortium_organizations && projectData.consortium_organizations.length > 0 ? (
                <div className="space-y-6">
                  {projectData.consortium_organizations.map((org: any, orgIndex: number) => (
                    <div key={org.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{org.organization_type}</h3>
                      </div>

                      <Card className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label>기관명</Label>
                              <div className="mt-1 p-2 border rounded-md bg-gray-50">
                                {org.organization_name}
                              </div>
                            </div>
                            <div>
                              <Label>역할 설명</Label>
                              <div className="mt-1 p-2 border rounded-md bg-gray-50">
                                {org.role_description || '-'}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <Label>책임자 및 담당자</Label>
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrganizationIndex(orgIndex)
                                    setShowAddMemberDialog(true)
                                  }}
                                >
                                  <UserPlusIcon className="h-4 w-4 mr-2" />
                                  연구자 추가
                                </Button>
                              )}
                            </div>

                            <div className="overflow-auto max-h-[300px]">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>이름</TableHead>
                                    <TableHead>직위</TableHead>
                                    <TableHead>역할</TableHead>
                                    <TableHead>연락처</TableHead>
                                    <TableHead>이메일</TableHead>
                                    {isEditing && <TableHead className="w-[80px]">관리</TableHead>}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {org.members && org.members.length > 0 ? (
                                    org.members.map((member: any, memberIndex: number) => (
                                      <TableRow key={member.id}>
                                        <TableCell>{member.name}</TableCell>
                                        <TableCell>{member.position}</TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{member.contact}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        {isEditing && (
                                          <TableCell>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleDeleteResearcher(member.id)}
                                            >
                                              <TrashIcon className="h-4 w-4" />
                                            </Button>
                                          </TableCell>
                                        )}
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={isEditing ? 6 : 5} className="text-center text-muted-foreground">
                                        등록된 연구자가 없습니다.
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">컨소시엄 구성 요약</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">총 참여기관:</span>
                        <span className="ml-2 font-medium">{projectData.consortium_organizations.length}개</span>
                      </div>
                      <div>
                        <span className="text-gray-600">주관기관:</span>
                        <span className="ml-2 font-medium">
                          {projectData.consortium_organizations.filter((org: any) => org.organization_type === '주관기관').length}개
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">참여기관:</span>
                        <span className="ml-2 font-medium">
                          {projectData.consortium_organizations.filter((org: any) => org.organization_type !== '주관기관').length}개
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BuildingIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">등록된 컨소시엄 구성이 없습니다</h3>
                  <p className="text-gray-500 mb-4">프로젝트에 참여하는 기관들을 등록해주세요.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 연구자 추가 다이얼로그 */}
          <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>연구자 추가</DialogTitle>
                <DialogDescription>새로운 연구자를 추가합니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name">이름 *</Label>
                  <Input
                    id="member-name"
                    placeholder="이름을 입력하세요"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-position">직위 *</Label>
                  <Input
                    id="member-position"
                    placeholder="직위를 입력하세요"
                    value={newMember.position}
                    onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-role">역할 *</Label>
                  <Input
                    id="member-role"
                    placeholder="역할을 입력하세요"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-contact">연락처</Label>
                  <Input
                    id="member-contact"
                    placeholder="연락처를 입력하세요"
                    value={newMember.contact}
                    onChange={(e) => setNewMember({ ...newMember, contact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-mobile">휴대폰</Label>
                  <Input
                    id="member-mobile"
                    placeholder="휴대폰 번호를 입력하세요"
                    value={newMember.mobile}
                    onChange={(e) => setNewMember({ ...newMember, mobile: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email">이메일</Label>
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                  취소
                </Button>
                <Button onClick={() => {
                  if (projectData?.consortium_organizations && projectData.consortium_organizations[selectedOrganizationIndex]) {
                    handleAddResearcher(projectData.consortium_organizations[selectedOrganizationIndex].id)
                  }
                }}>
                  추가
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 예산 탭 */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>예산 정보</CardTitle>
                  <CardDescription>총 사업비 및 세부 예산 내역</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowBudgetCalculator(true)}>
                    <CalculatorIcon className="h-4 w-4 mr-2" />
                    사업비 계산기
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>총 사업비</Label>
                    <div className="mt-1 p-2 border rounded-md bg-gray-50 font-semibold">
                      {budget.total.toLocaleString()}원
                    </div>
                  </div>
                  <div>
                    <Label>국비</Label>
                    <div className="mt-1 p-2 border rounded-md bg-gray-50">{budget.government.toLocaleString()}원</div>
                    <div className="mt-1 text-sm text-gray-500">
                      ({((budget.government / budget.total) * 100).toFixed(1)}%)
                    </div>
                  </div>
                  <div>
                    <Label>민간부담금(현금)</Label>
                    <div className="mt-1 p-2 border rounded-md bg-gray-50">
                      {budget.private.cash.toLocaleString()}원
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      ({((budget.private.cash / budget.total) * 100).toFixed(1)}%)
                    </div>
                  </div>
                  <div>
                    <Label>민간부담금(현물)</Label>
                    <div className="mt-1 p-2 border rounded-md bg-gray-50">
                      {budget.private.inkind.toLocaleString()}원
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      ({((budget.private.inkind / budget.total) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">기관별 사업비</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>기관</TableHead>
                        <TableHead className="text-right">금액</TableHead>
                        <TableHead className="text-right">비율</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>주관기관 ({consortium.mainOrganization.name})</TableCell>
                        <TableCell className="text-right">{budget.byOrganization.main.toLocaleString()}원</TableCell>
                        <TableCell className="text-right">
                          {((budget.byOrganization.main / budget.total) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>공동연구개발기관</TableCell>
                        <TableCell className="text-right">{budget.byOrganization.joint.toLocaleString()}원</TableCell>
                        <TableCell className="text-right">
                          {((budget.byOrganization.joint / budget.total) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>위탁연구개발기관</TableCell>
                        <TableCell className="text-right">
                          {budget.byOrganization.consigned.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-right">
                          {((budget.byOrganization.consigned / budget.total) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">비목별 예산</h3>
                    {isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setShowAddBudgetItemDialog(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        항목 추가
                      </Button>
                    )}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>비목</TableHead>
                        <TableHead className="text-right">금액</TableHead>
                        <TableHead className="text-right">비율</TableHead>
                        {isEditing && <TableHead className="w-[120px]">관리</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {budget.details.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">{item.amount.toLocaleString()}원</TableCell>
                          <TableCell className="text-right">
                            {((item.amount / budget.total) * 100).toFixed(1)}%
                          </TableCell>
                          {isEditing && (
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedBudgetItem(item)
                                    setShowEditBudgetItemDialog(true)
                                  }}
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteBudgetItem(item.category)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 사업비 계산기 다이얼로그 */}
          <Dialog open={showBudgetCalculator} onOpenChange={setShowBudgetCalculator}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>사업비 계산기</DialogTitle>
                <DialogDescription>국비 금액을 입력하면 총 사업비와 민간부담금이 자동 계산됩니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label>기관 유형</Label>
                    <RadioGroup
                      value={calculatorState.organizationType}
                      onValueChange={handleOrgTypeChange}
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">공공기관 (국비 100%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">민간기관 (국비 70%, 민간 30%)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="government-funding">국비 (원)</Label>
                      <Input
                        id="government-funding"
                        value={calculatorState.governmentFunding.toLocaleString()}
                        onChange={(e) => handleCalculatorChange("governmentFunding", e.target.value)}
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <Button onClick={calculateBudget}>계산하기</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>총 사업비 (원)</Label>
                      <div className="p-2 border rounded-md bg-gray-50 font-semibold">
                        {calculatorState.totalBudget.toLocaleString()}원
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>국비 (원)</Label>
                      <div className="p-2 border rounded-md bg-gray-50">
                        {calculatorState.governmentFunding.toLocaleString()}원
                        {calculatorState.totalBudget > 0 && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({((calculatorState.governmentFunding / calculatorState.totalBudget) * 100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>민간부담금(현금) (원)</Label>
                      <div className="p-2 border rounded-md bg-gray-50">
                        {calculatorState.privateFunding.cash.toLocaleString()}원
                        {calculatorState.totalBudget > 0 && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({((calculatorState.privateFunding.cash / calculatorState.totalBudget) * 100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>민간부담금(현물) (원)</Label>
                      <div className="p-2 border rounded-md bg-gray-50">
                        {calculatorState.privateFunding.inkind.toLocaleString()}원
                        {calculatorState.totalBudget > 0 && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({((calculatorState.privateFunding.inkind / calculatorState.totalBudget) * 100).toFixed(1)}
                            %)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">비율 설정</h3>
                    <Button variant="outline" size="sm" onClick={() => setShowBudgetRatioSettings(true)}>
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      비율 설정
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>국비 비율</Label>
                      <div className="p-2 border rounded-md bg-gray-50">{calculatorState.budgetRatio.government}%</div>
                    </div>
                    <div className="space-y-2">
                      <Label>민간부담금 비율</Label>
                      <div className="p-2 border rounded-md bg-gray-50">{calculatorState.budgetRatio.private}%</div>
                    </div>
                    <div className="space-y-2">
                      <Label>민간부담금 중 현금 비율</Label>
                      <div className="p-2 border rounded-md bg-gray-50">{calculatorState.budgetRatio.privateCash}%</div>
                    </div>
                    <div className="space-y-2">
                      <Label>민간부담금 중 현물 비율</Label>
                      <div className="p-2 border rounded-md bg-gray-50">
                        {calculatorState.budgetRatio.privateInkind}%
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>직접 입력</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="direct-total">총 사업비 (원)</Label>
                        <Input
                          id="direct-total"
                          value={directBudgetInput.total.toLocaleString()}
                          onChange={(e) => handleDirectBudgetChange("total", e.target.value.replace(/,/g, ""))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direct-government">국비 (원)</Label>
                        <Input
                          id="direct-government"
                          value={directBudgetInput.government.toLocaleString()}
                          onChange={(e) => handleDirectBudgetChange("government", e.target.value.replace(/,/g, ""))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direct-private-cash">민간부담금(현금) (원)</Label>
                        <Input
                          id="direct-private-cash"
                          value={directBudgetInput.privateCash.toLocaleString()}
                          onChange={(e) => handleDirectBudgetChange("privateCash", e.target.value.replace(/,/g, ""))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direct-private-inkind">민간부담금(현물) (원)</Label>
                        <Input
                          id="direct-private-inkind"
                          value={directBudgetInput.privateInkind.toLocaleString()}
                          onChange={(e) => handleDirectBudgetChange("privateInkind", e.target.value.replace(/,/g, ""))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <div className="flex justify-between w-full">
                  <Button variant="outline" onClick={() => setShowBudgetCalculator(false)}>
                    취소
                  </Button>
                  <div className="space-x-2">
                    <Button variant="secondary" onClick={applyDirectBudget}>
                      직접 입력값 적용
                    </Button>
                    <Button onClick={applyCalculatedBudget}>계산값 적용</Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 사업비율 설정 다이얼로그 */}
          <Dialog open={showBudgetRatioSettings} onOpenChange={setShowBudgetRatioSettings}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>사업비율 설정</DialogTitle>
                <DialogDescription>국비 및 민간부담금 비율을 설정합니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="government-ratio">국비 비율 (%)</Label>
                      <Input
                        id="government-ratio"
                        value={calculatorState.budgetRatio.government}
                        onChange={(e) => handleBudgetRatioChange("government", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="private-ratio">민간부담금 비율 (%)</Label>
                      <Input
                        id="private-ratio"
                        value={calculatorState.budgetRatio.private}
                        onChange={(e) => handleBudgetRatioChange("private", e.target.value)}
                        disabled
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="private-cash-ratio">민간부담금 중 현금 비율 (%)</Label>
                      <Input
                        id="private-cash-ratio"
                        value={calculatorState.budgetRatio.privateCash}
                        onChange={(e) => handleBudgetRatioChange("privateCash", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="private-inkind-ratio">민간부담금 중 현물 비율 (%)</Label>
                      <Input
                        id="private-inkind-ratio"
                        value={calculatorState.budgetRatio.privateInkind}
                        onChange={(e) => handleBudgetRatioChange("privateInkind", e.target.value)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBudgetRatioSettings(false)}>
                  취소
                </Button>
                <Button onClick={applyBudgetRatio}>적용</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 제출서류준비 탭 */}
        <TabsContent value="documents-prep">
          <Card>
            <CardHeader>
              <CardTitle>제출 서류 준비</CardTitle>
              <CardDescription>필수 제출 서류 목록 및 업로드 상태</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">번호</TableHead>
                      <TableHead>서류명</TableHead>
                      <TableHead>제공방법(제출양식)</TableHead>
                      <TableHead className="w-[120px]">상태</TableHead>
                      <TableHead>담당</TableHead>
                      <TableHead className="w-[100px]">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{doc.name}</div>
                          {doc.description && <div className="text-sm text-gray-500">{doc.description}</div>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-between">
                            <span>{doc.format}</span>
                            <Button variant="ghost" size="icon">
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {doc.status === "미첨부" ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              미첨부
                            </Badge>
                          ) : doc.status === "해당사항 없음" ? (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              해당사항 없음
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              완료
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{doc.responsible}</TableCell>
                        <TableCell>
                          {doc.status !== "해당사항 없음" &&
                            (doc.status === "미첨부" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDocument(doc)
                                  setShowDocumentUploadDialog(true)
                                }}
                              >
                                <UploadIcon className="h-4 w-4 mr-1" />
                                {doc.action}
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="text-sm text-gray-500 space-y-1 mt-4">
                  <p>* 공고문(RFP)에 명시된 기준으로, 추후 변경 가능성 있으니 공고 확인 필요</p>
                  <p>* 기관별로 제출서류(양식) 등을 공유 가능한 페이지입니다</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 문서 탭 */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>문서</CardTitle>
                  <CardDescription>과제 관련 문서 목록 (현재 상태: {projectStatus})</CardDescription>
                </div>
                <div className="flex gap-2">
                  {isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setShowAddDocumentDialog(true)}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      문서 추가
                    </Button>
                  )}
                  <Button onClick={handleCompleteProject}>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    완료
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">번호</TableHead>
                      <TableHead>문서명</TableHead>
                      <TableHead className="w-[150px]">작성자</TableHead>
                      <TableHead className="w-[150px]">작성일</TableHead>
                      <TableHead className="w-[180px]">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.id}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.author}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleDocumentPreview(doc)}>
                              <FileIcon className="h-4 w-4 mr-1" />
                              보기
                            </Button>
                            <Button variant="outline" size="sm">
                              <DownloadIcon className="h-4 w-4 mr-1" />
                              다운로드
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 문서 추가 다이얼로그 */}
          <Dialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>문서 추가</DialogTitle>
                <DialogDescription>새로운 문서를 추가합니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="document-name">문서명</Label>
                  <Input
                    id="document-name"
                    placeholder="문서 이름을 입력하세요"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-author">작성자</Label>
                  <Input
                    id="document-author"
                    placeholder="작성자 이름을 입력하세요"
                    value={newDocument.author}
                    onChange={(e) => setNewDocument({ ...newDocument, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-date">작성일</Label>
                  <Input
                    id="document-date"
                    type="date"
                    value={newDocument.date}
                    onChange={(e) => setNewDocument({ ...newDocument, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-type">문서 유형</Label>
                  <Select
                    value={newDocument.type}
                    onValueChange={(value) => setNewDocument({ ...newDocument, type: value })}
                  >
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="문서 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word (DOCX)</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="pptx">PowerPoint (PPTX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-file">파일 업로드</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="document-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">클릭하여 파일 업로드</span> 또는 드래그 앤 드롭
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, XLSX, PPTX (MAX. 10MB)</p>
                      </div>
                      <input
                        id="document-file"
                        type="file"
                        className="hidden"
                        onChange={handleDocumentFileChange}
                        accept=".pdf,.docx,.xlsx,.pptx"
                      />
                    </label>
                  </div>
                  {newDocument.file && (
                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="text-sm truncate">{newDocument.file.name}</span>
                      <button
                        type="button"
                        onClick={() => setNewDocument({ ...newDocument, file: null })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDocumentDialog(false)}>
                  취소
                </Button>
                <Button onClick={handleAddDocument}>추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 문서 미리보기 다이얼로그 */}
          <Dialog open={showDocumentPreview} onOpenChange={setShowDocumentPreview}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{selectedDocument?.name}</DialogTitle>
                <DialogDescription>
                  작성자: {selectedDocument?.author} | 작성일: {selectedDocument?.date}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="border rounded-md overflow-hidden">
                  {selectedDocument?.previewUrl && (
                    <img
                      src={selectedDocument.previewUrl || "/placeholder.svg"}
                      alt={selectedDocument.name}
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDocumentPreview(false)}>
                  닫기
                </Button>
                <Button>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

      {/* 파일 업로드 다이얼로그 (숨겨진 상태로 유지) */}
      <Dialog open={showFileUploadDialog} onOpenChange={setShowFileUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {fileUploadType === "announcement"
                ? "공고문 업로드"
                : fileUploadType === "rfp"
                  ? "RFP 업로드"
                  : "사업계획서 양식 업로드"}
            </DialogTitle>
            <DialogDescription>파일을 선택하여 업로드하세요.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.docx,.hwp,.xlsx"
            />
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">클릭하여 파일 업로드</span> 또는 드래그 앤 드롭
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, HWP, XLSX (MAX. 10MB)</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFileUploadDialog(false)}>
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 비목별 예산 항목 추가 다이얼로그 */}
      <Dialog open={showAddBudgetItemDialog} onOpenChange={setShowAddBudgetItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예산 항목 추가</DialogTitle>
            <DialogDescription>새로운 예산 항목을 추가합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category">비목</Label>
              <Input
                id="budget-category"
                placeholder="예산 비목을 입력하세요"
                value={newBudgetItem.category}
                onChange={(e) => setNewBudgetItem({ ...newBudgetItem, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-amount">금액 (원)</Label>
              <Input
                id="budget-amount"
                type="number"
                placeholder="금액을 입력하세요"
                value={newBudgetItem.amount || ""}
                onChange={(e) => setNewBudgetItem({ ...newBudgetItem, amount: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBudgetItemDialog(false)}>
              취소
            </Button>
            <Button onClick={handleAddBudgetItem}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 비목별 예산 항목 수정 다이얼로그 */}
      <Dialog open={showEditBudgetItemDialog} onOpenChange={setShowEditBudgetItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예산 항목 수정</DialogTitle>
            <DialogDescription>예산 항목을 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-budget-category">비목</Label>
              <Input
                id="edit-budget-category"
                placeholder="예산 비목을 입력하세요"
                value={selectedBudgetItem?.category || ""}
                onChange={(e) =>
                  setSelectedBudgetItem(selectedBudgetItem ? { ...selectedBudgetItem, category: e.target.value } : null)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-budget-amount">금액 (원)</Label>
              <Input
                id="edit-budget-amount"
                type="number"
                placeholder="금액을 입력하세요"
                value={selectedBudgetItem?.amount || ""}
                onChange={(e) =>
                  setSelectedBudgetItem(
                    selectedBudgetItem ? { ...selectedBudgetItem, amount: Number(e.target.value) } : null,
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditBudgetItemDialog(false)}>
              취소
            </Button>
            <Button onClick={handleEditBudgetItem}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 문서 업로드 다이얼로그 */}
      <Dialog open={showDocumentUploadDialog} onOpenChange={setShowDocumentUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>서류 업로드</DialogTitle>
            <DialogDescription>{selectedDocument?.name} 서류를 업로드합니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">클릭하여 파일 업로드</span> 또는 드래그 앤 드롭
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, HWP, XLSX (MAX. 10MB)</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentUploadDialog(false)}>
              취소
            </Button>
            <Button onClick={handleDocumentUpload}>업로드</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 상태 변경 확인 다이얼로그 */}
      <Dialog open={showStatusChangeConfirm} onOpenChange={setShowStatusChangeConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>과제 상태 변경</DialogTitle>
            <DialogDescription>과제 상태를 '신청완료'로 변경하시겠습니까?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mt-2 font-medium">계속 진행하시겠습니까?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusChangeConfirm(false)}>
              취소
            </Button>
            <Button onClick={confirmStatusChange}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
