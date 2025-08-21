"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Award, Users, Calendar, Building } from "lucide-react"

interface ProjectCardProps {
  project: any
  showActions?: boolean
  onDetailView?: (project: any) => void
  onEvaluationRegister?: (project: any) => void
  formatBudget?: (amount: number) => string
  getStatusColor?: (status: string) => string
  getParticipationTypeColor?: (type: string) => string
  getGradeColor?: (grade: string) => string
}

export function ProjectCard({
  project,
  showActions = true,
  onDetailView,
  onEvaluationRegister,
  formatBudget,
  getStatusColor,
  getParticipationTypeColor,
  getGradeColor,
}: ProjectCardProps) {
  const handleCardDoubleClick = (e: React.MouseEvent) => {
    // 버튼 영역을 더블클릭한 경우 상세보기 실행하지 않음
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onDetailView?.(project)
  }

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
      onDoubleClick={handleCardDoubleClick}
    >
      {/* 제목 및 상태 */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
        <div className="flex gap-2">
          <Badge className={getStatusColor?.(project.status)}>{project.status}</Badge>
          <Badge className={getParticipationTypeColor?.(project.participationType)}>{project.participationType}</Badge>
          {project.evaluation?.grade && (
            <Badge className={getGradeColor?.(project.evaluation.grade)}>{project.evaluation.grade}등급</Badge>
          )}
          {project.grade && !project.evaluation?.grade && (
            <Badge className={getGradeColor?.(project.grade)}>{project.grade}등급</Badge>
          )}
          {project.canReapply !== undefined && (
            <Badge
              variant="outline"
              className={project.canReapply ? "border-green-300 text-green-700" : "border-gray-300 text-gray-700"}
            >
              {project.canReapply ? "재신청 가능" : "재신청 불가"}
            </Badge>
          )}
        </div>
      </div>

      {/* 프로젝트 정보 */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-6 mb-3 text-sm">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-gray-600">주관기관:</span>
          <div className="text-gray-900">{project.mainOrg}</div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-gray-600">연구책임자:</span>
          <div className="text-gray-900">{project.researcher}</div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-gray-600">
            {project.completionDate ? "완료일" : project.rejectionDate ? "미선정일" : "기간"}:
          </span>
          <div className="text-gray-900">
            {project.completionDate || project.rejectionDate || `${project.startDate} ~ ${project.endDate}`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {project.score ? "성과점수" : project.rejectionReason ? "미선정사유" : "정부지원예산"}:
          </span>
          <div
            className={`font-medium ${project.score ? "text-green-600" : project.rejectionReason ? "text-red-600" : "text-gray-900"}`}
          >
            {project.score
              ? `${project.score}점`
              : project.rejectionReason || (formatBudget ? formatBudget(project.budget) : project.budget)}
          </div>
        </div>
      </div>

      {/* 평가 점수 (평가 완료인 경우만) */}
      {project.evaluation && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-lg font-bold text-blue-600">{project.evaluation.technical}</div>
            <div className="text-xs text-gray-600">기술성과</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <div className="text-lg font-bold text-green-600">{project.evaluation.commercialization}</div>
            <div className="text-xs text-gray-600">상용화</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
            <div className="text-lg font-bold text-purple-600">{project.evaluation.impact}</div>
            <div className="text-xs text-gray-600">파급효과</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
            <div className="text-lg font-bold text-yellow-600">{project.evaluation.overall}</div>
            <div className="text-xs text-gray-600">종합점수</div>
          </div>
        </div>
      )}

      {/* 재신청 마감일 (미선정 과제) */}
      {project.canReapply && project.reapplyDeadline && (
        <div className="bg-orange-50 rounded-lg p-2 mb-3">
          <div className="text-xs text-orange-700">
            재신청 마감: <span className="font-medium">{project.reapplyDeadline}</span>
          </div>
        </div>
      )}

      {/* 공고문 링크 */}
      {project.announcement_link && (
        <div className="mb-3">
          <h4 className="text-sm font-bold text-gray-800 mb-2">공고문 링크</h4>
          <a 
            href={project.announcement_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
          >
            {project.announcement_link}
          </a>
        </div>
      )}

      {/* 프로젝트 설명 */}
      {project.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>}

      {/* 액션 버튼 */}
      {showActions && (
        <div className="flex gap-2" onDoubleClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" onClick={() => onDetailView?.(project)}>
            <Eye className="w-4 h-4 mr-1" />
            상세보기
          </Button>
          {project.status === "평가대기" || project.evaluationStatus !== "완료" ? (
            <Button variant="outline" size="sm" onClick={() => onEvaluationRegister?.(project)}>
              <Award className="w-4 h-4 mr-1" />
              평가 등록
            </Button>
          ) : project.evaluation ? (
            <Button variant="outline" size="sm" onClick={() => onEvaluationRegister?.(project)}>
              <Award className="w-4 h-4 mr-1" />
              평가 수정
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
