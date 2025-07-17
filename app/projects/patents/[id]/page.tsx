"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, FileText, ExternalLink, Edit, Calendar, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// 샘플 특허 데이터 (app/projects/patents/page.tsx와 동일)
const patentData = [
  {
    id: "P2025-0001",
    title: "고효율 전력변환장치",
    owner: "김교수",
    source: "R&D",
    sourceProject: "차세대 에너지 변환 시스템 개발",
    status: "등록",
    filingDate: "2023-05-15",
    filingNumber: "10-2023-0056789",
    registrationDate: "2024-06-20",
    registrationNumber: "10-2345678",
    feeDate: "2025-12-15",
    transfer: "이전 완료 (A사)",
    memo: "전력변환 효율 95% 이상 달성한 핵심 특허",
    documents: ["특허명세서.pdf", "도면.pdf"],
  },
  {
    id: "P2025-0002",
    title: "친환경 필름 제조방법",
    owner: "이교수",
    source: "기타",
    sourceProject: "",
    status: "출원",
    filingDate: "2024-02-10",
    filingNumber: "10-2024-0015432",
    registrationDate: "",
    registrationNumber: "",
    feeDate: "2026-01-10",
    transfer: "미이전",
    memo: "생분해성 필름 제조 방법에 관한 특허",
    documents: ["특허출원서.pdf"],
  },
  {
    id: "P2025-0003",
    title: "AI 기반 센서 시스템",
    owner: "박교수",
    source: "R&D",
    sourceProject: "스마트 센서 네트워크 구축 사업",
    status: "OA",
    filingDate: "2024-03-20",
    filingNumber: "10-2024-0023456",
    registrationDate: "",
    registrationNumber: "",
    feeDate: "-",
    transfer: "이전 협의중",
    memo: "인공지능 기반 센서 데이터 처리 알고리즘",
    documents: ["특허출원서.pdf", "OA대응자료.pdf"],
  },
  {
    id: "P2025-0004",
    title: "양자암호 통신 프로토콜",
    owner: "김교수",
    source: "R&D",
    sourceProject: "차세대 보안 시스템 개발",
    status: "등록",
    filingDate: "2023-08-05",
    filingNumber: "10-2023-0087654",
    registrationDate: "2024-09-15",
    registrationNumber: "10-2456789",
    feeDate: "2025-09-15",
    transfer: "이전 완료 (B사)",
    memo: "양자컴퓨팅 시대 대비 보안 프로토콜",
    documents: ["특허명세서.pdf"],
  },
  {
    id: "P2025-0005",
    title: "나노소재 기반 배터리 전극",
    owner: "이교수",
    source: "R&D",
    sourceProject: "차세대 배터리 기술 개발",
    status: "심사중",
    filingDate: "2024-01-30",
    filingNumber: "10-2024-0009876",
    registrationDate: "",
    registrationNumber: "",
    feeDate: "-",
    transfer: "미이전",
    memo: "에너지 밀도 30% 향상된 배터리 전극 소재",
    documents: ["특허출원서.pdf", "선행기술조사.pdf"],
  },
  {
    id: "P2025-0006",
    title: "자율주행 장애물 인식 시스템",
    owner: "박교수",
    source: "R&D",
    sourceProject: "자율주행 핵심기술 개발",
    status: "출원",
    filingDate: "2024-04-10",
    filingNumber: "10-2024-0034567",
    registrationDate: "",
    registrationNumber: "",
    feeDate: "-",
    transfer: "미이전",
    memo: "악천후 조건에서도 95% 이상 인식률 달성",
    documents: ["특허출원서.pdf"],
  },
]

export default function PatentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [patent, setPatent] = useState<any>(null)
  const [memo, setMemo] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 특허 ID로 데이터 찾기
    const patentId = params.id as string
    const foundPatent = patentData.find((p) => p.id === patentId)

    if (foundPatent) {
      setPatent(foundPatent)
      setMemo(foundPatent.memo)
    } else {
      // 특허를 찾지 못한 경우 목록 페이지로 리다이렉트
      router.push("/projects/patents")
    }

    setIsLoading(false)
  }, [params.id, router])

  // 연차료 납부 예정일이 30일 이내인지 확인하는 함수
  const isFeeDateSoon = (date: string) => {
    if (date === "-") return false

    const today = new Date()
    const feeDate = new Date(date)
    const diffTime = feeDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays >= 0 && diffDays <= 30
  }

  // 메모 저장 핸들러
  const handleSaveMemo = () => {
    alert("메모가 저장되었습니다.")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!patent) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-2">특허를 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-4">요청하신 특허 정보를 찾을 수 없습니다.</p>
        <Link href="/projects/patents">
          <Button>특허 목록으로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects/patents">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">특허 상세 정보</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{patent.title}</h2>
                <Badge
                  className={
                    patent.status === "등록"
                      ? "bg-green-100 text-green-800"
                      : patent.status === "출원"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                  }
                >
                  {patent.status}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                <span className="inline-flex items-center mr-4">
                  <User className="w-4 h-4 mr-1" /> {patent.owner}
                </span>
                <span className="inline-flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> 출원일: {patent.filingDate}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                문서 다운로드
              </Button>
              <Button variant="outline" className="flex items-center gap-1.5">
                <Edit className="w-4 h-4" />
                정보 수정
              </Button>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="info">기본 정보</TabsTrigger>
              <TabsTrigger value="documents">문서 및 메모</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">출원 정보</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">출원번호</div>
                      <div className="font-medium">{patent.filingNumber}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">출원일</div>
                      <div className="font-medium">{patent.filingDate}</div>
                    </div>
                    {patent.registrationNumber && (
                      <>
                        <div>
                          <div className="text-xs text-gray-500">등록번호</div>
                          <div className="font-medium">{patent.registrationNumber}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">등록일</div>
                          <div className="font-medium">{patent.registrationDate}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">소유 및 관리 정보</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">소유자</div>
                      <div className="font-medium">{patent.owner}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">출처</div>
                      <div className="font-medium">{patent.source}</div>
                    </div>
                    {patent.sourceProject && (
                      <div>
                        <div className="text-xs text-gray-500">관련 연구과제</div>
                        <div className="font-medium">{patent.sourceProject}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-gray-500">연차료 납부 예정일</div>
                      <div className={`font-medium ${isFeeDateSoon(patent.feeDate) ? "text-red-600" : ""}`}>
                        {patent.feeDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">기술이전 상태</div>
                      <div className="font-medium">{patent.transfer}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">상태 이력</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6 relative">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center z-10">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">출원</div>
                          <div className="text-sm text-gray-500">{patent.filingDate}</div>
                          <div className="text-sm">출원번호: {patent.filingNumber}</div>
                        </div>
                      </div>

                      {patent.status === "OA" || patent.status === "심사중" ? (
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center z-10">
                            <FileText className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-medium">심사 중 / OA</div>
                            <div className="text-sm text-gray-500">진행 중</div>
                          </div>
                        </div>
                      ) : null}

                      {patent.status === "등록" ? (
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center z-10">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">등록</div>
                            <div className="text-sm text-gray-500">{patent.registrationDate}</div>
                            <div className="text-sm">등록번호: {patent.registrationNumber}</div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {patent.transfer.includes("이전 완료") && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">기술이전 정보</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{patent.transfer.replace("이전 완료 (", "").replace(")", "")}</div>
                        <div className="text-sm text-gray-500">이전 계약일: 2024-05-15</div>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-1" /> 계약서 보기
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-6 pt-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">첨부 문서</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    {patent.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Download className="w-4 h-4 mr-1" /> 다운로드
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">관리자 메모</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <Textarea
                    className="min-h-[120px] mb-2"
                    placeholder="특허에 대한 메모를 입력하세요..."
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveMemo}>저장</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
