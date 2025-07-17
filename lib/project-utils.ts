// 공통 유틸리티 함수들
export const formatBudget = (amount: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount)
}

// 상태별 색상 설정
export const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    완료: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    평가완료: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    평가대기: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    미선정: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    기획중: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    신청완료: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    진행중: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }
  return statusColors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
}

// 참여 유형별 색상 설정
export const getParticipationTypeColor = (type: string) => {
  const typeColors: Record<string, string> = {
    주관: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    참여: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  }
  return typeColors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
}

// 등급별 색상 설정
export const getGradeColor = (grade: string) => {
  const gradeColors: Record<string, string> = {
    A: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "A+": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "B+": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    B: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    우수: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    보통: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    미흡: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }
  return gradeColors[grade] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
}

// 우선순위별 색상 설정
export const getPriorityColor = (priority: string) => {
  const priorityColors: Record<string, string> = {
    높음: "bg-red-100 text-red-800",
    중간: "bg-yellow-100 text-yellow-800",
    낮음: "bg-green-100 text-green-800",
  }
  return priorityColors[priority] || "bg-gray-100 text-gray-800"
}

// 평가 상태별 색상 설정
export const getEvaluationStatusColor = (status: string) => {
  const evaluationColors: Record<string, string> = {
    완료: "bg-green-100 text-green-800",
    진행중: "bg-blue-100 text-blue-800",
    대기: "bg-orange-100 text-orange-800",
  }
  return evaluationColors[status] || "bg-gray-100 text-gray-800"
}
