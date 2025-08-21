"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  FileText,
  Users,
  Calendar,
  Building,
  ChevronLeft,
  Plus,
  RefreshCw,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileIcon as FilePdf,
  ExternalLink,
  Target,
  AlertTriangle,
  TrendingDown,
} from "lucide-react"

// 미선정 과제 데이터 (기존 신청서 파일 정보 추가)
const unselectedProjects = [
  {
    id: "PRJ203",
    title: "지능형 로봇 제어 기술 연구",
    status: "미선정",
    participationType: "주관",
    mainOrg: "한양대학교에리카 산학협력단",
    researcher: "최우진",
    manager: "한실무",
    applicationDate: "2024-01-15",
    rejectionDate: "2024-04-20",
    budget: 450000000,
    rejectionReason: "예산 부족",
    detailedFeedback:
      "기술적 완성도는 우수하나, 요청 예산이 과도하며 단계별 성과 지표가 명확하지 않습니다. 예산 계획을 재검토하고 구체적인 마일스톤을 설정할 필요가 있습니다.",
    canReapply: true,
    reapplyDeadline: "2025-01-15",
    improvementAreas: ["예산 계획 최적화", "단계별 성과 지표 구체화", "기술 검증 방법 보완"],
    description: "지능형 로봇의 자율 제어 기술 개발을 통해 산업용 로봇의 성능 향상을 목표로 하는 연구 프로젝트입니다.",
    applicationFiles: [
      {
        id: "file1",
        name: "연구계획서_지능형로봇제어기술.pdf",
        type: "pdf",
        size: "2.5MB",
        uploadDate: "2024-01-10",
        category: "연구계획서",
      },
      {
        id: "file2",
        name: "예산계획서_상세내역.xlsx",
        type: "excel",
        size: "1.2MB",
        uploadDate: "2024-01-12",
        category: "예산계획서",
      },
      {
        id: "file3",
        name: "연구진구성_이력서.pdf",
        type: "pdf",
        size: "3.1MB",
        uploadDate: "2024-01-13",
        category: "연구진구성",
      },
      {
        id: "file4",
        name: "기술개발계획_상세.docx",
        type: "word",
        size: "1.8MB",
        uploadDate: "2024-01-14",
        category: "기술개발계획",
      },
      {
        id: "file5",
        name: "사업화계획서.pdf",
        type: "pdf",
        size: "2.2MB",
        uploadDate: "2024-01-15",
        category: "사업화계획",
      },
    ],
  },
  {
    id: "PRJ205",
    title: "스마트 농업 IoT 시스템 구축",
    status: "미선정",
    participationType: "주관",
    mainOrg: "한양대학교에리카 산학협력단",
    researcher: "정스마트",
    manager: "한실무",
    applicationDate: "2024-02-01",
    rejectionDate: "2024-05-15",
    budget: 320000000,
    rejectionReason: "기술적 한계",
    detailedFeedback:
      "IoT 기술의 농업 적용은 의미가 있으나, 기존 기술 대비 차별화 포인트가 부족하고 실증 계획이 구체적이지 않습니다.",
    canReapply: true,
    reapplyDeadline: "2025-02-01",
    improvementAreas: ["기술 차별화 포인트 강화", "실증 계획 구체화", "농가 수용성 검증"],
    description: "스마트 농업을 위한 IoT 시스템 구축을 통해 농업 생산성 향상을 목표로 하는 프로젝트입니다.",
    applicationFiles: [
      {
        id: "file6",
        name: "연구계획서_스마트농업IoT.pdf",
        type: "pdf",
        size: "3.2MB",
        uploadDate: "2024-01-28",
        category: "연구계획서",
      },
      {
        id: "file7",
        name: "기술구현방안_IoT시스템.pdf",
        type: "pdf",
        size: "2.8MB",
        uploadDate: "2024-01-30",
        category: "기술개발계획",
      },
      {
        id: "file8",
        name: "실증계획서_농가적용.docx",
        type: "word",
        size: "1.5MB",
        uploadDate: "2024-01-31",
        category: "실증계획",
      },
    ],
  },
  {
    id: "PRJ206",
    title: "양자컴퓨팅 기반 암호화 시스템",
    status: "미선정",
    participationType: "참여",
    mainOrg: "서울대학교",
    researcher: "김양자",
    manager: "이교수",
    applicationDate: "2024-03-01",
    rejectionDate: "2024-06-01",
    budget: 800000000,
    rejectionReason: "기술적 실현 가능성 부족",
    detailedFeedback:
      "양자 알고리즘의 현실적 구현 방안이 구체적이지 않으며, 연구팀의 관련 경험이 부족합니다. 기술적 실현 가능성을 높이기 위한 구체적인 방안이 필요합니다.",
    canReapply: false,
    reapplyDeadline: null,
    improvementAreas: ["기술적 실현 가능성 강화", "연구팀 역량 보강", "단계별 구현 계획 수립"],
    description: "양자컴퓨팅 기술을 활용한 차세대 암호화 시스템 개발을 목표로 하는 연구 프로젝트입니다.",
    applicationFiles: [
      {
        id: "file9",
        name: "연구계획서_양자암호화.pdf",
        type: "pdf",
        size: "4.1MB",
        uploadDate: "2024-02-25",
        category: "연구계획서",
      },
      {
        id: "file10",
        name: "양자알고리즘_설계서.pdf",
        type: "pdf",
        size: "3.5MB",
        uploadDate: "2024-02-27",
        category: "기술개발계획",
      },
    ],
  },
]

export default function UnselectedProjectsPage() {
  const router = useRouter()
  const [isReapplyModalOpen, setIsReapplyModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFileViewModalOpen, setIsFileViewModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<any>(null)

  // 요약 카드 모달 상태들
  const [isAllUnselectedModalOpen, setIsAllUnselectedModalOpen] = useState(false)
  const [isReapplyableModalOpen, setIsReapplyableModalOpen] = useState(false)
  const [isNonReapplyableModalOpen, setIsNonReapplyableModalOpen] = useState(false)
  const [isBudgetAnalysisModalOpen, setIsBudgetAnalysisModalOpen] = useState(false)

  // 예산 포맷팅 함수
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 상태에 따른 색상 설정
  const getStatusColor = (status: string) => {
    switch (status) {
      case "미선정":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  // 참여 유형에 따른 색상 설정
  const getParticipationTypeColor = (type: string) => {
    switch (type) {
      case "주관":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "참여":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  // 파일 타입에 따른 아이콘 반환
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-4 w-4 text-red-500" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />
      case "word":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "image":
        return <FileImage className="h-4 w-4 text-purple-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const handleDetailView = (project: any) => {
    setSelectedProject(project)
    setIsDetailModalOpen(true)
  }

  const handleReapplyPlan = (project: any) => {
    setCurrentProject(project)
    setIsReapplyModalOpen(true)
  }

  const handleFileDownload = (file: any) => {
    // 실제 환경에서는 파일 다운로드 API 호출
    alert(`${file.name} 파일을 다운로드합니다.`)
  }

  const handleFilePreview = (file: any) => {
    setSelectedFile(file)
    setIsFileViewModalOpen(true)
  }

  const handleReapplySubmit = () => {
    alert("재신청 계획이 수립되었습니다!")
    setIsReapplyModalOpen(false)
    setCurrentProject(null)
  }

  // 프로젝트 카드 렌더링 함수
  const renderProjectCard = (project: any, showActions = true) => (
    <div 
      key={project.id} 
      className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
      onDoubleClick={() => handleDetailView(project)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium mb-2">{project.title}</h4>
          <div className="flex gap-2 mb-2">
            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            <Badge className={getParticipationTypeColor(project.participationType)}>{project.participationType}</Badge>
            {project.canReapply ? (
              <Badge variant="outline" className="border-green-300 text-green-700">
                재신청 가능
              </Badge>
            ) : (
              <Badge variant="outline" className="border-gray-300 text-gray-700">
                재신청 불가
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-muted-foreground">연구책임자:</span>
          <div className="font-medium">{project.researcher}</div>
        </div>
        <div>
          <span className="text-muted-foreground">미선정일:</span>
          <div className="font-medium">{project.rejectionDate}</div>
        </div>
        <div>
          <span className="text-muted-foreground">정부지원예산:</span>
          <div className="font-medium text-red-600">{formatBudget(project.budget)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">미선정사유:</span>
          <div className="font-medium text-red-600">{project.rejectionReason}</div>
        </div>
      </div>

      {project.canReapply && project.reapplyDeadline && (
        <div className="bg-orange-50 rounded-lg p-2 mb-3">
          <div className="text-xs text-orange-700">
            재신청 마감: <span className="font-medium">{project.reapplyDeadline}</span>
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2" onDoubleClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" onClick={() => handleDetailView(project)}>
            <Eye className="w-3 h-3 mr-1" />
            상세보기
          </Button>
          {project.canReapply && (
            <Button variant="outline" size="sm" onClick={() => handleReapplyPlan(project)}>
              <RefreshCw className="w-3 h-3 mr-1" />
              재신청 계획
            </Button>
          )}
        </div>
      )}
    </div>
  )



  const canReapplyProjects = unselectedProjects.filter((p) => p.canReapply)
  const cannotReapplyProjects = unselectedProjects.filter((p) => !p.canReapply)

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div>
            <button
              onClick={() => router.push("/completed")}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ChevronLeft className="h-4 w-4" />
              완료과제 목록으로 돌아가기
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">미선정 과제 관리</h1>
              <p className="text-muted-foreground">미선정된 과제들의 피드백을 분석하고 재신청을 준비합니다.</p>
            </div>
          </div>

          {/* 클릭 가능한 통계 카드 */}
          <div className="grid gap-4 md:grid-cols-4">
            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setIsAllUnselectedModalOpen(true)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">총 미선정 과제</span>
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">{unselectedProjects.length}</div>
                <div className="text-sm text-gray-500">전체 미선정</div>
              </div>
            </div>

            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setIsReapplyableModalOpen(true)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">재신청 가능</span>
                <RefreshCw className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">{canReapplyProjects.length}</div>
                <div className="text-sm text-gray-500">재도전 기회</div>
              </div>
            </div>

            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setIsNonReapplyableModalOpen(true)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">재신청 불가</span>
                <AlertTriangle className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">{cannotReapplyProjects.length}</div>
                <div className="text-sm text-gray-500">개선 후 차기 신청</div>
              </div>
            </div>

            <div
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setIsBudgetAnalysisModalOpen(true)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">신청 예산 총액</span>
                <Building className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">
                  {(unselectedProjects.reduce((sum, p) => sum + p.budget, 0) / 100000000).toFixed(1)}억원
                </div>
                <div className="text-sm text-gray-500">미선정 예산</div>
              </div>
            </div>
          </div>

          {/* 재신청 가능 과제 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    재신청 가능 과제
                  </CardTitle>
                  <CardDescription>개선 후 재신청이 가능한 과제들입니다.</CardDescription>
                </div>
                <Button onClick={() => setIsReapplyModalOpen(true)} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  재신청 계획 수립
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {canReapplyProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-orange-200 dark:border-orange-700 rounded-lg p-6 hover:border-orange-400 transition-colors"
                  >
                    {/* 제목 및 상태 */}
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-medium">{project.title}</h3>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        <Badge className={getParticipationTypeColor(project.participationType)}>
                          {project.participationType}
                        </Badge>
                        <Badge variant="outline" className="border-green-300 text-green-700">
                          재신청 가능
                        </Badge>
                      </div>
                    </div>

                    {/* 프로젝트 정보 */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">주관기관:</span>
                        <div className="text-sm">{project.mainOrg}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">연구책임자:</span>
                        <div className="text-sm">{project.researcher}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">미선정일:</span>
                        <div className="text-sm">{project.rejectionDate}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">재신청 마감:</span>
                        <div className="text-sm text-orange-600">{project.reapplyDeadline}</div>
                      </div>
                    </div>

                    {/* 기존 신청서 파일 목록 */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          기존 신청서 파일 ({project.applicationFiles.length}개)
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handleDetailView(project)} className="text-xs">
                          전체보기
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {project.applicationFiles.slice(0, 4).map((file: any) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded text-xs"
                          >
                            {getFileIcon(file.type)}
                            <span className="flex-1 truncate">{file.name}</span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFilePreview(file)}
                                className="h-6 w-6 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFileDownload(file)}
                                className="h-6 w-6 p-0"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 미선정 사유 */}
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-red-800 dark:text-red-300">미선정 사유:</span>
                        <span className="text-sm text-red-600">{project.rejectionReason}</span>
                      </div>
                      <p className="text-xs text-red-700 dark:text-red-400">{project.detailedFeedback}</p>
                    </div>

                    {/* 개선 필요 영역 */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-4">
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2 block">
                        개선 필요 영역:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.improvementAreas.map((area, index) => (
                          <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDetailView(project)}>
                        <Eye className="w-4 h-4 mr-1" />
                        상세보기
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleReapplyPlan(project)}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        재신청 계획
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 재신청 불가 과제 */}
          {cannotReapplyProjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  재신청 불가 과제
                </CardTitle>
                <CardDescription>현재 재신청이 불가능한 과제들입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cannotReapplyProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 opacity-75"
                    >
                      {/* 제목 및 상태 */}
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-medium">{project.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          <Badge className={getParticipationTypeColor(project.participationType)}>
                            {project.participationType}
                          </Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-700">
                            재신청 불가
                          </Badge>
                        </div>
                      </div>

                      {/* 프로젝트 정보 */}
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-4">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">주관기관:</span>
                          <div className="text-sm">{project.mainOrg}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">연구책임자:</span>
                          <div className="text-sm">{project.researcher}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">미선정일:</span>
                          <div className="text-sm">{project.rejectionDate}</div>
                        </div>
                      </div>

                      {/* 미선정 사유 */}
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-red-800 dark:text-red-300">미선정 사유:</span>
                          <span className="text-sm text-red-600">{project.rejectionReason}</span>
                        </div>
                        <p className="text-xs text-red-700 dark:text-red-400">{project.detailedFeedback}</p>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDetailView(project)}>
                          <Eye className="w-4 h-4 mr-1" />
                          상세보기
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 전체 미선정 과제 모달 */}
        <Dialog open={isAllUnselectedModalOpen} onOpenChange={setIsAllUnselectedModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5" />
                전체 미선정 과제 ({unselectedProjects.length}건)
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                모든 미선정 과제의 목록과 현황을 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* 요약 정보 */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-red-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">{unselectedProjects.length}</div>
                  <div className="text-sm text-red-700">총 미선정 과제</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">
                    {(unselectedProjects.reduce((sum, p) => sum + p.budget, 0) / 100000000).toFixed(1)}억원
                  </div>
                  <div className="text-sm text-red-700">총 신청 예산</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">{canReapplyProjects.length}</div>
                  <div className="text-sm text-red-700">재신청 가능</div>
                </div>
              </div>

              {/* 과제 목록 */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {unselectedProjects.map((project) => renderProjectCard(project))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsAllUnselectedModalOpen(false)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 재신청 가능 과제 모달 */}
        <Dialog open={isReapplyableModalOpen} onOpenChange={setIsReapplyableModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                재신청 가능 과제 ({canReapplyProjects.length}건)
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                개선 후 재신청이 가능한 과제들입니다. 마감일을 확인하고 계획을 수립하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* 요약 정보 */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">{canReapplyProjects.length}</div>
                  <div className="text-sm text-green-700">재신청 가능</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {(canReapplyProjects.reduce((sum, p) => sum + p.budget, 0) / 100000000).toFixed(1)}억원
                  </div>
                  <div className="text-sm text-green-700">재신청 예산</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {Math.round((canReapplyProjects.length / unselectedProjects.length) * 100)}%
                  </div>
                  <div className="text-sm text-green-700">재신청 가능률</div>
                </div>
              </div>

              {/* 과제 목록 */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {canReapplyProjects.length > 0 ? (
                  canReapplyProjects.map((project) => renderProjectCard(project))
                ) : (
                  <div className="text-center py-8 text-gray-500">재신청 가능한 과제가 없습니다.</div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsReapplyableModalOpen(false)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 재신청 불가 과제 모달 */}
        <Dialog open={isNonReapplyableModalOpen} onOpenChange={setIsNonReapplyableModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                재신청 불가 과제 ({cannotReapplyProjects.length}건)
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                현재 재신청이 불가능한 과제들입니다. 향후 개선 방향을 참고하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* 요약 정보 */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{cannotReapplyProjects.length}</div>
                  <div className="text-sm text-gray-700">재신청 불가</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {(cannotReapplyProjects.reduce((sum, p) => sum + p.budget, 0) / 100000000).toFixed(1)}억원
                  </div>
                  <div className="text-sm text-gray-700">불가 과제 예산</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round((cannotReapplyProjects.length / unselectedProjects.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-700">불가 비율</div>
                </div>
              </div>

              {/* 과제 목록 */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cannotReapplyProjects.length > 0 ? (
                  cannotReapplyProjects.map((project) => renderProjectCard(project, false))
                ) : (
                  <div className="text-center py-8 text-gray-500">재신청 불가 과제가 없습니다.</div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsNonReapplyableModalOpen(false)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 예산 분석 모달 */}
        <Dialog open={isBudgetAnalysisModalOpen} onOpenChange={setIsBudgetAnalysisModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                미선정 예산 분석
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                미선정된 과제들의 예산 분포와 통계를 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* 전체 통계 */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-red-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">
                    {(unselectedProjects.reduce((sum, p) => sum + p.budget, 0) / 100000000).toFixed(1)}억원
                  </div>
                  <div className="text-sm text-red-700">총 미선정 예산</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">
                    {(Math.max(...unselectedProjects.map((p) => p.budget)) / 100000000).toFixed(1)}억원
                  </div>
                  <div className="text-sm text-red-700">최대 신청 예산</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">
                    {(
                      unselectedProjects.reduce((sum, p) => sum + p.budget, 0) /
                      unselectedProjects.length /
                      100000000
                    ).toFixed(1)}
                    억원
                  </div>
                  <div className="text-sm text-red-700">평균 신청 예산</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">
                    {(canReapplyProjects.reduce((sum, p) => sum + p.budget, 0) / 100000000).toFixed(1)}억원
                  </div>
                  <div className="text-sm text-red-700">재신청 가능 예산</div>
                </div>
              </div>

              {/* 예산 구간별 분포 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">예산 구간별 분포</h4>
                <div className="space-y-3">
                  {[
                    { range: "10억원 이상", min: 1000000000, max: Number.POSITIVE_INFINITY, color: "bg-red-500" },
                    { range: "5-10억원", min: 500000000, max: 999999999, color: "bg-orange-500" },
                    { range: "3-5억원", min: 300000000, max: 499999999, color: "bg-yellow-500" },
                    { range: "1-3억원", min: 100000000, max: 299999999, color: "bg-blue-500" },
                    { range: "1억원 미만", min: 0, max: 99999999, color: "bg-green-500" },
                  ].map((range) => {
                    const count = unselectedProjects.filter((p) => p.budget >= range.min && p.budget <= range.max).length
                    const percentage = unselectedProjects.length > 0 ? (count / unselectedProjects.length) * 100 : 0

                    return (
                      <div key={range.range} className="flex items-center gap-3">
                        <div className="w-20 text-sm font-medium">{range.range}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div
                            className={`${range.color} h-6 rounded-full flex items-center justify-center text-white text-xs font-medium`}
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          >
                            {count > 0 && `${count}건`}
                          </div>
                        </div>
                        <div className="w-12 text-sm text-gray-600">{percentage.toFixed(0)}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 미선정 사유별 예산 분석 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">미선정 사유별 예산 분석</h4>
                <div className="space-y-2">
                  {Array.from(new Set(unselectedProjects.map((p) => p.rejectionReason))).map((reason) => {
                    const reasonProjects = unselectedProjects.filter((p) => p.rejectionReason === reason)
                    const totalBudget = reasonProjects.reduce((sum, p) => sum + p.budget, 0)

                    return (
                      <div key={reason} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{reason}</div>
                          <div className="text-sm text-gray-600">{reasonProjects.length}건</div>
                        </div>
                        <div className="text-lg font-bold text-red-600">{(totalBudget / 100000000).toFixed(1)}억원</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsBudgetAnalysisModalOpen(false)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 재신청 계획 수립 모달 */}
        <Dialog open={isReapplyModalOpen} onOpenChange={setIsReapplyModalOpen}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">재신청 개선 계획 수립</DialogTitle>
              <DialogDescription className="text-gray-600">
                미선정 사유를 바탕으로 개선 계획을 수립하여 재신청을 준비합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project" className="text-gray-700">
                  재신청 과제 선택
                </Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="재신청할 과제를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {canReapplyProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="improvements" className="text-gray-700">
                  주요 개선 사항
                </Label>
                <Textarea
                  className="bg-white"
                  placeholder="미선정 사유를 바탕으로 어떤 부분을 개선할 것인지 구체적으로 작성해주세요..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revised-budget" className="text-gray-700">
                    수정 예산 (원)
                  </Label>
                  <Input type="number" placeholder="수정된 예산을 입력하세요" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-date" className="text-gray-700">
                    재신청 목표일
                  </Label>
                  <Input type="date" className="bg-white" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReapplyModalOpen(false)}>
                취소
              </Button>
              <Button variant="outline" onClick={handleReapplySubmit}>
                개선 계획 저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 상세보기 모달 - 파일 관리 탭 추가 */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">미선정 과제 상세보기</DialogTitle>
              <DialogDescription className="text-gray-600">{selectedProject?.title}</DialogDescription>
            </DialogHeader>
            {selectedProject && (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">과제 정보</TabsTrigger>
                  <TabsTrigger value="files">신청서 파일</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  {/* 기본 정보 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">기본 정보</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">과제명:</span>
                        <div className="font-medium text-gray-900">{selectedProject.title}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">연구책임자:</span>
                        <div className="font-medium text-gray-900">{selectedProject.researcher}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">주관기관:</span>
                        <div className="font-medium text-gray-900">{selectedProject.mainOrg}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">정부지원예산:</span>
                        <div className="font-medium text-gray-900">{formatBudget(selectedProject.budget)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">신청일:</span>
                        <div className="font-medium text-gray-900">{selectedProject.applicationDate}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">미선정일:</span>
                        <div className="font-medium text-gray-900">{selectedProject.rejectionDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* 프로젝트 개요 */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">프로젝트 개요</h4>
                    <p className="text-sm text-gray-700">{selectedProject.description}</p>
                  </div>

                  {/* 미선정 사유 */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">미선정 사유</h4>
                    <div className="mb-2">
                      <Badge className="bg-red-100 text-red-800">{selectedProject.rejectionReason}</Badge>
                    </div>
                    <p className="text-sm text-red-700">{selectedProject.detailedFeedback}</p>
                  </div>

                  {/* 개선 필요 영역 */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">개선 필요 영역</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.improvementAreas.map((area: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-orange-300 text-orange-700 text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 재신청 정보 */}
                  {selectedProject.canReapply && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">재신청 정보</h4>
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-green-700">재신청 가능:</span>
                          <span className="font-medium text-green-800">가능</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">재신청 마감일:</span>
                          <span className="font-medium text-green-800">{selectedProject.reapplyDeadline}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      기존 신청서 파일 목록 ({selectedProject.applicationFiles.length}개)
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      재신청 시 참고할 수 있도록 기존 신청서 파일들을 확인하고 다운로드할 수 있습니다.
                    </p>

                    <div className="space-y-3">
                      {selectedProject.applicationFiles.map((file: any) => (
                        <div key={file.id} className="bg-white rounded-lg p-4 border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.type)}
                              <div>
                                <div className="font-medium text-gray-900">{file.name}</div>
                                <div className="text-sm text-gray-500">
                                  {file.category} • {file.size} • {file.uploadDate}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleFilePreview(file)}>
                                <Eye className="w-4 h-4 mr-1" />
                                미리보기
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleFileDownload(file)}>
                                <Download className="w-4 h-4 mr-1" />
                                다운로드
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 파일 미리보기 모달 */}
        <Dialog open={isFileViewModalOpen} onOpenChange={setIsFileViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 flex items-center gap-2">
                {selectedFile && getFileIcon(selectedFile.type)}
                {selectedFile?.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {selectedFile?.category} • {selectedFile?.size} • {selectedFile?.uploadDate}
              </DialogDescription>
            </DialogHeader>
            {selectedFile && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="text-gray-500 mb-4">{getFileIcon(selectedFile.type)}</div>
                  <p className="text-gray-600 mb-4">파일 미리보기는 실제 환경에서 구현됩니다.</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => handleFileDownload(selectedFile)}>
                      <Download className="w-4 h-4 mr-1" />
                      다운로드
                    </Button>
                    <Button variant="outline" onClick={() => window.open("#", "_blank")}>
                      <ExternalLink className="w-4 h-4 mr-1" />새 창에서 열기
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsFileViewModalOpen(false)}>
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
