"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Download, Users, Calendar, Building, Award, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 완료/미선정 과제 데이터
const completedProjects = [
  {
    id: "PRJ201",
    title: "AI 기반 스마트 팩토리 구축",
    status: "완료",
    participationType: "주관",
    mainOrg: "한양대학교에리카 산학협력단",
    researcher: "김민수",
    manager: "박실무",
    startDate: "2023-03-01",
    endDate: "2024-03-15",
    budget: 300000000,
    completionDate: "2024-03-15",
    description:
      "AI 기술을 활용한 스마트 팩토리 구축을 통해 제조업의 디지털 전환을 가속화하는 프로젝트입니다. 실시간 데이터 분석과 예측 유지보수 시스템을 구축하여 생산성을 향상시킵니다.",
    achievements: [
      "생산성 35% 향상 달성",
      "AI 모델 정확도 96% 달성",
      "SCI 논문 5편 게재",
      "특허 3건 출원",
      "기술이전 1건 완료",
      "석사급 인력 4명 양성",
    ],
    team: [
      { name: "김민수", role: "책임연구원", email: "kim@factory.org" },
      { name: "이공장", role: "선임연구원", email: "lee@factory.org" },
      { name: "박스마트", role: "연구원", email: "park@factory.org" },
    ],
    documents: [
      { title: "최종보고서", date: "2024-03-15", type: "보고서" },
      { title: "성과보고서", date: "2024-03-20", type: "성과" },
      { title: "연구비 정산서", date: "2024-03-25", type: "재정" },
    ],
  },
  {
    id: "PRJ202",
    title: "차세대 에너지 저장 시스템 개발",
    status: "완료",
    participationType: "참여",
    mainOrg: "서울대학교",
    researcher: "박선영",
    manager: "정교수",
    startDate: "2023-06-01",
    endDate: "2024-04-01",
    budget: 500000000,
    completionDate: "2024-04-01",
    description: "차세대 에너지 저장 시스템 개발을 통해 신재생 에너지의 효율적 활용을 목표로 하는 연구 프로젝트입니다.",
    achievements: ["에너지 효율 40% 개선", "배터리 수명 2배 연장", "논문 3편 게재", "특허 2건 출원", "상용화 1건 달성"],
    team: [
      { name: "박선영", role: "책임연구원", email: "park@energy.org" },
      { name: "최에너지", role: "선임연구원", email: "choi@energy.org" },
    ],
    documents: [
      { title: "최종보고서", date: "2024-04-01", type: "보고서" },
      { title: "기술이전 계약서", date: "2024-04-10", type: "계약" },
    ],
  },
  {
    id: "PRJ203",
    title: "지능형 로봇 제어 기술 연구",
    status: "미선정",
    participationType: "주관",
    mainOrg: "한양대학교에리카 산학협력단",
    researcher: "최우진",
    manager: "한실무",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    budget: 450000000,
    rejectionReason: "예산 부족",
    rejectionDate: "2024-04-20",
    description: "지능형 로봇의 자율 제어 기술 개발을 통해 산업용 로봇의 성능 향상을 목표로 하는 연구 프로젝트입니다.",
    rejectionFeedback:
      "기술적 완성도는 우수하나, 요청 예산이 과도하며 단계별 성과 지표가 명확하지 않습니다. 예산 계획을 재검토하고 구체적인 마일스톤을 설정할 필요가 있습니다.",
    improvementAreas: ["예산 계획 최적화", "단계별 성과 지표 구체화", "기술 검증 방법 보완", "상용화 계획 수립"],
  },
  {
    id: "PRJ204",
    title: "친환경 바이오 연료 생산 기술",
    status: "완료",
    participationType: "참여",
    mainOrg: "KAIST",
    researcher: "이바이오",
    manager: "김부산",
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    budget: 380000000,
    completionDate: "2024-01-15",
    description: "친환경 바이오 연료 생산 기술 개발을 통해 지속가능한 에너지 솔루션을 제공하는 프로젝트입니다.",
    achievements: [
      "바이오 연료 효율 50% 향상",
      "생산 비용 30% 절감",
      "SCI 논문 7편 게재",
      "특허 4건 출원",
      "기술이전 2건 완료",
      "박사급 인력 2명 양성",
    ],
    team: [
      { name: "이바이오", role: "책임연구원", email: "lee@bio.org" },
      { name: "김친환경", role: "선임연구원", email: "kim@eco.org" },
      { name: "박연료", role: "연구원", email: "park@fuel.org" },
    ],
    documents: [
      { title: "최종보고서", date: "2024-01-15", type: "보고서" },
      { title: "성과보고서", date: "2024-01-20", type: "성과" },
      { title: "기술이전 보고서", date: "2024-01-25", type: "기술이전" },
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
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    budget: 320000000,
    rejectionReason: "기술적 한계",
    rejectionDate: "2024-05-15",
    description: "스마트 농업을 위한 IoT 시스템 구축을 통해 농업 생산성 향상을 목표로 하는 프로젝트입니다.",
    rejectionFeedback:
      "IoT 기술의 농업 적용은 의미가 있으나, 기존 기술 대비 차별화 포인트가 부족하고 실증 계획이 구체적이지 않습니다.",
    improvementAreas: ["기술 차별화 포인트 강화", "실증 계획 구체화", "농가 수용성 검증", "경제성 분석 보완"],
  },
]

export default function CompletedDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")

  // 프로젝트 ID로 데이터 조회
  const projectId = params.id as string
  const project = completedProjects.find((p) => p.id === projectId)

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
      case "완료":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
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

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <main className="p-6">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold">프로젝트를 찾을 수 없습니다.</h2>
            <button
              onClick={() => router.push("/completed")}
              className="mt-4 text-primary hover:underline flex items-center justify-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              완료과제 목록으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              <Badge className={getParticipationTypeColor(project.participationType)}>{project.participationType}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">프로젝트 ID: {project.id}</p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-border">
            <div className="flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                개요
              </button>
              {project.status === "완료" && (
                <>
                  <button
                    onClick={() => setActiveTab("achievements")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "achievements"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    성과
                  </button>
                  <button
                    onClick={() => setActiveTab("team")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "team"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    연구팀
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "documents"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    문서
                  </button>
                </>
              )}
              {project.status === "미선정" && (
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "feedback"
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  피드백
                </button>
              )}
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="mt-6">
            {/* 개요 탭 */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">주관기관</CardTitle>
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{project.mainOrg}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">연구책임자</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{project.researcher}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">담당자</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{project.manager}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {project.status === "완료" ? "완료일" : "미선정일"}
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        {project.status === "완료" ? project.completionDate : project.rejectionDate}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* 공고문 링크 */}
                {project.announcement_link && (
                  <Card>
                    <CardHeader>
                      <CardTitle>공고문 링크</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a 
                        href={project.announcement_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {project.announcement_link}
                      </a>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>프로젝트 개요</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{project.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>예산 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{formatBudget(project.budget)}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 성과 탭 (완료 과제만) */}
            {activeTab === "achievements" && project.status === "완료" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-600" />
                      주요 성과
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {project.achievements?.map((achievement: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-sm">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 연구팀 탭 (완료 과제만) */}
            {activeTab === "team" && project.status === "완료" && project.team && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      연구팀 구성원
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.team.map((member: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.role}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 문서 탭 (완료 과제만) */}
            {activeTab === "documents" && project.status === "완료" && project.documents && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      프로젝트 문서
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.date} • {doc.type}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            다운로드
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 피드백 탭 (미선정 과제만) */}
            {activeTab === "feedback" && project.status === "미선정" && (
              <div className="space-y-6">
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-800">미선정 사유</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="font-medium text-red-800 mb-2">{project.rejectionReason}</p>
                      <p className="text-sm text-red-700">{project.rejectionFeedback}</p>
                    </div>
                  </CardContent>
                </Card>

                {project.improvementAreas && (
                  <Card>
                    <CardHeader>
                      <CardTitle>개선 필요 영역</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {project.improvementAreas.map((area: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span className="text-sm">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>재신청 안내</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      위 피드백을 바탕으로 개선 계획을 수립하여 재신청할 수 있습니다.
                    </p>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <FileText className="mr-2 h-4 w-4" />
                      재신청 계획 수립
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
