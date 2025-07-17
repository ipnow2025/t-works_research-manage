import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users } from "lucide-react"

export default function SchedulePage() {
  // 현재 월의 일 수 계산을 위한 데이터
  const daysInMonth = 30 // 4월은 30일
  const firstDayOfMonth = 1 // 4월 1일은 월요일 (0: 일요일, 1: 월요일, ...)

  // 캘린더 그리드를 위한 날짜 배열 생성
  const calendarDays = []

  // 첫 주 시작 전 빈 칸 추가
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // 날짜 추가
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // 이벤트가 있는 날짜
  const eventDays = [3, 9, 15, 24, 29]

  // 오늘 날짜
  const today = 21

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">일정관리</h1>
      </div>

      {/* 필터 섹션 */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">과제 선택</label>
              <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="all">
                <option value="all">전체 과제</option>
                <option value="project1">인공지능 기반 자율주행 기술 개발</option>
                <option value="project2">친환경 소재 개발 연구</option>
                <option value="project3">고효율 배터리 시스템 개발</option>
                <option value="project4">미래 모빌리티 플랫폼 개발</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">일정 유형</label>
              <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="all">
                <option value="all">전체</option>
                <option value="meeting">회의</option>
                <option value="report">보고서 제출</option>
                <option value="deadline">마감일</option>
                <option value="conference">학회</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">기간</label>
              <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="month">
                <option value="month">월간</option>
                <option value="week">주간</option>
                <option value="day">일간</option>
              </select>
            </div>

            <div className="flex-1 min-w-[250px] relative">
              <Input type="text" placeholder="일정 검색..." className="w-full" />
            </div>

            <Button className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" />새 일정 등록
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {/* 캘린더 */}
          <Card className="mb-5">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">2025년 4월</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* 요일 헤더 */}
                <div className="text-center py-2 text-sm font-medium text-gray-500">일</div>
                <div className="text-center py-2 text-sm font-medium text-gray-500">월</div>
                <div className="text-center py-2 text-sm font-medium text-gray-500">화</div>
                <div className="text-center py-2 text-sm font-medium text-gray-500">수</div>
                <div className="text-center py-2 text-sm font-medium text-gray-500">목</div>
                <div className="text-center py-2 text-sm font-medium text-gray-500">금</div>
                <div className="text-center py-2 text-sm font-medium text-gray-500">토</div>

                {/* 날짜 그리드 */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square border border-gray-100 p-1 relative
                      ${day === today ? "bg-blue-800 text-white" : ""}
                      ${day === null ? "bg-gray-50" : ""}
                    `}
                  >
                    {day !== null && (
                      <>
                        <div className="text-sm p-1">{day}</div>
                        {eventDays.includes(day) && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-800 rounded-full"></div>
                        )}
                        {day === 3 && (
                          <div className="absolute bottom-3 left-0 right-0 bg-blue-100 text-blue-800 text-xs p-0.5 truncate">
                            중간보고서 제출
                          </div>
                        )}
                        {day === 15 && (
                          <div className="absolute bottom-3 left-0 right-0 bg-green-100 text-green-800 text-xs p-0.5 truncate">
                            연구팀 회의
                          </div>
                        )}
                        {day === 24 && (
                          <div className="absolute bottom-3 left-0 right-0 bg-amber-100 text-amber-800 text-xs p-0.5 truncate">
                            중간 보고회
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 일정 목록 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">일정 목록</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    주간 보기
                  </Button>
                  <Button variant="outline" size="sm">
                    월간 보기
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="text-sm text-gray-500 mb-1">2025년 4월 24일 (목) 14:00 - 16:00</div>
                  <div className="text-lg font-medium mb-2">고효율 배터리 시스템 개발 중간 보고회</div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      대회의실
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      박교수, 연구팀 전체
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      고효율 배터리 시스템 개발
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="text-sm text-gray-500 mb-1">2025년 4월 29일 (화) 23:59</div>
                  <div className="text-lg font-medium mb-2">친환경 소재 개발 연구 논문 제출 마감</div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      온라인
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      이교수, 김연구원
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      친환경 소재 개발 연구
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <div className="text-sm text-gray-500 mb-1">2025년 5월 10일 (토) 18:00</div>
                  <div className="text-lg font-medium mb-2">과학기술정보통신부 연구비 정산 마감</div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      행정실
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      김교수, 행정담당자
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      인공지능 기반 자율주행 기술 개발
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="text-sm text-gray-500 mb-1">2025년 5월 15일 (목) 10:00 - 12:00</div>
                  <div className="text-lg font-medium mb-2">미래 모빌리티 플랫폼 개발 최종 보고회</div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      대강당
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      최교수, 연구팀 전체, 외부 평가위원
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      미래 모빌리티 플랫폼 개발
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {/* 다가오는 일정 */}
          <Card className="mb-5">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4">다가오는 일정</h2>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">고효율 배터리 시스템 개발 중간 보고회</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      2025년 4월 24일 (목) 14:00
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      대회의실
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">친환경 소재 개발 연구 논문 제출 마감</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      2025년 4월 29일 (화) 23:59
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      온라인
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">과학기술정보통신부 연구비 정산 마감</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      2025년 5월 10일 (토) 18:00
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      행정실
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-purple-100 text-purple-800 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">미래 모빌리티 플랫폼 개발 최종 보고회</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      2025년 5월 15일 (목) 10:00
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      대강당
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 일정 통계 */}
          <Card className="mb-5">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4">일정 통계</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">회의</span>
                    <span className="text-sm">8건</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">보고서 제출</span>
                    <span className="text-sm">5건</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">마감일</span>
                    <span className="text-sm">4건</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">학회</span>
                    <span className="text-sm">3건</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">이번 달 총 일정</span>
                  <span className="text-lg font-bold text-blue-800">20건</span>
                </div>
                <div className="text-xs text-gray-500">전월 대비 15% 증가</div>
              </div>
            </CardContent>
          </Card>

          {/* 공지사항 */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">공지사항</h2>
                <span className="text-sm text-blue-600 cursor-pointer">글쓰기</span>
              </div>
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-3">
                  <div className="text-sm font-medium mb-1 hover:text-blue-600 cursor-pointer">
                    2025년 연구비 집행 지침 안내
                  </div>
                  <div className="text-xs text-gray-500">2025-04-15 · 행정실</div>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <div className="text-sm font-medium mb-1 hover:text-blue-600 cursor-pointer">
                    신규 장비 도입 및 사용 교육 안내
                  </div>
                  <div className="text-xs text-gray-500">2025-04-10 · 장비관리팀</div>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <div className="text-sm font-medium mb-1 hover:text-blue-600 cursor-pointer">
                    5월 정기 안전교육 일정 안내
                  </div>
                  <div className="text-xs text-gray-500">2025-04-05 · 안전관리자</div>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <div className="text-sm font-medium mb-1 hover:text-blue-600 cursor-pointer">
                    연구실 안전 점검 결과 보고
                  </div>
                  <div className="text-xs text-gray-500">2025-03-28 · 안전관리자</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1 hover:text-blue-600 cursor-pointer">
                    2025년 1분기 연구 성과 보고서 제출 안내
                  </div>
                  <div className="text-xs text-gray-500">2025-03-20 · 연구지원팀</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
