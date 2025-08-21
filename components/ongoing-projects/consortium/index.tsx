"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building, User, Phone, Mail, Smartphone, Edit2, Trash2, Check, X, Plus } from "lucide-react"

interface ConsortiumProps {
  project: any
}

export function Consortium({ project }: ConsortiumProps) {
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    position: "",
    role: "",
    phone: "",
    mobile: "",
    email: ""
  })

  // 강제로 테스트 데이터 생성
  const testData = [
    {
      id: "test-org-1",
      name: "테스트 기관",
      type: "주관",
      members: [
        {
          id: "test-member-1",
          name: "홍길동",
          position: "대표",
          role: "총괄책임",
          phone: "02-1234-5678",
          mobile: "010-1234-5678",
          email: "hong@test.com"
        },
        {
          id: "test-member-2",
          name: "김철수",
          position: "연구원",
          role: "연구책임",
          phone: "02-2345-6789",
          mobile: "010-2345-6789",
          email: "kim@test.com"
        }
      ]
    }
  ]

  const handleEditMember = (member: any) => {
    console.log("편집 시작:", member)
    setEditingMember(member.id)
    setEditForm({
      name: member.name || "",
      position: member.position || "",
      role: member.role || "",
      phone: member.phone || "",
      mobile: member.mobile || "",
      email: member.email || ""
    })
  }

  const handleSaveMember = () => {
    console.log("저장:", editForm)
    setEditingMember(null)
  }

  const handleCancelEdit = () => {
    console.log("편집 취소")
    setEditingMember(null)
  }

  const handleRemoveMember = (orgId: string, memberId: string) => {
    console.log("삭제:", orgId, memberId)
  }

  console.log("=== Consortium 컴포넌트 렌더링 ===")
  console.log("editingMember:", editingMember)
  console.log("editForm:", editForm)
  console.log("testData:", testData)

  return (
    <div className="space-y-4 p-4 border-2 border-red-500 bg-red-50">
      <h1 className="text-2xl font-bold text-red-700">🔴 테스트 모드 - Consortium 컴포넌트</h1>
      
      <div className="space-y-3">
        {testData.map((org: any) => (
          <Card key={org.id} className="border-2 border-blue-500 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                </div>
                <Badge variant="default">{org.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <h4 className="font-medium text-base border-b pb-2">구성원 ({org.members.length}명)</h4>
                <div className="space-y-3">
                  {org.members.map((member: any) => (
                    <div key={member.id} className="border-2 border-green-500 bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        {/* 왼쪽: 연구자 정보 */}
                        <div className="flex items-center gap-4 text-base">
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">이름</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="h-9 text-base border-2 border-blue-400"
                                placeholder="이름을 입력하세요"
                              />
                            ) : (
                              <div className="font-semibold text-base text-gray-800">{member.name}</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">직급</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.position}
                                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                className="h-9 text-base border-2 border-blue-400"
                                placeholder="직급을 입력하세요"
                              />
                            ) : (
                              <div className="font-semibold text-base text-gray-800">{member.position}</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">역할</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="h-9 text-base border-2 border-blue-400"
                                placeholder="역할을 입력하세요"
                              />
                            ) : (
                              <Badge variant="outline" className="text-sm px-3 py-1">{member.role}</Badge>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">전화번호</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="h-9 text-base border-2 border-blue-400"
                                placeholder="전화번호를 입력하세요"
                              />
                            ) : (
                              <div className="flex items-center gap-2 text-base">
                                <Phone className="h-4 w-4 text-blue-500" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">휴대폰</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.mobile}
                                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                                className="h-9 text-base border-2 border-blue-400"
                                placeholder="휴대폰을 입력하세요"
                              />
                            ) : (
                              <div className="flex items-center gap-2 text-base">
                                <Smartphone className="h-4 w-4 text-blue-500" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">이메일</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="h-9 text-base border-2 border-blue-400"
                                placeholder="이메일을 입력하세요"
                              />
                            ) : (
                              <div className="flex items-center gap-2 text-base">
                                <Mail className="h-4 w-4 text-blue-500" />
                                <span>{member.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* 오른쪽: 버튼들 */}
                        <div className="flex items-center gap-2 ml-6 border-2 border-purple-500 bg-purple-50 p-3 rounded">
                          <p className="text-xs text-purple-600 mr-2">버튼 영역</p>
                          {editingMember === member.id ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveMember}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 h-9 px-4 border-2 border-green-400"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                저장
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 h-9 px-4 border-2 border-gray-400"
                              >
                                <X className="h-4 w-4 mr-1" />
                                취소
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditMember(member)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-9 px-4 border-2 border-blue-400"
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                수정
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveMember(org.id, member.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-4 border-2 border-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                삭제
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
