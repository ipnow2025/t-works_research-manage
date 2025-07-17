"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Search,
  UserPlus,
  Bell,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Plus,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react"

// 시스템 사용자 데이터
const initialUsers = [
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

export default function AdminPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)

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

  // 사용자 상태 토글 함수
  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  // 검색 및 필터링된 사용자 목록
  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name.includes(searchQuery)
    const departmentMatch = !departmentFilter || user.department === departmentFilter
    return nameMatch && departmentMatch
  })

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">시스템관리</h1>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-5">
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
          <TabsTrigger value="roles">권한 관리</TabsTrigger>
          <TabsTrigger value="departments">부서 관리</TabsTrigger>
          <TabsTrigger value="settings">시스템 설정</TabsTrigger>
          <TabsTrigger value="logs">로그 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">사용자 관리</h2>
                <Button className="flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4" />
                  신규 사용자 등록
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div>
                  <Label htmlFor="user-search" className="mb-1.5 block text-sm font-medium">
                    이름 검색
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="user-search"
                      placeholder="이름 검색"
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="department-filter" className="mb-1.5 block text-sm font-medium">
                    부서
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

                <div className="flex items-end gap-2">
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
                      <th className="p-3 text-left text-xs font-medium text-gray-500">부서</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">직위</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">이메일</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">연락처</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
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
                          {user.status === "active" ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                              활성
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-full">
                              비활성
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.status === "active" ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-5">사용자 통계</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-gray-500 mb-2.5">총 사용자</div>
                    <div className="text-3xl font-bold text-blue-800 mb-2.5">{users.length}명</div>
                    <div className="text-xs text-gray-500">등록된 사용자</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-gray-500 mb-2.5">활성 사용자</div>
                    <div className="text-3xl font-bold text-blue-800 mb-2.5">
                      {users.filter((user) => user.status === "active").length}명
                    </div>
                    <div className="text-xs text-gray-500">활성 상태</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-gray-500 mb-2.5">비활성 사용자</div>
                    <div className="text-3xl font-bold text-blue-800 mb-2.5">
                      {users.filter((user) => user.status === "inactive").length}명
                    </div>
                    <div className="text-xs text-gray-500">비활성 상태</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">권한 관리</h2>
                <Button className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />새 권한 그룹 생성
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500">권한 그룹</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">설명</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">사용자 수</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">생성일</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">시스템 관리자</td>
                      <td className="p-3">모든 기능에 대한 접근 권한</td>
                      <td className="p-3">2명</td>
                      <td className="p-3">2023-01-15</td>
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
                    <tr className="border-b border-gray-100">
                      <td className="p-3">연구책임자</td>
                      <td className="p-3">프로젝트 관리 및 보고서 생성 권한</td>
                      <td className="p-3">4명</td>
                      <td className="p-3">2023-01-15</td>
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
                    <tr className="border-b border-gray-100">
                      <td className="p-3">연구원</td>
                      <td className="p-3">기본 연구 활동 및 보고서 조회 권한</td>
                      <td className="p-3">10명</td>
                      <td className="p-3">2023-01-15</td>
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
                    <tr>
                      <td className="p-3">게스트</td>
                      <td className="p-3">제한된 조회 권한</td>
                      <td className="p-3">2명</td>
                      <td className="p-3">2023-01-15</td>
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
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-5">권한 설정</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500">기능</th>
                      <th className="p-3 text-center text-xs font-medium text-gray-500">시스템 관리자</th>
                      <th className="p-3 text-center text-xs font-medium text-gray-500">연구책임자</th>
                      <th className="p-3 text-center text-xs font-medium text-gray-500">연구원</th>
                      <th className="p-3 text-center text-xs font-medium text-gray-500">게스트</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">대시보드 조회</td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">프로젝트 생성/수정</td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">보고서 생성</td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">예산 관리</td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">시스템 관리</td>
                      <td className="p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">부서 관리</h2>
                <Button className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />새 부서 추가
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500">부서명</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">설명</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">소속 인원</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">책임자</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">생성일</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">AI연구소</td>
                      <td className="p-3">인공지능 연구 및 개발</td>
                      <td className="p-3">6명</td>
                      <td className="p-3">김연구</td>
                      <td className="p-3">2023-01-01</td>
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
                    <tr className="border-b border-gray-100">
                      <td className="p-3">자율주행팀</td>
                      <td className="p-3">자율주행 기술 연구</td>
                      <td className="p-3">5명</td>
                      <td className="p-3">윤진보</td>
                      <td className="p-3">2023-01-01</td>
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
                    <tr>
                      <td className="p-3">데이터분석팀</td>
                      <td className="p-3">데이터 수집 및 분석</td>
                      <td className="p-3">5명</td>
                      <td className="p-3">정미래</td>
                      <td className="p-3">2023-01-01</td>
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
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-5">부서별 프로젝트 현황</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500">부서명</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">진행중 프로젝트</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">완료 프로젝트</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">예정 프로젝트</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">총 프로젝트</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">AI연구소</td>
                      <td className="p-3">3</td>
                      <td className="p-3">5</td>
                      <td className="p-3">2</td>
                      <td className="p-3">10</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">자율주행팀</td>
                      <td className="p-3">2</td>
                      <td className="p-3">3</td>
                      <td className="p-3">1</td>
                      <td className="p-3">6</td>
                    </tr>
                    <tr>
                      <td className="p-3">데이터분석팀</td>
                      <td className="p-3">2</td>
                      <td className="p-3">4</td>
                      <td className="p-3">1</td>
                      <td className="p-3">7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-5">시스템 설정</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium mb-4">일반 설정</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="system-name" className="mb-1.5 block text-sm font-medium">
                        시스템 이름
                      </Label>
                      <Input id="system-name" defaultValue="연구실 대시보드" />
                    </div>
                    <div>
                      <Label htmlFor="system-logo" className="mb-1.5 block text-sm font-medium">
                        로고 이미지
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input id="system-logo" type="file" />
                        <Button variant="outline" size="sm">
                          업로드
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="system-timezone" className="mb-1.5 block text-sm font-medium">
                        시간대
                      </Label>
                      <select id="system-timezone" className="w-full p-2 border border-gray-200 rounded-md">
                        <option>Asia/Seoul (GMT+9)</option>
                        <option>UTC</option>
                        <option>America/New_York</option>
                        <option>Europe/London</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-4">보안 설정</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="password-policy" className="mb-1.5 block text-sm font-medium">
                        비밀번호 정책
                      </Label>
                      <select id="password-policy" className="w-full p-2 border border-gray-200 rounded-md">
                        <option>강력 (최소 8자, 대소문자, 숫자, 특수문자 포함)</option>
                        <option>중간 (최소 8자, 대소문자, 숫자 포함)</option>
                        <option>기본 (최소 6자)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="session-timeout" className="mb-1.5 block text-sm font-medium">
                        세션 타임아웃
                      </Label>
                      <select id="session-timeout" className="w-full p-2 border border-gray-200 rounded-md">
                        <option>30분</option>
                        <option>1시간</option>
                        <option>2시간</option>
                        <option>4시간</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="two-factor" className="rounded border-gray-300" />
                      <Label htmlFor="two-factor" className="text-sm">
                        2단계 인증 활성화
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-medium mb-4">알림 설정</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <span>이메일 알림</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email-notification"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <span>시스템 내 알림</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="system-notification"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-500" />
                      <span>일정 알림</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="schedule-notification"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">초기화</Button>
                <Button>설정 저장</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-5">백업 및 복원</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium mb-4">데이터 백업</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="backup-frequency" className="mb-1.5 block text-sm font-medium">
                        자동 백업 주기
                      </Label>
                      <select id="backup-frequency" className="w-full p-2 border border-gray-200 rounded-md">
                        <option>매일</option>
                        <option>매주</option>
                        <option>매월</option>
                        <option>사용 안함</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="backup-retention" className="mb-1.5 block text-sm font-medium">
                        백업 보관 기간
                      </Label>
                      <select id="backup-retention" className="w-full p-2 border border-gray-200 rounded-md">
                        <option>7일</option>
                        <option>30일</option>
                        <option>90일</option>
                        <option>365일</option>
                      </select>
                    </div>
                    <Button className="w-full">지금 백업</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-4">데이터 복원</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="restore-file" className="mb-1.5 block text-sm font-medium">
                        백업 파일 선택
                      </Label>
                      <Input id="restore-file" type="file" />
                    </div>
                    <div>
                      <Label htmlFor="restore-options" className="mb-1.5 block text-sm font-medium">
                        복원 옵션
                      </Label>
                      <select id="restore-options" className="w-full p-2 border border-gray-200 rounded-md">
                        <option>전체 데이터</option>
                        <option>사용자 데이터만</option>
                        <option>프로젝트 데이터만</option>
                        <option>설정만</option>
                      </select>
                    </div>
                    <Button variant="outline" className="w-full">
                      데이터 복원
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">시스템 로그</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4" />
                    새로고침
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    로그 다운로드
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div>
                  <Label htmlFor="log-date" className="mb-1.5 block text-sm font-medium">
                    날짜
                  </Label>
                  <Input id="log-date" type="date" defaultValue="2025-05-20" />
                </div>

                <div>
                  <Label htmlFor="log-type" className="mb-1.5 block text-sm font-medium">
                    로그 유형
                  </Label>
                  <select id="log-type" className="w-full p-2 border border-gray-200 rounded-md">
                    <option>전체</option>
                    <option>로그인</option>
                    <option>시스템</option>
                    <option>사용자 활동</option>
                    <option>오류</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="log-user" className="mb-1.5 block text-sm font-medium">
                    사용자
                  </Label>
                  <select id="log-user" className="w-full p-2 border border-gray-200 rounded-md">
                    <option>전체</option>
                    <option>김연구</option>
                    <option>이과학</option>
                    <option>박기술</option>
                    <option>최혁신</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500">시간</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">유형</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">사용자</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">IP 주소</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-20 09:05:23</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded">로그인</span>
                      </td>
                      <td className="p-3">김연구</td>
                      <td className="p-3">192.168.1.100</td>
                      <td className="p-3">로그인 성공</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-20 09:10:15</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded">
                          사용자 활동
                        </span>
                      </td>
                      <td className="p-3">김연구</td>
                      <td className="p-3">192.168.1.100</td>
                      <td className="p-3">프로젝트 '인공지능 기반 자율주행 기술 개발' 조회</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-20 09:15:42</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded">
                          사용자 활동
                        </span>
                      </td>
                      <td className="p-3">이과학</td>
                      <td className="p-3">192.168.1.101</td>
                      <td className="p-3">보고서 '객체 인식 알고리즘 성능 평가 보고서' 다운로드</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-20 09:20:18</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded">오류</span>
                      </td>
                      <td className="p-3">시스템</td>
                      <td className="p-3">-</td>
                      <td className="p-3">데이터베이스 연결 오류 (ERR-1023)</td>
                    </tr>
                    <tr>
                      <td className="p-3">2025-05-20 09:22:05</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-600 rounded">시스템</span>
                      </td>
                      <td className="p-3">시스템</td>
                      <td className="p-3">-</td>
                      <td className="p-3">자동 백업 완료</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-5">로그 통계</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-gray-500 mb-2.5">오늘 로그인 수</div>
                    <div className="text-3xl font-bold text-blue-800 mb-2.5">24회</div>
                    <div className="text-xs text-gray-500">16명의 사용자</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-gray-500 mb-2.5">오늘 오류 발생</div>
                    <div className="text-3xl font-bold text-blue-800 mb-2.5">3회</div>
                    <div className="text-xs text-gray-500">모두 해결됨</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="text-sm text-gray-500 mb-2.5">총 로그 수</div>
                    <div className="text-3xl font-bold text-blue-800 mb-2.5">1,245개</div>
                    <div className="text-xs text-gray-500">지난 30일</div>
                  </CardContent>
                </Card>
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
    </div>
  )
}
