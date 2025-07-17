import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, FlaskRoundIcon as Flask, BarChart3, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">연구실 대시보드</h1>

        {/* 4분할 블록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* 오늘 일정 & 미팅 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-800" />
                  <h2 className="text-lg font-semibold">오늘 일정 & 미팅</h2>
                </div>
                <Link href="/schedule" className="text-sm text-blue-600 cursor-pointer">
                  전체보기
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-800 mt-0.5" />
                  <div>
                    <div className="font-medium">주간 연구 미팅</div>
                    <div className="text-sm text-gray-500">10:00 - 12:00 | 회의실 A</div>
                    <div className="text-xs text-gray-500 mt-1">참석자: 김교수, 이연구원 외 5명</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">장비 교육 세션</div>
                    <div className="text-sm text-gray-500">14:00 - 15:30 | 실험실 2</div>
                    <div className="text-xs text-gray-500 mt-1">참석자: 박연구원, 신입연구원 3명</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">논문 검토 미팅</div>
                    <div className="text-sm text-gray-500">16:00 - 17:00 | 온라인</div>
                    <div className="text-xs text-gray-500 mt-1">참석자: 김교수, 최연구원</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 인력현황 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-800" />
                  <h2 className="text-lg font-semibold">인력현황</h2>
                </div>
                <Link href="/people" className="text-sm text-blue-600 cursor-pointer">
                  전체보기
                </Link>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">출근 현황</span>
                  <span className="text-sm font-medium">15/18명 (83%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "83%" }}></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-green-800 font-medium text-lg">15</div>
                  <div className="text-xs text-gray-500">출근</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <div className="text-amber-800 font-medium text-lg">2</div>
                  <div className="text-xs text-gray-500">외근</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-red-800 font-medium text-lg">1</div>
                  <div className="text-xs text-gray-500">미출근</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>교수</span>
                  <span>2명</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>연구원</span>
                  <span>12명</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>대학원생</span>
                  <span>4명</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시약/장비 알림 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Flask className="w-5 h-5 text-blue-800" />
                  <h2 className="text-lg font-semibold">시약/장비 알림</h2>
                </div>
                <Link href="/equipment" className="text-sm text-blue-600 cursor-pointer">
                  전체보기
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium">시약 재고 부족</div>
                    <div className="text-sm text-gray-500">에탄올 (99.5%) - 잔여 100ml</div>
                    <div className="text-xs text-red-500 mt-1">재주문 필요</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <div className="font-medium">장비 유지보수 예정</div>
                    <div className="text-sm text-gray-500">전자현미경 - 2025.05.15</div>
                    <div className="text-xs text-amber-500 mt-1">사용 일정 조정 필요</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium">장비 예약 알림</div>
                    <div className="text-sm text-gray-500">질량분석기 - 오늘 13:00~15:00</div>
                    <div className="text-xs text-blue-500 mt-1">예약자: 이연구원</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 예산현황 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-800" />
                  <h2 className="text-lg font-semibold">예산현황</h2>
                </div>
                <Link href="/budget" className="text-sm text-blue-600 cursor-pointer">
                  전체보기
                </Link>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">총 예산 집행률</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-blue-800 font-medium text-lg">12</div>
                  <div className="text-xs text-gray-500">논문</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-purple-800 font-medium text-lg">5</div>
                  <div className="text-xs text-gray-500">특허</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>인공지능 기반 자율주행</span>
                  <span className="text-green-600">72%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>친환경 소재 개발</span>
                  <span className="text-amber-600">45%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>고효율 배터리 시스템</span>
                  <span className="text-red-600">83%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 추가 대시보드 내용 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">연구 프로젝트 현황</h2>
                <Link href="/projects" className="text-sm text-blue-600 hover:underline">
                  전체보기
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="text-left py-2">과제명</th>
                      <th className="text-left py-2">기관</th>
                      <th className="text-left py-2">연구책임자</th>
                      <th className="text-left py-2">종료일</th>
                      <th className="text-left py-2">상태</th>
                      <th className="text-left py-2">집행률</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">인공지능 기반 자율주행 기술 개발</td>
                      <td>과학기술정보통신부</td>
                      <td>김교수</td>
                      <td>2026-03-31</td>
                      <td>
                        <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded">진행중</span>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <span>72%</span>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "72%" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">친환경 소재 개발 연구</td>
                      <td>환경부</td>
                      <td>이교수</td>
                      <td>2025-12-31</td>
                      <td>
                        <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded">진행중</span>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <span>45%</span>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">고효율 배터리 시스템 개발</td>
                      <td>산업통상자원부</td>
                      <td>박교수</td>
                      <td>2025-05-31</td>
                      <td>
                        <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded">마감임박</span>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <span>83%</span>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "83%" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">공지사항</h2>
                <Link href="/schedule" className="text-sm text-blue-600 cursor-pointer">
                  더보기
                </Link>
              </div>
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-3">
                  <div className="text-sm font-medium mb-1">2025년 연구비 집행 지침 안내</div>
                  <div className="text-xs text-gray-500">2025-04-15 · 행정실</div>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <div className="text-sm font-medium mb-1">신규 장비 도입 및 사용 교육 안내</div>
                  <div className="text-xs text-gray-500">2025-04-10 · 장비관리팀</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">5월 정기 안전교육 일정 안내</div>
                  <div className="text-xs text-gray-500">2025-04-05 · 안전관리자</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
