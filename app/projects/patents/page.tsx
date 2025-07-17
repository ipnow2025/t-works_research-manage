"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Download, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 샘플 특허 데이터
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

// 교수/연구원 목록 추출
const getResearchers = () => {
  const researchers = [...new Set(patentData.map((patent) => patent.owner))]
  return researchers.sort()
}

export default function PatentsManagementPage() {
  const [year, setYear] = useState("2025년")
  const [source, setSource] = useState("전체")
  const [status, setStatus] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResearcher, setSelectedResearcher] = useState("")
  const [researchers, setResearchers] = useState<string[]>([])
  const [filteredPatents, setFilteredPatents] = useState(patentData)

  // 교수/연구원 목록 초기화
  useEffect(() => {
    const researchersList = getResearchers()
    setResearchers(researchersList)
    if (researchersList.length > 0) {
      setSelectedResearcher(researchersList[0])
    }
  }, [])

  // 특허 필터링
  useEffect(() => {
    let filtered = patentData

    // 연구자 필터링
    if (selectedResearcher) {
      filtered = filtered.filter((patent) => patent.owner === selectedResearcher)
    }

    // 출처 필터링
    if (source !== "전체") {
      filtered = filtered.filter((patent) => patent.source === source)
    }

    // 상태 필터링
    if (status !== "전체") {
      filtered = filtered.filter((patent) => patent.status === status)
    }

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (patent) =>
          patent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patent.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patent.filingNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredPatents(filtered)
  }, [selectedResearcher, source, status, searchTerm])

  // 연차료 납부 예정일이 30일 이내인지 확인하는 함수
  const isFeeDateSoon = (date: string) => {
    if (date === "-") return false

    const today = new Date()
    const feeDate = new Date(date)
    const diffTime = feeDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays >= 0 && diffDays <= 30
  }

  // 엑셀 다운로드 핸들러 (실제로는 구현되지 않음)
  const handleDownloadExcel = () => {
    alert("특허 목록이 엑셀 파일로 다운로드됩니다.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">특허관리</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1.5" onClick={handleDownloadExcel}>
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-6">
        교수 및 석/박사 연구원이 보유한 특허 현황을 통합 관리합니다.
        <br />
        특허의 출처(R&D 과제 기반 여부), 출원 상태, 연차료 납부 예정일, 기술이전 여부 등을 종합적으로 확인할 수
        있습니다.
      </div>

      {/* 필터 영역 */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">연도 선택</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="연도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025년">2025년</SelectItem>
                  <SelectItem value="2024년">2024년</SelectItem>
                  <SelectItem value="2023년">2023년</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">출처 구분</label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="출처 구분" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="R&D">R&D</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">상태</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="출원">출원</SelectItem>
                  <SelectItem value="OA">OA</SelectItem>
                  <SelectItem value="심사중">심사중</SelectItem>
                  <SelectItem value="등록">등록</SelectItem>
                  <SelectItem value="소멸">소멸</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="특허명, 소유자, 출원번호 검색"
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 교수/연구원 목록 사이드바 */}
        <Card className="md:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">교수/연구원 목록</h2>
              <div className="text-sm text-gray-500">최신 등록순</div>
            </div>
            <div className="space-y-1">
              {researchers.map((researcher) => (
                <Button
                  key={researcher}
                  variant={selectedResearcher === researcher ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    selectedResearcher === researcher ? "bg-black text-white" : "text-gray-700"
                  }`}
                  onClick={() => setSelectedResearcher(researcher)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {researcher}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 특허 리스트 테이블 */}
        <Card className="md:col-span-3">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{selectedResearcher}의 특허 목록</h2>
              <div className="text-sm text-gray-500">총 {filteredPatents.length}건</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-xs font-medium text-gray-500">특허명</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">출처</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">연차료 납부 예정</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">기술이전 여부</th>
                    <th className="p-3 text-center text-xs font-medium text-gray-500">보기</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatents.map((patent) => (
                    <tr key={patent.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        <Link href={`/projects/patents/${patent.id}`} className="text-blue-600 hover:underline">
                          {patent.title}
                        </Link>
                      </td>
                      <td className="p-3">{patent.source}</td>
                      <td className="p-3">
                        <Badge
                          className={
                            patent.status === "등록"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : patent.status === "출원"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : patent.status === "OA" || patent.status === "심사중"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {patent.status}
                        </Badge>
                      </td>
                      <td className={`p-3 ${isFeeDateSoon(patent.feeDate) ? "text-red-600 font-semibold" : ""}`}>
                        {patent.feeDate}
                      </td>
                      <td className="p-3">{patent.transfer}</td>
                      <td className="p-3 text-center">
                        <Link href={`/projects/patents/${patent.id}`}>
                          <Button variant="ghost" size="sm" className="h-8">
                            🔍 상세
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filteredPatents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-gray-500">
                        검색 결과가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
