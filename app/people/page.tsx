"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Search,
  UserPlus,
  Download,
  Upload,
  Edit,
  Trash,
} from "lucide-react"

// 시스템관리에서 가져온 사용자 데이터 (실제로는 API나 상태 관리 라이브러리를 통해 공유)
const systemUsers = [
  {
    id: 1,
    name: "김연구",
    department: "AI연구소",
    position: "책임연구원",
    email: "kim@research.org",
    phone: "010-1234-5678",
    status: "active",
  },
  {
    id: 2,
    name: "이과학",
    department: "AI연구소",
    position: "선임연구원",
    email: "lee@research.org",
    phone: "010-2345-6789",
    status: "active",
  },
  {
    id: 3,
    name: "박기술",
    department: "자율주행팀",
    position: "연구원",
    email: "park@research.org",
    phone: "010-3456-7890",
    status: "active",
  },
  {
    id: 4,
    name: "최혁신",
    department: "자율주행팀",
    position: "연구원",
    email: "choi@research.org",
    phone: "010-4567-8901",
    status: "active",
  },
  {
    id: 5,
    name: "정미래",
    department: "데이터분석팀",
    position: "선임연구원",
    email: "jung@research.org",
    phone: "010-5678-9012",
    status: "active",
  },
  {
    id: 6,
    name: "강창조",
    department: "데이터분석팀",
    position: "연구원",
    email: "kang@research.org",
    phone: "010-6789-0123",
    status: "active",
  },
  {
    id: 7,
    name: "조혜안",
    department: "AI연구소",
    position: "연구원",
    email: "jo@research.org",
    phone: "010-7890-1234",
    status: "active",
  },
  {
    id: 8,
    name: "윤진보",
    department: "자율주행팀",
    position: "책임연구원",
    email: "yoon@research.org",
    phone: "010-8901-2345",
    status: "active",
  },
  {
    id: 9,
    name: "장미래",
    department: "데이터분석팀",
    position: "연구원",
    email: "jang@research.org",
    phone: "010-9012-3456",
    status: "active",
  },
  {
    id: 10,
    name: "한지혜",
    department: "AI연구소",
    position: "연구원",
    email: "han@research.org",
    phone: "010-0123-4567",
    status: "active",
  },
  {
    id: 11,
    name: "오지성",
    department: "자율주행팀",
    position: "연구원",
    email: "oh@research.org",
    phone: "010-1234-5678",
    status: "active",
  },
  {
    id: 12,
    name: "신미래",
    department: "데이터분석팀",
    position: "연구원",
    email: "shin@research.org",
    phone: "010-2345-6789",
    status: "active",
  },
  {
    id: 13,
    name: "권혁신",
    department: "AI연구소",
    position: "선임연구원",
    email: "kwon@research.org",
    phone: "010-3456-7890",
    status: "active",
  },
  {
    id: 14,
    name: "황창조",
    department: "자율주행팀",
    position: "연구원",
    email: "hwang@research.org",
    phone: "010-4567-8901",
    status: "active",
  },
  {
    id: 15,
    name: "안미래",
    department: "데이터분석팀",
    position: "연구원",
    email: "ahn@research.org",
    phone: "010-5678-9012",
    status: "active",
  },
  {
    id: 16,
    name: "송혁신",
    department: "AI연구소",
    position: "연구원",
    email: "song@research.org",
    phone: "010-6789-0123",
    status: "active",
  },
  {
    id: 17,
    name: "백창조",
    department: "자율주행팀",
    position: "연구원",
    email: "baek@research.org",
    phone: "010-7890-1234",
    status: "inactive",
  },
  {
    id: 18,
    name: "고미래",
    department: "데이터분석팀",
    position: "연구원",
    email: "ko@research.org",
    phone: "010-8901-2345",
    status: "inactive",
  },
]
// 사용자 검색 함수
const searchUsers = (query: string, department: string, position: string) => {
  return systemUsers.filter((user) => {
    // 활성 상태인 사용자만 검색
    if (user.status !== "active") return false

    // 이름 검색
    const nameMatch = !query || user.name.includes(query)

    // 부서 필터링
    const departmentMatch = !department || user.department === department

    // 직위 필터링
    const positionMatch = !position || user.position === position

    return nameMatch && departmentMatch && positionMatch
  })
}

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [positionFilter, setPositionFilter] = useState("")
  const [searchResults, setSearchResults] = useState<typeof systemUsers>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [newResearcher, setNewResearcher] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    age: "",
    gender: "남성",
    degree: "",
    lab: "",
    labUrl: "",
    education: [""],
    researchAreas: [""],
    publications: [""],
    patents: [""],
    awards: [""],
  })

  const handleNewResearcherChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewResearcher((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setNewResearcher((prev) => {
      const newArray = [...(prev[field as keyof typeof prev] as string[])]
      newArray[index] = value
      return {
        ...prev,
        [field]: newArray,
      }
    })
  }

  const addArrayField = (field: string) => {
    setNewResearcher((prev) => {
      const newArray = [...(prev[field as keyof typeof prev] as string[])]
      return {
        ...prev,
        [field]: [...newArray, ""],
      }
    })
  }

  const removeArrayField = (field: string, index: number) => {
    setNewResearcher((prev) => {
      const newArray = [...(prev[field as keyof typeof prev] as string[])]
      newArray.splice(index, 1)
      return {
        ...prev,
        [field]: newArray,
      }
    })
  }

  const handleNewResearcherSubmit = () => {
    // In a real application, this would save the new researcher to the database
    alert("새 연구자가 등록되었습니다.")
    setShowRegistrationForm(false)
    // Reset form
    setNewResearcher({
      name: "",
      department: "",
      position: "",
      email: "",
      phone: "",
      age: "",
      gender: "남성",
      degree: "",
      lab: "",
      labUrl: "",
      education: [""],
      researchAreas: [""],
      publications: [""],
      patents: [""],
      awards: [""],
    })
  }

  // Function to show user detail popup
  const showUserDetailPopup = (user: any) => {
    // Get detailed user information
    const userDetail = {
      ...user,
      age: 45,
      gender: user.id % 3 === 0 ? "여성" : "남성",
      degree: ["책임연구원", "선임연구원"].includes(user.position) ? "공학박사" : "공학석사",
      education: [
        user.department === "AI연구소" ? "서울대학교 컴퓨터공학 박사 (2010)" : "한국과학기술원 인공지능 박사 (2018)",
        user.department === "AI연구소" ? "서울대학교 컴퓨터공학 석사 (2005)" : "한국과학기술원 인공지능 석사 (2015)",
        user.department === "AI연구소" ? "한국대학교 컴퓨터공학 학사 (2003)" : "서울대학교 컴퓨터공학 학사 (2013)",
      ],
      lab: user.department,
      labUrl: `https://${user.department.toLowerCase().replace(/\s+/g, "-")}.example.ac.kr`,
      researchAreas:
        user.department === "AI연구소"
          ? ["인공지능", "컴퓨터 비전", "자율주행"]
          : user.department === "자율주행팀"
            ? ["강화학습", "자율주행", "로보틱스"]
            : ["데이터 분석", "머신러닝", "빅데이터"],
      publications: [
        user.department === "AI연구소"
          ? "딥러닝 기반 자율주행 알고리즘의 성능 향상에 관한 연구 (IEEE Transactions on AI, 2025)"
          : "다중 센서 융합을 통한 객체 인식 성능 향상 (ICCV, 2024)",
        user.department === "AI연구소"
          ? "객체 인식 알고리즘의 정확도 개선 방법론 (CVPR, 2024)"
          : "저조도 환경에서의 객체 탐지 알고리즘 (ECCV, 2023)",
      ],
      patents: [
        user.department === "AI연구소"
          ? "자율주행차량 충돌 방지 시스템 (10-2024-0098765, 2024)"
          : "다중 센서 기반 객체 인식 시스템 (10-2023-0054321, 2023)",
      ],
      awards: [
        user.department === "AI연구소"
          ? "2024 스마트 모빌리티 기술 우수상 (과학기술정보통신부)"
          : "2023 젊은 과학자상 (한국인공지능학회)",
      ],
    }
    setSelectedUser(userDetail)
  }

  // 검색 실행 함수
  const handleSearch = () => {
    const results = searchUsers(searchQuery, departmentFilter, positionFilter)
    setSearchResults(results)
    setShowResults(true)
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">인력관리</h1>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-5">
          <TabsTrigger value="all">전체 인력보기</TabsTrigger>
          <TabsTrigger value="attendance">출퇴근 관리</TabsTrigger>
          <TabsTrigger value="meetings">회의 관리</TabsTrigger>
          <TabsTrigger value="statistics">통계</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">연구자 검색</h2>
                <Button className="flex items-center gap-1.5" onClick={() => setShowRegistrationForm(true)}>
                  <UserPlus className="w-4 h-4" />
                  신규 연구자 등록
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div>
                  <Label htmlFor="name-search" className="mb-1.5 block text-sm font-medium">
                    이름
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name-search"
                      placeholder="이름 검색"
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="department-filter" className="mb-1.5 block text-sm font-medium">
                    소속
                  </Label>
                  <select
                    id="department-filter"
                    className="w-full p-2 border border-gray-200 rounded-md"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">전체</option>
                    <option value="AI연구소">AI연구소</option>
                    <option value="자율주행팀">자율주행팀</option>
                    <option value="데이터분석팀">데이터분석팀</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="position-filter" className="mb-1.5 block text-sm font-medium">
                    직위
                  </Label>
                  <select
                    id="position-filter"
                    className="w-full p-2 border border-gray-200 rounded-md"
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                  >
                    <option value="">전체</option>
                    <option value="책임연구원">책임연구원</option>
                    <option value="선임연구원">선임연구원</option>
                    <option value="연구원">연구원</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setSearchQuery("")
                    setDepartmentFilter("")
                    setPositionFilter("")
                    setShowResults(false)
                  }}
                >
                  초기화
                </Button>
                <Button onClick={handleSearch}>검색</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">전체 인력 목록</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    엑셀 다운로드
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    일괄 업로드
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500">이름</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">소속</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">직위</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">이메일</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">연락처</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showResults ? searchResults : systemUsers.filter((user) => user.status === "active")).map(
                      (user) => (
                        <tr key={user.id} className="border-b border-gray-100">
                          <td className="p-3">
                            <button className="text-blue-600 hover:underline" onClick={() => showUserDetailPopup(user)}>
                              {user.name}
                            </button>
                          </td>
                          <td className="p-3">{user.department}</td>
                          <td className="p-3">{user.position}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.phone}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                              {user.status === "active" ? "활성" : "비활성"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Popup */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">{selectedUser.name} 상세 정보</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedUser(null)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm text-gray-500 mb-3">기본 정보</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">나이</div>
                      <div className="col-span-2">{selectedUser.age}세</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">성별</div>
                      <div className="col-span-2">{selectedUser.gender}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">학위</div>
                      <div className="col-span-2">{selectedUser.degree}</div>
                    </div>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">연락처</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">전화번호</div>
                      <div className="col-span-2">{selectedUser.phone}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">이메일</div>
                      <div className="col-span-2">{selectedUser.email}</div>
                    </div>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">소속</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">연구실</div>
                      <div className="col-span-2">{selectedUser.lab}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">연구실 URL</div>
                      <div className="col-span-2">
                        <a
                          href={selectedUser.labUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {selectedUser.labUrl}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" x2="21" y1="14" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 연구분야</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.researchAreas.map((area: string, index: number) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-3">학력</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {selectedUser.education.map((edu: string, index: number) => (
                        <li key={index} className="text-sm">
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 논문</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2 list-disc pl-5">
                      {selectedUser.publications.map((pub: string, index: number) => (
                        <li key={index} className="text-sm">
                          {pub}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 특허</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2 list-disc pl-5">
                      {selectedUser.patents.map((patent: string, index: number) => (
                        <li key={index} className="text-sm">
                          {patent}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 수상이력</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2 list-disc pl-5">
                      {selectedUser.awards.map((award: string, index: number) => (
                        <li key={index} className="text-sm">
                          {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                  onClick={() => setSelectedUser(null)}
                >
                  닫기
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium">
                  인력관리에서 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Researcher Registration Form */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">신규 연구자 등록</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowRegistrationForm(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm text-gray-500 mb-3">기본 정보</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">이름</div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="name"
                          value={newResearcher.name}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">소속</div>
                      <div className="col-span-2">
                        <select
                          name="department"
                          value={newResearcher.department}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">선택하세요</option>
                          <option value="AI연구소">AI연구소</option>
                          <option value="자율주행팀">자율주행팀</option>
                          <option value="데이터분석팀">데이터분석팀</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">직위</div>
                      <div className="col-span-2">
                        <select
                          name="position"
                          value={newResearcher.position}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">선택하세요</option>
                          <option value="책임연구원">책임연구원</option>
                          <option value="선임연구원">선임연구원</option>
                          <option value="연구원">연구원</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">나이</div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          name="age"
                          value={newResearcher.age}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">성별</div>
                      <div className="col-span-2">
                        <select
                          name="gender"
                          value={newResearcher.gender}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="남성">남성</option>
                          <option value="여성">여성</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">학위</div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="degree"
                          value={newResearcher.degree}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="예: 공학박사, 공학석사"
                        />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">연락처</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">전화번호</div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="phone"
                          value={newResearcher.phone}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="010-0000-0000"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">이메일</div>
                      <div className="col-span-2">
                        <input
                          type="email"
                          name="email"
                          value={newResearcher.email}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">소속</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">연구실</div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="lab"
                          value={newResearcher.lab}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium">연구실 URL</div>
                      <div className="col-span-2">
                        <input
                          type="url"
                          name="labUrl"
                          value={newResearcher.labUrl}
                          onChange={handleNewResearcherChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="https://"
                        />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 연구분야</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {newResearcher.researchAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={area}
                          onChange={(e) => handleArrayFieldChange("researchAreas", index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="연구 분야"
                        />
                        <div className="flex gap-1">
                          {index === newResearcher.researchAreas.length - 1 && (
                            <button
                              type="button"
                              onClick={() => addArrayField("researchAreas")}
                              className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </button>
                          )}
                          {newResearcher.researchAreas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField("researchAreas", index)}
                              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-3">학력</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {newResearcher.education.map((edu, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={edu}
                          onChange={(e) => handleArrayFieldChange("education", index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="학교명 전공 학위 (연도)"
                        />
                        <div className="flex gap-1">
                          {index === newResearcher.education.length - 1 && (
                            <button
                              type="button"
                              onClick={() => addArrayField("education")}
                              className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </button>
                          )}
                          {newResearcher.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField("education", index)}
                              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 논문</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {newResearcher.publications.map((pub, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={pub}
                          onChange={(e) => handleArrayFieldChange("publications", index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="논문 제목 (저널명, 연도)"
                        />
                        <div className="flex gap-1">
                          {index === newResearcher.publications.length - 1 && (
                            <button
                              type="button"
                              onClick={() => addArrayField("publications")}
                              className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </button>
                          )}
                          {newResearcher.publications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField("publications", index)}
                              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 특허</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {newResearcher.patents.map((patent, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={patent}
                          onChange={(e) => handleArrayFieldChange("patents", index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="특허명 (특허번호, 연도)"
                        />
                        <div className="flex gap-1">
                          {index === newResearcher.patents.length - 1 && (
                            <button
                              type="button"
                              onClick={() => addArrayField("patents")}
                              className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </button>
                          )}
                          {newResearcher.patents.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField("patents", index)}
                              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 수상이력</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {newResearcher.awards.map((award, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={award}
                          onChange={(e) => handleArrayFieldChange("awards", index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="수상명 (수여기관)"
                        />
                        <div className="flex gap-1">
                          {index === newResearcher.awards.length - 1 && (
                            <button
                              type="button"
                              onClick={() => addArrayField("awards")}
                              className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </button>
                          )}
                          {newResearcher.awards.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField("awards", index)}
                              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                  onClick={() => setShowRegistrationForm(false)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
                  onClick={handleNewResearcherSubmit}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
