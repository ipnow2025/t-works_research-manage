import React, { useState, useEffect, Fragment } from 'react'
import { Plus, Minus } from 'lucide-react'
import { NewResearcher, Researcher } from '../types/researcher'

interface ResearcherFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (researcher: NewResearcher, id?: number) => Promise<boolean>
  editingResearcher?: Researcher | null  // 수정할 연구자 데이터
  mode: 'create' | 'edit'
}

export function ResearcherForm({ isOpen, onClose, onSubmit, editingResearcher, mode }: ResearcherFormProps) {
  const [formData, setFormData] = useState<NewResearcher>({
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

  // 수정 모드일 때 폼 데이터 초기화
  useEffect(() => {
    if (mode === 'edit' && editingResearcher) {
      setFormData({
        name: editingResearcher.name,
        department: editingResearcher.department,
        position: editingResearcher.position,
        email: editingResearcher.email,
        phone: editingResearcher.phone,
        age: editingResearcher.age?.toString() || "",
        gender: editingResearcher.gender,
        degree: editingResearcher.degree || "",
        lab: editingResearcher.lab || "",
        labUrl: editingResearcher.lab_url || "",
        education: editingResearcher.education.length > 0 ? editingResearcher.education : [""],
        researchAreas: editingResearcher.research_areas.length > 0 ? editingResearcher.research_areas : [""],
        publications: editingResearcher.publications.length > 0 ? editingResearcher.publications : [""],
        patents: editingResearcher.patents.length > 0 ? editingResearcher.patents : [""],
        awards: editingResearcher.awards.length > 0 ? editingResearcher.awards : [""],
      })
    } else if (mode === 'create') {
      // 등록 모드일 때 폼 초기화
      setFormData({
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
  }, [mode, editingResearcher, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayFieldChange = (field: keyof NewResearcher, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as string[])]
      newArray[index] = value
      return {
        ...prev,
        [field]: newArray,
      }
    })
  }

  const addArrayField = (field: keyof NewResearcher) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as string[])]
      return {
        ...prev,
        [field]: [...newArray, ""],
      }
    })
  }

  const removeArrayField = (field: keyof NewResearcher, index: number) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as string[])]
      newArray.splice(index, 1)
      return {
        ...prev,
        [field]: newArray,
      }
    })
  }

  const handleSubmit = async () => {
    const success = await onSubmit(formData, editingResearcher?.id)
    if (success) {
      onClose()
      alert(mode === 'create' ? "새 연구자가 등록되었습니다." : "연구자 정보가 수정되었습니다.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold">
              {mode === 'create' ? '신규 연구자 등록' : '연구자 정보 수정'}
            </h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
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
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">이름</div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">소속</div>
                  <div className="col-span-2">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">선택하세요</option>
                      <option value="AI연구소">AI연구소</option>
                      <option value="자율주행팀">자율주행팀</option>
                      <option value="데이터분석팀">데이터분석팀</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">직위</div>
                  <div className="col-span-2">
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">선택하세요</option>
                      <option value="책임연구원">책임연구원</option>
                      <option value="선임연구원">선임연구원</option>
                      <option value="연구원">연구원</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">나이</div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">성별</div>
                  <div className="col-span-2">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="남성">남성</option>
                      <option value="여성">여성</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">학위</div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="예: 공학박사, 공학석사"
                    />
                  </div>
                </div>
              </div>

              <h4 className="text-sm text-gray-500 mt-5 mb-3">연락처</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">전화번호</div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">이메일</div>
                  <div className="col-span-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <h4 className="text-sm text-gray-500 mt-5 mb-3">소속</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">연구실</div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="lab"
                      value={formData.lab}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">연구실 URL</div>
                  <div className="col-span-2">
                    <input
                      type="url"
                      name="labUrl"
                      value={formData.labUrl}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* 동적 배열 필드들을 위한 컴포넌트 */}
              {[
                { field: 'researchAreas', title: '주요 연구분야', placeholder: '연구 분야' },
                { field: 'education', title: '학력', placeholder: '학교명 전공 학위 (연도)' },
                { field: 'publications', title: '주요 논문', placeholder: '논문 제목 (저널명, 연도)' },
                { field: 'patents', title: '주요 특허', placeholder: '특허명 (특허번호, 연도)' },
                { field: 'awards', title: '주요 수상이력', placeholder: '수상명 (수여기관)' }
              ].map(({ field, title, placeholder }) => (
                <Fragment key={field}>
                  <h4 className="text-sm text-gray-500 mb-3 mt-5 first:mt-0">{title}</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {(formData[field as keyof NewResearcher] as string[]).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleArrayFieldChange(field as keyof NewResearcher, index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder={placeholder}
                        />
                        <div className="flex gap-1">
                          {index === (formData[field as keyof NewResearcher] as string[]).length - 1 && (
                            <button
                              type="button"
                              onClick={() => addArrayField(field as keyof NewResearcher)}
                              className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                            >
                              <Plus size={20} />
                            </button>
                          )}
                          {(formData[field as keyof NewResearcher] as string[]).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField(field as keyof NewResearcher, index)}
                              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <Minus size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
              onClick={handleSubmit}
            >
              {mode === 'create' ? '등록' : '수정'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 