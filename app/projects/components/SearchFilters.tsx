import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Plus, Settings, ChevronDown, Edit, Trash } from "lucide-react"
import { organizationApi, researcherApi } from '../utils/api'

interface ProjectSearchFilters {
  year: string
  organization: string
  status: string
  searchQuery: string
}

interface Organization {
  id: number
  name: string
}

interface Researcher {
  id: number
  name: string
}

interface SearchFiltersProps {
  onSearch: (filters: ProjectSearchFilters) => void
  onReset: () => void
  onAddProject: () => void
  organizations: Organization[]
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>
  researchers: Researcher[]
  setResearchers: React.Dispatch<React.SetStateAction<Researcher[]>>
}

export function SearchFilters({ 
  onSearch, 
  onReset, 
  onAddProject, 
  organizations, 
  setOrganizations, 
  researchers, 
  setResearchers 
}: SearchFiltersProps) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState("")
  const [organization, setOrganization] = useState("")
  const [status, setStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  
  // 관리 드롭다운 상태
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false)
  
  // 팝업 상태
  const [isOrganizationManagementOpen, setIsOrganizationManagementOpen] = useState(false)
  const [isResearcherManagementOpen, setIsResearcherManagementOpen] = useState(false)
  
  // 입력 상태만 로컬에서 관리
  const [newOrganization, setNewOrganization] = useState("")
  const [editingOrganization, setEditingOrganization] = useState<{ index: number, value: string } | null>(null)
  const [newResearcher, setNewResearcher] = useState("")
  const [editingResearcher, setEditingResearcher] = useState<{ index: number, value: string } | null>(null)

  // 현재 연도부터 5년 전까지의 연도 배열 생성
  const getYearOptions = () => {
    const years = []
    for (let i = 0; i <= 5; i++) {
      years.push(currentYear - i)
    }
    return years
  }

  const handleSearch = () => {
    onSearch({
      year,
      organization,
      status,
      searchQuery
    })
  }

  const handleReset = () => {
    setYear("")
    setOrganization("")
    setStatus("")
    setSearchQuery("")
    onReset()
  }

  // 수행기관 관리 함수들 (API 사용)
  const handleAddOrganization = async () => {
    if (newOrganization.trim()) {
      try {
        const newOrg = await organizationApi.create(newOrganization.trim())
        setOrganizations([...organizations, newOrg])
        setNewOrganization("")
      } catch (error) {
        alert(`수행기관 추가 실패: ${error}`)
      }
    }
  }

  const handleEditOrganization = (index: number) => {
    setEditingOrganization({ index, value: organizations[index].name })
  }

  const handleUpdateOrganization = async () => {
    if (editingOrganization && editingOrganization.value.trim()) {
      try {
        const orgToUpdate = organizations[editingOrganization.index]
        const updatedOrg = await organizationApi.update(orgToUpdate.id, editingOrganization.value.trim())
        const updatedOrganizations = [...organizations]
        updatedOrganizations[editingOrganization.index] = updatedOrg
        setOrganizations(updatedOrganizations)
        setEditingOrganization(null)
      } catch (error) {
        alert(`수행기관 수정 실패: ${error}`)
      }
    }
  }

  const handleDeleteOrganization = async (index: number) => {
    try {
      const orgToDelete = organizations[index]
      await organizationApi.delete(orgToDelete.id)
      setOrganizations(organizations.filter((_, i) => i !== index))
    } catch (error) {
      alert(`수행기관 삭제 실패: ${error}`)
    }
  }

  // 연구책임자 관리 함수들 (API 사용)
  const handleAddResearcher = async () => {
    if (newResearcher.trim()) {
      try {
        const newRes = await researcherApi.create(newResearcher.trim())
        setResearchers([...researchers, newRes])
        setNewResearcher("")
      } catch (error) {
        alert(`연구책임자 추가 실패: ${error}`)
      }
    }
  }

  const handleEditResearcher = (index: number) => {
    setEditingResearcher({ index, value: researchers[index].name })
  }

  const handleUpdateResearcher = async () => {
    if (editingResearcher && editingResearcher.value.trim()) {
      try {
        const researcherToUpdate = researchers[editingResearcher.index]
        const updatedResearcher = await researcherApi.update(researcherToUpdate.id, editingResearcher.value.trim())
        const updatedResearchers = [...researchers]
        updatedResearchers[editingResearcher.index] = updatedResearcher
        setResearchers(updatedResearchers)
        setEditingResearcher(null)
      } catch (error) {
        alert(`연구책임자 수정 실패: ${error}`)
      }
    }
  }

  const handleDeleteResearcher = async (index: number) => {
    try {
      const researcherToDelete = researchers[index]
      await researcherApi.delete(researcherToDelete.id)
      setResearchers(researchers.filter((_, i) => i !== index))
    } catch (error) {
      alert(`연구책임자 삭제 실패: ${error}`)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">연구과제 검색</h2>
        <div className="flex gap-2">
          {/* 관리 드롭다운 버튼 */}
          <Button className="flex items-center gap-1.5" onClick={onAddProject}>
            <Plus className="w-4 h-4" />
            새 과제 등록
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-1.5"
              onClick={() => setIsManagementDropdownOpen(!isManagementDropdownOpen)}
            >
              <Settings className="w-4 h-4" />
              관리
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            {isManagementDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  onClick={() => {
                    setIsOrganizationManagementOpen(true)
                    setIsManagementDropdownOpen(false)
                  }}
                >
                  수행기관 관리
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  onClick={() => {
                    setIsResearcherManagementOpen(true)
                    setIsManagementDropdownOpen(false)
                  }}
                >
                  연구책임자 관리
                </button>
              </div>
            )}
          </div>
          
        
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
        <div>
          <Label htmlFor="year-filter" className="mb-1.5 block text-sm font-medium">
            연도
          </Label>
          <select
            id="year-filter"
            className="w-full p-2 border border-gray-200 rounded-md"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">전체</option>
            {getYearOptions().map((yearOption) => (
              <option key={yearOption} value={yearOption.toString()}>
                {yearOption}년
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="organization-filter" className="mb-1.5 block text-sm font-medium">
            수행기관
          </Label>
          <select
            id="organization-filter"
            className="w-full p-2 border border-gray-200 rounded-md"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          >
            <option value="">전체</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.name}>{org.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="status-filter" className="mb-1.5 block text-sm font-medium">
            상태
          </Label>
          <select
            id="status-filter"
            className="w-full p-2 border border-gray-200 rounded-md"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">전체</option>
            <option value="기획중">기획중</option>
            <option value="신청완료">신청완료</option>
            <option value="진행중">진행중</option>
            <option value="마감임박">마감임박</option>
            <option value="완료">완료</option>
          </select>
        </div>

        <div>
          <Label htmlFor="search-query" className="mb-1.5 block text-sm font-medium">
            과제명
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search-query"
              placeholder="과제명 검색"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="mr-2" onClick={handleReset}>
          초기화
        </Button>
        <Button onClick={handleSearch}>검색</Button>
      </div>

      {/* 수행기관 관리 모달 */}
      <Dialog open={isOrganizationManagementOpen} onOpenChange={setIsOrganizationManagementOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">수행기관 관리</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 새 수행기관 추가 */}
            <div className="flex gap-2">
              <Input
                placeholder="새 수행기관 이름"
                value={newOrganization}
                onChange={(e) => setNewOrganization(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddOrganization}>추가</Button>
            </div>
            
            {/* 수행기관 목록 */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {organizations.map((org, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  {editingOrganization?.index === index ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editingOrganization.value}
                        onChange={(e) => setEditingOrganization({ ...editingOrganization, value: e.target.value })}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleUpdateOrganization}>저장</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingOrganization(null)}>취소</Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{org.name}</span>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-green-500"
                        onClick={() => handleEditOrganization(index)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-500"
                        onClick={() => handleDeleteOrganization(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrganizationManagementOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 연구책임자 관리 모달 */}
      <Dialog open={isResearcherManagementOpen} onOpenChange={setIsResearcherManagementOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">연구책임자 관리</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 새 연구책임자 추가 */}
            <div className="flex gap-2">
              <Input
                placeholder="새 연구책임자 이름"
                value={newResearcher}
                onChange={(e) => setNewResearcher(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddResearcher}>추가</Button>
            </div>
            
            {/* 연구책임자 목록 */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {researchers.map((researcher, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  {editingResearcher?.index === index ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editingResearcher.value}
                        onChange={(e) => setEditingResearcher({ ...editingResearcher, value: e.target.value })}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleUpdateResearcher}>저장</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingResearcher(null)}>취소</Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{researcher.name}</span>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-green-500"
                        onClick={() => handleEditResearcher(index)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-red-500"
                        onClick={() => handleDeleteResearcher(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResearcherManagementOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}