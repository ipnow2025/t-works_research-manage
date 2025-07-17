"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, Download, Plus, TrendingUp, TrendingDown, X, Upload } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function BudgetPage() {
  const [showBudgetPlanForm, setShowBudgetPlanForm] = useState(false)
  const [budgetPlanForm, setBudgetPlanForm] = useState({
    category: "",
    date: "",
    description: "",
    amount: "",
    user: "",
    file: null,
  })

  const handleBudgetPlanChange = (e) => {
    const { name, value } = e.target
    setBudgetPlanForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setBudgetPlanForm((prev) => ({
      ...prev,
      file: e.target.files[0],
    }))
  }

  const handleBudgetPlanSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    setShowBudgetPlanForm(false)
    // Reset form
    setBudgetPlanForm({
      category: "",
      date: "",
      description: "",
      amount: "",
      user: "",
      file: null,
    })
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">예산관리</h1>
      </div>

      {/* 필터 섹션 */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">과제 선택</label>
              <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="project1">
                <option value="all">전체 과제</option>
                <option value="project1">인공지능 기반 자율주행 기술 개발</option>
                <option value="project2">친환경 소재 개발 연구</option>
                <option value="project3">고효율 배터리 시스템 개발</option>
                <option value="project4">미래 모빌리티 플랫폼 개발</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">연도</label>
              <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="2025">
                <option value="2025">2025년</option>
                <option value="2024">2024년</option>
                <option value="2023">2023년</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">분기</label>
              <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="all">
                <option value="all">전체</option>
                <option value="q1">1분기</option>
                <option value="q2">2분기</option>
                <option value="q3">3분기</option>
                <option value="q4">4분기</option>
              </select>
            </div>

            <Button className="flex items-center gap-1.5 mt-auto" onClick={() => setShowBudgetPlanForm(true)}>
              <Plus className="w-4 h-4" />
              예산계획 등록
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 예산 개요 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium">총 연구비</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-800 mb-2.5">2.5억 원</div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>총 연구비 중</div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="w-3.5 h-3.5" />
                전년 대비 15% 증가
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium">현재 집행액</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-800 mb-2.5">1.75억 원</div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>집행률 72%</div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="w-3.5 h-3.5" />
                전월 대비 8% 증가
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium">잔여 예산</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-800 mb-2.5">0.75억 원</div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>잔여율 28%</div>
              <div className="flex items-center gap-1 text-red-500">
                <TrendingDown className="w-3.5 h-3.5" />
                전월 대비 8% 감소
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium">예산 집행 추이</div>
              <select className="p-1.5 border border-gray-200 rounded-md text-sm min-w-[100px]" defaultValue="monthly">
                <option value="monthly">월별</option>
                <option value="quarterly">분기별</option>
              </select>
            </div>
            <div className="bg-gray-50 rounded-lg h-60 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-2.5"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18.4 8.64 8.58 18.46" />
                  <path d="m10.34 8.64 8.06 9.82" />
                </svg>
                <p>예산 집행 추이 그래프</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-medium">비목별 예산 구성</div>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                <HelpCircle className="w-3.5 h-3.5" />
                도움말
              </Button>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <div className="font-medium">인건비</div>
                  <div className="text-gray-500">1.2억 / 1.4억 (85%)</div>
                </div>
                <div className="w-full bg-gray-200 rounded-md h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-md" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <div className="font-medium">연구활동비</div>
                  <div className="text-gray-500">0.25억 / 0.4억 (63%)</div>
                </div>
                <div className="w-full bg-gray-200 rounded-md h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-md" style={{ width: "63%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <div className="font-medium">연구재료비</div>
                  <div className="text-gray-500">0.22억 / 0.3억 (73%)</div>
                </div>
                <div className="w-full bg-gray-200 rounded-md h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-md" style={{ width: "73%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <div className="font-medium">연구장비비</div>
                  <div className="text-gray-500">0.08억 / 0.4억 (20%)</div>
                </div>
                <div className="w-full bg-gray-200 rounded-md h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-md" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 예산 집행 내역 */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold">최근 예산 집행 내역</div>
            <Button variant="outline" className="flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              엑셀 다운로드
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-medium text-gray-500">지출일자</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">비목</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">내역</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">담당자</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">금액</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3">2025-03-15</td>
                  <td className="p-3">인건비</td>
                  <td className="p-3">3월 연구원 인건비</td>
                  <td className="p-3">김담당</td>
                  <td className="p-3">2,500만원</td>
                  <td className="p-3">
                    <span className="text-green-500">승인완료</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3">2025-03-10</td>
                  <td className="p-3">연구재료비</td>
                  <td className="p-3">센서 모듈 구매</td>
                  <td className="p-3">이연구</td>
                  <td className="p-3">850만원</td>
                  <td className="p-3">
                    <span className="text-green-500">승인완료</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3">2025-03-05</td>
                  <td className="p-3">연구활동비</td>
                  <td className="p-3">학회 참가비</td>
                  <td className="p-3">박연구</td>
                  <td className="p-3">120만원</td>
                  <td className="p-3">
                    <span className="text-green-500">승인완료</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3">2025-02-28</td>
                  <td className="p-3">연구장비비</td>
                  <td className="p-3">테스트 장비 임대</td>
                  <td className="p-3">최담당</td>
                  <td className="p-3">350만원</td>
                  <td className="p-3">
                    <span className="text-green-500">승인완료</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">2025-02-20</td>
                  <td className="p-3">연구활동비</td>
                  <td className="p-3">논문 출판 비용</td>
                  <td className="p-3">김연구</td>
                  <td className="p-3">180만원</td>
                  <td className="p-3">
                    <span className="text-green-500">승인완료</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 예산 조정 요청 */}
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold">예산 조정 요청</div>
            <Button className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" />새 조정 요청
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-medium text-gray-500">요청일자</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">요청자</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">조정 항목</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">변경 금액</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">사유</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3">2025-04-10</td>
                  <td className="p-3">이연구</td>
                  <td className="p-3">연구재료비 → 연구장비비</td>
                  <td className="p-3">5,000만원</td>
                  <td className="p-3">장비 구매 필요성 증가</td>
                  <td className="p-3">
                    <span className="text-amber-500">검토중</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3">2025-03-22</td>
                  <td className="p-3">김교수</td>
                  <td className="p-3">연구활동비 → 인건비</td>
                  <td className="p-3">1,500만원</td>
                  <td className="p-3">신규 연구원 채용</td>
                  <td className="p-3">
                    <span className="text-green-500">승인완료</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">2025-02-15</td>
                  <td className="p-3">박연구</td>
                  <td className="p-3">연구장비비 → 연구재료비</td>
                  <td className="p-3">2,000만원</td>
                  <td className="p-3">추가 재료 구매 필요</td>
                  <td className="p-3">
                    <span className="text-red-500">반려</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 예산계획 등록 팝업 */}
      <Dialog open={showBudgetPlanForm} onOpenChange={setShowBudgetPlanForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">비목별 예산 등록</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBudgetPlanSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  비목 선택
                </Label>
                <select
                  id="category"
                  name="category"
                  className="col-span-3 p-2 border border-gray-200 rounded-md text-sm"
                  value={budgetPlanForm.category}
                  onChange={handleBudgetPlanChange}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="인건비">인건비</option>
                  <option value="연구활동비">연구활동비</option>
                  <option value="연구재료비">연구재료비</option>
                  <option value="연구장비비">연구장비비</option>
                  <option value="연구수당">연구수당</option>
                  <option value="위탁연구개발비">위탁연구개발비</option>
                  <option value="간접비">간접비</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  날짜
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  className="col-span-3"
                  value={budgetPlanForm.date}
                  onChange={handleBudgetPlanChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  내용
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="col-span-3"
                  value={budgetPlanForm.description}
                  onChange={handleBudgetPlanChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  금액
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="금액을 입력하세요"
                    value={budgetPlanForm.amount}
                    onChange={handleBudgetPlanChange}
                    required
                  />
                  <span className="ml-2">원</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user" className="text-right">
                  사용자
                </Label>
                <select
                  id="user"
                  name="user"
                  className="col-span-3 p-2 border border-gray-200 rounded-md text-sm"
                  value={budgetPlanForm.user}
                  onChange={handleBudgetPlanChange}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="김교수">김교수</option>
                  <option value="이연구">이연구</option>
                  <option value="박연구">박연구</option>
                  <option value="최담당">최담당</option>
                  <option value="정연구">정연구</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  첨부파일
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">클릭하여 파일 업로드</span> 또는 드래그 앤 드롭
                        </p>
                        <p className="text-xs text-gray-500">PDF, EXCEL, WORD, JPG (MAX. 10MB)</p>
                      </div>
                      <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  {budgetPlanForm.file && (
                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="text-sm truncate">{budgetPlanForm.file.name}</span>
                      <button
                        type="button"
                        onClick={() => setBudgetPlanForm((prev) => ({ ...prev, file: null }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowBudgetPlanForm(false)}>
                취소
              </Button>
              <Button type="submit">등록</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
