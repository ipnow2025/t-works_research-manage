import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Briefcase, PieChart, CheckCircle, TrendingUp, Eye, Download, Trash } from "lucide-react"

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">보고서 출력</h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-0.5 mb-5">
        <div className="px-5 py-2.5 bg-white rounded-t-lg text-sm font-semibold text-blue-800">보고서 템플릿</div>
        <div className="px-5 py-2.5 bg-gray-100 rounded-t-lg text-sm">맞춤 보고서 생성</div>
        <div className="px-5 py-2.5 bg-gray-100 rounded-t-lg text-sm">보고서 히스토리</div>
      </div>

      {/* 보고서 템플릿 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <div className="h-36 bg-gray-50 flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-2">연차 보고서</h3>
            <p className="text-sm text-gray-500 mb-4 h-10">연간 연구 진행 상황 및 성과에 대한 종합 보고서</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                미리보기
              </Button>
              <Button size="sm">생성하기</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="h-36 bg-gray-50 flex items-center justify-center">
            <Briefcase className="w-16 h-16 text-gray-400" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-2">중간 보고서</h3>
            <p className="text-sm text-gray-500 mb-4 h-10">과제 중간 진행 상황 및 성과에 대한 요약 보고서</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                미리보기
              </Button>
              <Button size="sm">생성하기</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="h-36 bg-gray-50 flex items-center justify-center">
            <PieChart className="w-16 h-16 text-gray-400" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-2">연구 성과 보고서</h3>
            <p className="text-sm text-gray-500 mb-4 h-10">논문, 특허, 학회 발표 등 연구 성과를 정리한 보고서</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                미리보기
              </Button>
              <Button size="sm">생성하기</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="h-36 bg-gray-50 flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-gray-400" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-2">예산 집행 보고서</h3>
            <p className="text-sm text-gray-500 mb-4 h-10">연구비 집행 현황 및 분석 보고서</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                미리보기
              </Button>
              <Button size="sm">생성하기</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="h-36 bg-gray-50 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-gray-400" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-base font-semibold mb-2">최종 결과 보고서</h3>
            <p className="text-sm text-gray-500 mb-4 h-10">연구 과제의 최종 결과 및 성과에 대한 종합 보고서</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                미리보기
              </Button>
              <Button size="sm">생성하기</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 맞춤 보고서 생성 */}
      <Card className="mb-8">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-5">맞춤 보고서 생성</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">보고서 유형</label>
              <select className="p-2 border border-gray-200 rounded-md">
                <option>-- 보고서 유형 선택 --</option>
                <option>연차 보고서</option>
                <option>중간 보고서</option>
                <option>연구 성과 보고서</option>
                <option>예산 집행 보고서</option>
                <option>최종 결과 보고서</option>
                <option>진도 분석 보고서</option>
                <option>맞춤 보고서</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">대상 과제</label>
              <select className="p-2 border border-gray-200 rounded-md">
                <option>-- 과제 선택 --</option>
                <option>인공지능 기반 자율주행 기술 개발</option>
                <option>친환경 소재 개발 연구</option>
                <option>고효율 배터리 시스템 개발</option>
                <option>미래 모빌리티 플랫폼 개발</option>
                <option>모든 과제</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">기간 설정</label>
              <div className="flex gap-2.5 items-center">
                <Input type="date" className="flex-1" />
                <span>~</span>
                <Input type="date" className="flex-1" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">보고서 제목</label>
              <Input type="text" placeholder="보고서 제목을 입력하세요" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">연구책임자</label>
              <select className="p-2 border border-gray-200 rounded-md">
                <option>-- 연구책임자 선택 --</option>
                <option>김교수</option>
                <option>이교수</option>
                <option>박교수</option>
                <option>최교수</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">보고서 형식</label>
              <select className="p-2 border border-gray-200 rounded-md">
                <option>PDF</option>
                <option>Word (DOCX)</option>
                <option>Excel (XLSX)</option>
                <option>PowerPoint (PPTX)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm font-medium text-gray-700">포함할 내용</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cb-summary" defaultChecked className="rounded border-gray-300" />
                <label htmlFor="cb-summary" className="text-sm">
                  과제 요약
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cb-progress" defaultChecked className="rounded border-gray-300" />
                <label htmlFor="cb-progress" className="text-sm">
                  진행 상황
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cb-achievements" defaultChecked className="rounded border-gray-300" />
                <label htmlFor="cb-achievements" className="text-sm">
                  연구 성과 (논문, 특허 등)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cb-budget" defaultChecked className="rounded border-gray-300" />
                <label htmlFor="cb-budget" className="text-sm">
                  예산 집행 현황
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cb-plans" className="rounded border-gray-300" />
                <label htmlFor="cb-plans" className="text-sm">
                  향후 계획
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cb-attachments" className="rounded border-gray-300" />
                <label htmlFor="cb-attachments" className="text-sm">
                  첨부 자료
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-sm font-medium text-gray-700">추가 메모</label>
            <Textarea placeholder="보고서에 포함할 추가 정보나 요청 사항을 입력하세요" className="min-h-[100px]" />
          </div>

          <div className="flex justify-end gap-2.5 border-t border-gray-200 pt-5">
            <Button variant="outline">초기화</Button>
            <Button>보고서 생성</Button>
          </div>
        </CardContent>
      </Card>

      {/* 최근 생성 보고서 */}
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-5">최근 생성 보고서</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-medium text-gray-500">보고서명</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">과제명</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">생성일</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">생성자</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">형식</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3">2025년 1분기 중간 보고서</td>
                  <td className="p-3">인공지능 기반 자율주행 기술 개발</td>
                  <td className="p-3">2025-04-15</td>
                  <td className="p-3">김교수</td>
                  <td className="p-3">PDF</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">완료</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-blue-500">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-green-500">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-500">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3">2024년 연구 성과 보고서</td>
                  <td className="p-3">친환경 소재 개발 연구</td>
                  <td className="p-3">2025-03-22</td>
                  <td className="p-3">이교수</td>
                  <td className="p-3">PDF</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">완료</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-blue-500">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-green-500">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-500">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">2025년 예산 집행 보고서</td>
                  <td className="p-3">고효율 배터리 시스템 개발</td>
                  <td className="p-3">2025-03-10</td>
                  <td className="p-3">박교수</td>
                  <td className="p-3">XLSX</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-600 rounded-full">
                      처리중
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-blue-500">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-green-500">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-500">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
