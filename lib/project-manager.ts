// 프로젝트 상태 관리 및 분류 로직

export interface BaseProject {
  id: string
  projectName: string
  status: "기획중" | "신청완료" | "진행중" | "보류" | "완료"
  participationType: "주관" | "참여"
  leadOrganization: string
  principalInvestigator: string
  manager: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export interface OngoingProjectData {
  planningProjectId: string
  progress: number
  kpis: KPI[]
  issues: Issue[]
  changeRequests: ChangeRequest[]
  reports: Report[]
}

export interface CompletedProjectData {
  planningProjectId: string
  completionDate?: string
  finalReport?: string
  evaluation?: ProjectEvaluation
  reason?: string // 보류/미선정 사유
}

export interface KPI {
  id: string
  name: string
  target: string
  current: string
  unit: string
  progress: number
}

export interface Issue {
  id: string
  title: string
  description: string
  status: "열림" | "진행중" | "해결됨"
  priority: "낮음" | "보통" | "높음" | "긴급"
  createdAt: string
  assignee?: string
}

export interface ChangeRequest {
  id: string
  title: string
  description: string
  status: "요청" | "검토중" | "승인" | "거부"
  requestDate: string
  approvalDate?: string
}

export interface Report {
  id: string
  type: "월간" | "분기" | "최종"
  title: string
  content: string
  submissionDate: string
}

export interface ProjectEvaluation {
  score: number
  feedback: string
  evaluator: string
  evaluationDate: string
}

// 프로젝트 상태별 분류 함수
export function categorizeProjectsByStatus(projects: BaseProject[]) {
  return {
    planning: projects.filter((p) => ["기획중", "신청완료"].includes(p.status)),
    ongoing: projects.filter((p) => p.status === "진행중"),
    completed: projects.filter((p) => ["보류", "완료"].includes(p.status)),
  }
}

// 상태 변경 시 프로젝트 이동 로직
export function moveProjectByStatus(
  project: BaseProject,
  newStatus: BaseProject["status"],
): {
  shouldCreateOngoing: boolean
  shouldCreateCompleted: boolean
  shouldRemoveFromOthers: boolean
} {
  const oldCategory = getProjectCategory(project.status)
  const newCategory = getProjectCategory(newStatus)

  return {
    shouldCreateOngoing: newCategory === "ongoing" && oldCategory !== "ongoing",
    shouldCreateCompleted: newCategory === "completed" && oldCategory !== "completed",
    shouldRemoveFromOthers: oldCategory !== newCategory,
  }
}

function getProjectCategory(status: BaseProject["status"]): "planning" | "ongoing" | "completed" {
  if (["기획중", "신청완료"].includes(status)) return "planning"
  if (status === "진행중") return "ongoing"
  return "completed"
}

// 샘플 데이터
export const samplePlanningProjects: BaseProject[] = [
  {
    id: "PRJ001",
    projectName: "2025 차세대 양자컴퓨팅 기술 개발",
    status: "기획중",
    participationType: "주관",
    leadOrganization: "한양대학교에리카 산학협력단",
    principalInvestigator: "김연구",
    manager: "박실무",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-01",
  },
  {
    id: "PRJ101",
    projectName: "2024 차세대 양자컴퓨팅 기술 개발",
    status: "진행중",
    participationType: "주관",
    leadOrganization: "한양대학교에리카 산학협력단",
    principalInvestigator: "김연구",
    manager: "박실무",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    createdAt: "2024-01-01",
    updatedAt: "2024-12-15",
  },
  {
    id: "PRJ002",
    projectName: "바이오 신약 개발 플랫폼 구축",
    status: "신청완료",
    participationType: "참여",
    leadOrganization: "서울대학교",
    principalInvestigator: "이과학",
    manager: "정교수",
    startDate: "2025-01-15",
    endDate: "2025-05-15",
    createdAt: "2024-11-15",
    updatedAt: "2024-12-10",
  },
  {
    id: "PRJ003",
    projectName: "AI 기반 스마트 제조 시스템",
    status: "진행중",
    participationType: "주관",
    leadOrganization: "한양대학교에리카 산학협력단",
    principalInvestigator: "최인공",
    manager: "한실무",
    startDate: "2024-06-01",
    endDate: "2025-12-31",
    createdAt: "2024-05-01",
    updatedAt: "2024-12-15",
  },
  {
    id: "PRJ004",
    projectName: "친환경 바이오 연료 개발",
    status: "완료",
    participationType: "참여",
    leadOrganization: "연세대학교",
    principalInvestigator: "박바이오",
    manager: "김담당",
    startDate: "2023-03-01",
    endDate: "2024-11-30",
    createdAt: "2023-02-01",
    updatedAt: "2024-11-30",
  },
]

// 진행과제 전용 데이터
export const sampleOngoingProjectData: Record<string, OngoingProjectData> = {
  PRJ101: {
    planningProjectId: "PRJ101",
    progress: 85,
    kpis: [
      {
        id: "KPI001",
        name: "양자 알고리즘 개발 완료율",
        target: "100",
        current: "85",
        unit: "%",
        progress: 85,
      },
      {
        id: "KPI002",
        name: "특허 출원 건수",
        target: "3",
        current: "2",
        unit: "건",
        progress: 67,
      },
      {
        id: "KPI003",
        name: "논문 게재 건수",
        target: "5",
        current: "4",
        unit: "건",
        progress: 80,
      },
    ],
    issues: [
      {
        id: "ISS001",
        title: "양자 하드웨어 호환성 문제",
        description: "기존 하드웨어와의 호환성 이슈로 인한 개발 지연",
        status: "해결됨",
        priority: "높음",
        createdAt: "2024-06-10",
        assignee: "개발팀",
      },
      {
        id: "ISS002",
        title: "알고리즘 최적화 필요",
        description: "성능 향상을 위한 알고리즘 최적화 작업 필요",
        status: "진행중",
        priority: "보통",
        createdAt: "2024-11-15",
        assignee: "연구팀",
      },
    ],
    changeRequests: [
      {
        id: "CR001",
        title: "연구기간 연장 요청",
        description: "추가 검증을 위한 3개월 연장 요청",
        status: "승인",
        requestDate: "2024-10-01",
        approvalDate: "2024-10-15",
      },
    ],
    reports: [
      {
        id: "RPT001",
        type: "분기",
        title: "2024년 4분기 분기보고서",
        content:
          "양자컴퓨팅 알고리즘 개발 진행률 85% 달성. 주요 성과로는 양자 오류 정정 알고리즘 완성 및 특허 2건 출원...",
        submissionDate: "2024-12-31",
      },
    ],
  },
  PRJ003: {
    planningProjectId: "PRJ003",
    progress: 65,
    kpis: [
      {
        id: "KPI001",
        name: "시스템 구축 완료율",
        target: "100",
        current: "65",
        unit: "%",
        progress: 65,
      },
      {
        id: "KPI002",
        name: "테스트 케이스 통과율",
        target: "95",
        current: "78",
        unit: "%",
        progress: 82,
      },
    ],
    issues: [
      {
        id: "ISS001",
        title: "데이터베이스 연동 오류",
        description: "외부 시스템과의 데이터베이스 연동에서 간헐적 오류 발생",
        status: "진행중",
        priority: "높음",
        createdAt: "2024-12-10",
        assignee: "개발팀",
      },
    ],
    changeRequests: [],
    reports: [
      {
        id: "RPT001",
        type: "월간",
        title: "2024년 12월 월간보고서",
        content: "시스템 개발 진행률 65% 달성...",
        submissionDate: "2024-12-31",
      },
    ],
  },
}

// 완료과제 전용 데이터
export const sampleCompletedProjectData: Record<string, CompletedProjectData> = {
  PRJ004: {
    planningProjectId: "PRJ004",
    completionDate: "2024-11-30",
    finalReport: "친환경 바이오 연료 개발 최종보고서",
    evaluation: {
      score: 92,
      feedback: "목표 대비 우수한 성과 달성",
      evaluator: "평가위원회",
      evaluationDate: "2024-12-05",
    },
  },
}
