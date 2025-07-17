"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Download,
  Search,
  Building,
  Calendar,
  Users,
  BarChart3,
  FileText,
  MapPin,
  FileBarChart,
  PieChart,
  BookOpen,
  Plus,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/projects">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-medium">연구과제 상세</h1>
      </div>

      {/* 프로젝트 헤더 */}
      <div>
        <h2 className="text-xl font-bold text-blue-700 mb-3">인공지능 기반 자율주행 기술 개발</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">국가 R&D</span>
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md">친환경</span>
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-md">AI</span>
          <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-md">자율주행</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <Building className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">주관기관:</div>
              <div className="text-sm font-medium">과학기술정보통신부</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">수행기간:</div>
              <div className="text-sm font-medium">2023.04.01 ~ 2026.03.31</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">참여인원:</div>
              <div className="text-sm font-medium">12명 명</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">진행률:</div>
              <div className="text-sm font-medium">72%</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <button
              className={`flex items-center gap-1.5 px-2 py-1 text-sm ${activeTab === "overview" ? "text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("overview")}
            >
              <MapPin className="w-4 h-4" />
              과제 개요
            </button>
            <button
              className={`flex items-center gap-1.5 px-2 py-1 text-sm ${activeTab === "progress" ? "text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("progress")}
            >
              <FileBarChart className="w-4 h-4" />
              진행 현황
            </button>
            <button
              className={`flex items-center gap-1.5 px-2 py-1 text-sm ${activeTab === "team" ? "text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("team")}
            >
              <Users className="w-4 h-4" />
              연구 인력
            </button>
            <button
              className={`flex items-center gap-1.5 px-2 py-1 text-sm ${activeTab === "outputs" ? "text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("outputs")}
            >
              <FileText className="w-4 h-4" />
              연구 성과
            </button>
            <button
              className={`flex items-center gap-1.5 px-2 py-1 text-sm ${activeTab === "budget" ? "text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("budget")}
            >
              <PieChart className="w-4 h-4" />
              예산
            </button>
            <button
              className={`flex items-center gap-1.5 px-2 py-1 text-sm ${activeTab === "documents" ? "text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("documents")}
            >
              <BookOpen className="w-4 h-4" />
              문서
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              보고서 다운로드
            </Button>
            <Button size="sm" className="flex items-center gap-1.5 bg-black text-white hover:bg-gray-800">
              <FileText className="w-4 h-4" />
              보고서 생성
            </Button>
          </div>
        </div>
      </div>

      {/* 프로젝트 개요 */}
      {activeTab === "overview" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">과제 개요</h3>
            <p className="text-sm text-gray-700 mb-6">
              본 연구는 인공지능 기술을 활용한 자율주행 시스템의 성능 향상을 목표로 합니다. 특히 도심 환경에서의 복잡한
              주행 상황에 대응할 수 있는 딥러닝 기반 객체 인식 및 경로 계획 고도화 개발에 중점을 두고 있습니다. 센서
              융합 기술과 강화학습을 통해 다양한 주행 환경에서의 안정적인 주행성능 높이는 기술을 연구합니다.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <div className="min-w-4 mt-1">▶</div>
                <p className="text-sm">
                  연구 목표: 도심 환경에서 98% 이상의 객체 인식 정확도와 안전한 주행 경로 계획 알고리즘 개발
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="min-w-4 mt-1">▶</div>
                <p className="text-sm">
                  핵심 기술: 딥러닝 기반 실시간 객체 인식, 강화학습 기반 경로 계획, 센서 융합 기술
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="min-w-4 mt-1">▶</div>
                <p className="text-sm">기대 효과: 자율주행 기술의 상용화 가속화, 교통사고 감소, 모빌리티 서비스 혁신</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">주요 기술 개발 내용</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-500">기술 분류</th>
                    <th className="text-left py-2 font-medium text-gray-500">세부 기술</th>
                    <th className="text-left py-2 font-medium text-gray-500">개발 목표</th>
                    <th className="text-left py-2 font-medium text-gray-500">진행 상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          1
                        </div>
                        <span>객체 인식</span>
                      </div>
                    </td>
                    <td className="py-3">딥러닝 기반 실시간 탐지</td>
                    <td className="py-3">98% 정확도 달성</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">완료</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          2
                        </div>
                        <span>경로 계획</span>
                      </div>
                    </td>
                    <td className="py-3">강화학습 기반 충돌 회피</td>
                    <td className="py-3">도시 주행 시나리오 적적화</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">진행중</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          3
                        </div>
                        <span>센서 융합</span>
                      </div>
                    </td>
                    <td className="py-3">LIDAR + Camera 통합</td>
                    <td className="py-3">실시간 정확성 향상</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">진행중</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          4
                        </div>
                        <span>시뮬레이션</span>
                      </div>
                    </td>
                    <td className="py-3">가상환경 주행 테스트</td>
                    <td className="py-3">수천 시간 규모 테스트 수행</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">예정</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 진행 현황 */}
      {activeTab === "progress" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">진행 현황 요약</h3>
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">전체 진행률</div>
              <div className="flex items-center gap-4">
                <Progress value={72} className="h-2 flex-1" />
                <span className="text-sm font-medium">72%</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">1단계: 기초 연구 및 데이터 수집 (완료)</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">2단계: 알고리즘 개발 및 테스트 (65% 완료)</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                  <span className="text-sm font-medium">3단계: 실차 검증 및 상용화 준비 (예정)</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">마일스톤 현황</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-500">마일스톤</th>
                    <th className="text-left py-2 font-medium text-gray-500">목표일</th>
                    <th className="text-left py-2 font-medium text-gray-500">완료일</th>
                    <th className="text-left py-2 font-medium text-gray-500">담당자</th>
                    <th className="text-left py-2 font-medium text-gray-500">상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">데이터셋 구축 완료</td>
                    <td className="py-3">2023-09-30</td>
                    <td className="py-3">2023-09-25</td>
                    <td className="py-3">이연구원</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">완료</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">객체 인식 알고리즘 개발</td>
                    <td className="py-3">2024-03-31</td>
                    <td className="py-3">2024-04-10</td>
                    <td className="py-3">김교수</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">완료</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">경로 계획 알고리즘 개발</td>
                    <td className="py-3">2024-09-30</td>
                    <td className="py-3">-</td>
                    <td className="py-3">박연구원</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">진행중</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">센서 융합 시스템 구현</td>
                    <td className="py-3">2024-12-31</td>
                    <td className="py-3">-</td>
                    <td className="py-3">최연구원</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">진행중</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">실차 테스트 완료</td>
                    <td className="py-3">2025-10-31</td>
                    <td className="py-3">-</td>
                    <td className="py-3">김교수</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">예정</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">이슈 및 위험 요소</h3>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">센서 부품 공급 지연</h4>
                    <p className="text-sm text-amber-700">
                      LIDAR 센서 글로벌공급망 생산 지연으로 인해 센서 융합 시스템 개발이 지연될 위험이 있습니다. 대체
                      공급업체 검토 중입니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">알고리즘 성능 이슈</h4>
                    <p className="text-sm text-red-700">
                      악천후 조건에서 객체 인식 정확도가 목표치에 미달합니다. 추가 데이터셋 수집 및 알고리즘 개선이
                      필요합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 연구 인력 */}
      {activeTab === "team" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">연구팀 구성</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-500">이름</th>
                    <th className="text-left py-2 font-medium text-gray-500">직위</th>
                    <th className="text-left py-2 font-medium text-gray-500">소속</th>
                    <th className="text-left py-2 font-medium text-gray-500">담당 분야</th>
                    <th className="text-left py-2 font-medium text-gray-500">참여 기간</th>
                    <th className="text-left py-2 font-medium text-gray-500">기여율</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">김교수</td>
                    <td className="py-3">교수 (연구책임자)</td>
                    <td className="py-3">컴퓨터공학과</td>
                    <td className="py-3">총괄, 객체 인식 알고리즘</td>
                    <td className="py-3">2023.04 ~ 2026.03</td>
                    <td className="py-3">30%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">이연구원</td>
                    <td className="py-3">선임연구원</td>
                    <td className="py-3">AI연구소</td>
                    <td className="py-3">딥러닝 모델 개발</td>
                    <td className="py-3">2023.04 ~ 2026.03</td>
                    <td className="py-3">100%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">박연구원</td>
                    <td className="py-3">선임연구원</td>
                    <td className="py-3">AI연구소</td>
                    <td className="py-3">경로 계획 알고리즘</td>
                    <td className="py-3">2023.04 ~ 2026.03</td>
                    <td className="py-3">100%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">최연구원</td>
                    <td className="py-3">연구원</td>
                    <td className="py-3">AI연구소</td>
                    <td className="py-3">센서 융합 시스템</td>
                    <td className="py-3">2023.04 ~ 2026.03</td>
                    <td className="py-3">100%</td>
                  </tr>
                  <tr>
                    <td className="py-3">정연구원</td>
                    <td className="py-3">연구원</td>
                    <td className="py-3">AI연구소</td>
                    <td className="py-3">시뮬레이션 환경 구축</td>
                    <td className="py-3">2023.04 ~ 2026.03</td>
                    <td className="py-3">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">주요 연구자 성과</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-xl font-bold">
                  김
                </div>
                <h4 className="font-medium mb-1">김교수</h4>
                <p className="text-xs text-gray-500 mb-4">연구책임자</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-700">3</div>
                    <div className="text-xs text-gray-500">논문</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-700">2</div>
                    <div className="text-xs text-gray-500">특허</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-700">4</div>
                    <div className="text-xs text-gray-500">학회</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-xl font-bold">
                  이
                </div>
                <h4 className="font-medium mb-1">이연구원</h4>
                <p className="text-xs text-gray-500 mb-4">선임연구원</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-700">2</div>
                    <div className="text-xs text-gray-500">논문</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-700">1</div>
                    <div className="text-xs text-gray-500">특허</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-700">2</div>
                    <div className="text-xs text-gray-500">학회</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-xl font-bold">
                  박
                </div>
                <h4 className="font-medium mb-1">박연구원</h4>
                <p className="text-xs text-gray-500 mb-4">선임연구원</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-700">1</div>
                    <div className="text-xs text-gray-500">논문</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-700">1</div>
                    <div className="text-xs text-gray-500">특허</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-700">3</div>
                    <div className="text-xs text-gray-500">학회</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-xl font-bold">
                  최
                </div>
                <h4 className="font-medium mb-1">최연구원</h4>
                <p className="text-xs text-gray-500 mb-4">연구원</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-700">1</div>
                    <div className="text-xs text-gray-500">논문</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-700">1</div>
                    <div className="text-xs text-gray-500">특허</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-700">2</div>
                    <div className="text-xs text-gray-500">학회</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">회의 일정</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-1">주간 연구 미팅</h4>
                <p className="text-sm text-gray-600">매주 화요일 10:00 - 12:00</p>
                <p className="text-sm text-gray-600">장소: 연구 회의실</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-1">알고리즘 개발팀 미팅</h4>
                <p className="text-sm text-gray-600">매주 목요일 14:00 - 16:00</p>
                <p className="text-sm text-gray-600">참석자: 김교수, 이연구원, 박연구원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-1">현장기관 점검 미팅</h4>
                <p className="text-sm text-gray-600">매월 첫째 금요일 15:00 - 17:00</p>
                <p className="text-sm text-gray-600">참석자: 김교수, 현장기관 담당자</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">인력 충원 계획</h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-1">딥러닝 엔지니어</h4>
                <p className="text-sm text-gray-600">2025년 3분기 채용 예정</p>
                <p className="text-sm text-gray-600">업무: 객체 인식 알고리즘 고도화 3명</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-1">시스템 엔지니어</h4>
                <p className="text-sm text-gray-600">2025년 3분기 채용 예정</p>
                <p className="text-sm text-gray-600">업무: 실차 테스트 시스템 구축</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 연구 성과 */}
      {activeTab === "outputs" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">연구 성과 요약</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">논문</div>
                <div className="text-3xl font-bold text-blue-700">5</div>
                <div className="text-xs text-gray-500 mt-1">SCI급 3편, 국내 2편</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">특허</div>
                <div className="text-3xl font-bold text-purple-700">3</div>
                <div className="text-xs text-gray-500 mt-1">국내 2건, 해외 1건</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">학회 발표</div>
                <div className="text-3xl font-bold text-amber-700">7</div>
                <div className="text-xs text-gray-500 mt-1">국제 4건, 국내 3건</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">수상</div>
                <div className="text-3xl font-bold text-green-700">1</div>
                <div className="text-xs text-gray-500 mt-1">우수 연구상</div>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="text-center text-gray-400">
                <BarChart3 className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm">연구 성과 추이 그래프</p>
                <p className="text-xs">연도별 성과 추이</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">논문 목록</h3>
            <div className="space-y-6 mb-8">
              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium text-blue-700">딥러닝 기반 자율주행 알고리즘 성능 향상에 관한 연구</h4>
                  <Button variant="outline" size="sm" className="h-7">
                    <span className="text-xs">SCI(E)</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-2">김교수, 이연구원 | IEEE Transactions on AI | 2025-03-15</p>
                <p className="text-sm text-gray-600">
                  본 논문은 YOLOv8과 Transformer를 결합한 새로운 객체 인식 알고리즘을 제안하고, 다양한 주행 환경에서의
                  성능을 평가했습니다. 제안된 알고리즘은 기존 방식 대비 15% 향상된 정확도를 보였습니다.
                </p>
                <div className="flex justify-end mt-2">
                  <Button variant="ghost" size="sm" className="h-7 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-xs">PDF</span>
                  </Button>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium text-blue-700">강화학습을 활용한 자율주행 차량의 경로 계획 최적화</h4>
                  <Button variant="outline" size="sm" className="h-7">
                    <span className="text-xs">SCI(E)</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  박연구원, 김교수 | Robotics and Autonomous Systems | 2024-11-20
                </p>
                <p className="text-sm text-gray-600">
                  본 논문은 복잡한 도심 환경에서 자율주행 차량의 경로 계획을 위한 강화학습 기반 알고리즘을 제안했습니다.
                  시뮬레이션 결과, 제안된 방법은 기존 방식 대비 안전성과 효율성 측면에서 우수한 성능을 보였습니다.
                </p>
                <div className="flex justify-end mt-2">
                  <Button variant="ghost" size="sm" className="h-7 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-xs">PDF</span>
                  </Button>
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium text-blue-700">
                    LIDAR와 카메라 센서 융합을 통한 자율주행 차량의 인식 성능 향상
                  </h4>
                  <Button variant="outline" size="sm" className="h-7">
                    <span className="text-xs">SCI(E)</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-2">최연구원, 김교수 | Sensors | 2024-08-05</p>
                <p className="text-sm text-gray-600">
                  본 논문은 LIDAR와 카메라 센서를 효과적인 융합 방법을 제안하고, 다양한 주행 환경에서의 성능을
                  평가했습니다. 제안된 방법은 특히 악천후 조건에서 단일 센서 대비 높은 인식률을 보였습니다.
                </p>
                <div className="flex justify-end mt-2">
                  <Button variant="ghost" size="sm" className="h-7 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-xs">PDF</span>
                  </Button>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">특허 목록</h3>
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-1">자율주행차량의 실시간 장애물 인식 시스템</h4>
                <p className="text-sm text-gray-600">2025-04-15 | 출원번호: 10-2025-0098765 | 김교수, 이연구원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-1">강화학습 기반 자율주행 경로 계획 알고리즘</h4>
                <p className="text-sm text-gray-600">2024-10-30 | 출원번호: 10-2024-0076543 | 박연구원, 김교수</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-1">Sensor Fusion System for Autonomous Vehicles</h4>
                <p className="text-sm text-gray-600">2024-03-20 | US Patent App. 17/023,456 | 김교수, 최연구원</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">학회 발표</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-1">자율주행차량의 실시간 장애물 인식 시스템</h4>
                <p className="text-sm text-gray-600">2025-04-15 | 한국지능시스템학회 | 김교수, 박연구원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-1">강화학습 기반 자율주행 경로 계획 알고리즘</h4>
                <p className="text-sm text-gray-600">2024-11-30 | 한국자동차공학회 추계학술대회 | 박연구원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-1">Multi-modal Sensor Fusion for Autonomous Driving</h4>
                <p className="text-sm text-gray-600">
                  2024-09-20 | IEEE Intelligent Vehicles Symposium | 최연구원, 김교수
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">성과 목표</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">논문</span>
                  <span className="text-sm text-gray-500">5 / 10 (50%)</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">특허</span>
                  <span className="text-sm text-gray-500">3 / 5 (60%)</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">학회 발표</span>
                  <span className="text-sm text-gray-500">7 / 8 (88%)</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">기술이전</span>
                  <span className="text-sm text-gray-500">0 / 2 (0%)</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 예산 */}
      {activeTab === "budget" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">예산 개요</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">총 예산</div>
                <div className="text-3xl font-bold text-blue-700">12억 원</div>
                <div className="text-xs text-gray-500 mt-1">3년 (2023-2026)</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">집행액</div>
                <div className="text-3xl font-bold text-green-700">8.64억 원</div>
                <div className="text-xs text-gray-500 mt-1">집행률 72%</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">잔액</div>
                <div className="text-3xl font-bold text-amber-700">3.36억 원</div>
                <div className="text-xs text-gray-500 mt-1">잔여율 28%</div>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="text-center text-gray-400">
                <PieChart className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm">예산 집행 추이 그래프</p>
                <p className="text-xs">분기별 예산 집행 현황</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">비목별 예산 현황</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-500">비목</th>
                    <th className="text-left py-2 font-medium text-gray-500">예산</th>
                    <th className="text-left py-2 font-medium text-gray-500">집행액</th>
                    <th className="text-left py-2 font-medium text-gray-500">잔액</th>
                    <th className="text-left py-2 font-medium text-gray-500">집행률</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">인건비</td>
                    <td className="py-3">6억 원</td>
                    <td className="py-3">4.5억 원</td>
                    <td className="py-3">1.5억 원</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="h-2 w-24" />
                        <span>75%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">연구장비비</td>
                    <td className="py-3">3억 원</td>
                    <td className="py-3">2.4억 원</td>
                    <td className="py-3">0.6억 원</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={80} className="h-2 w-24" />
                        <span>80%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">연구활동비</td>
                    <td className="py-3">2억 원</td>
                    <td className="py-3">1.2억 원</td>
                    <td className="py-3">0.8억 원</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={60} className="h-2 w-24" />
                        <span>60%</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">연구재료비</td>
                    <td className="py-3">1억 원</td>
                    <td className="py-3">0.54억 원</td>
                    <td className="py-3">0.46억 원</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={54} className="h-2 w-24" />
                        <span>54%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">예산 조정 내역</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">→</div>
                  <div>
                    <h4 className="font-medium">연구팀비 → 연구장비비</h4>
                    <p className="text-sm text-gray-600">2025-02-15 | 2,000만원</p>
                    <p className="text-sm text-gray-600">사유: 센서 추가 구매 필요</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">→</div>
                  <div>
                    <h4 className="font-medium">연구활동비 → 인건비</h4>
                    <p className="text-sm text-gray-600">2024-09-10 | 1,500만원</p>
                    <p className="text-sm text-gray-600">사유: 연구원 추가 채용</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">향후 예산 계획</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-1">실차 테스트 장비</h4>
                <p className="text-sm text-gray-600">2025년 3분기 예정</p>
                <p className="text-sm text-gray-600">예산: 1.5억 원</p>
                <Progress value={0} className="h-2 mt-2" />
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-1">국제 학회 참가</h4>
                <p className="text-sm text-gray-600">2025년 4분기 예정</p>
                <p className="text-sm text-gray-600">예산: 0.6억 원</p>
                <Progress value={0} className="h-2 mt-2" />
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-1">연구원 인건비</h4>
                <p className="text-sm text-gray-600">2025년 1-4분기</p>
                <p className="text-sm text-gray-600">예산: 1.2억 원</p>
                <Progress value={0} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 문서 */}
      {activeTab === "documents" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">문서 목록</h3>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-1" /> 문서 등록
              </Button>
            </div>

            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="문서 검색..." className="pl-9" />
              </div>
              <select className="ml-2 p-2 border border-gray-200 rounded-md text-sm">
                <option>최신순</option>
                <option>이름순</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-500">문서명</th>
                    <th className="text-left py-2 font-medium text-gray-500">유형</th>
                    <th className="text-left py-2 font-medium text-gray-500">작성자</th>
                    <th className="text-left py-2 font-medium text-gray-500">등록일</th>
                    <th className="text-left py-2 font-medium text-gray-500">버전</th>
                    <th className="text-left py-2 font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">인공지능 기반 자율주행 기술 개발 계획서</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">계획서</span>
                    </td>
                    <td className="py-3">김교수</td>
                    <td className="py-3">2023-04-01</td>
                    <td className="py-3">1.0</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">객체 인식 알고리즘 성능 평가 보고서</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">보고서</span>
                    </td>
                    <td className="py-3">이연구원</td>
                    <td className="py-3">2024-04-10</td>
                    <td className="py-3">2.1</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">센서 융합 시스템 설계 문서</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md">기술문서</span>
                    </td>
                    <td className="py-3">최연구원</td>
                    <td className="py-3">2024-08-15</td>
                    <td className="py-3">1.3</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">경로 계획 알고리즘 개발 중간 보고서</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">보고서</span>
                    </td>
                    <td className="py-3">박연구원</td>
                    <td className="py-3">2024-09-30</td>
                    <td className="py-3">1.0</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">주간 연구 미팅 회의록 (2025-04-15)</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-md">회의록</span>
                    </td>
                    <td className="py-3">정연구원</td>
                    <td className="py-3">2025-04-15</td>
                    <td className="py-3">1.0</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">최근 문서 활동</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">주간 연구 미팅 회의록 등록</h4>
                      <p className="text-xs text-gray-500">2025-04-15</p>
                      <p className="text-xs text-gray-500">정연구원</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">객체 인식 알고리즘 성능 평가 보고서</h4>
                      <p className="text-xs text-gray-500">2025-04-10</p>
                      <p className="text-xs text-gray-500">이연구원</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">센서 융합 모듈 코드 리뷰</h4>
                      <p className="text-xs text-gray-500">2025-04-05</p>
                      <p className="text-xs text-gray-500">최연구원</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">문서 통계</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">보고서</span>
                      <span className="text-sm text-gray-500">8건</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">회의록</span>
                      <span className="text-sm text-gray-500">12건</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">기술문서</span>
                      <span className="text-sm text-gray-500">5건</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">계획서</span>
                      <span className="text-sm text-gray-500">3건</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">문서 템플릿</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-50 p-2 rounded">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">연구 보고서 템플릿</h4>
                    <p className="text-xs text-gray-500">DOCX 형식</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-auto flex items-center justify-center">
                  <Download className="h-3.5 w-3.5 mr-1" /> 다운로드
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-green-50 p-2 rounded">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">회의록 템플릿</h4>
                    <p className="text-xs text-gray-500">DOCX 형식</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-auto flex items-center justify-center">
                  <Download className="h-3.5 w-3.5 mr-1" /> 다운로드
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-purple-50 p-2 rounded">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">기술 문서 템플릿</h4>
                    <p className="text-xs text-gray-500">DOCX 형식</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-auto flex items-center justify-center">
                  <Download className="h-3.5 w-3.5 mr-1" /> 다운로드
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-amber-50 p-2 rounded">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">발표 자료 템플릿</h4>
                    <p className="text-xs text-gray-500">PPTX 형식</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-auto flex items-center justify-center">
                  <Download className="h-3.5 w-3.5 mr-1" /> 다운로드
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <h3 className="text-lg font-semibold">진행 상황 보고서</h3>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <Download className="w-4 h-4" /> 모든 보고서 다운로드
              </Button>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">2025년 1분기 진행 보고서</h4>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">2024년 4분기 진행 보고서</h4>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">2024년 3분기 진행 보고서</h4>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
