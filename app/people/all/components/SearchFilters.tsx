import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, UserPlus } from "lucide-react"
import { SearchFilters as SearchFiltersType } from '../types/researcher'

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersType) => void
  onReset: () => void
  onAddResearcher: () => void
}

export function SearchFilters({ onSearch, onReset, onAddResearcher }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [positionFilter, setPositionFilter] = useState("")

  const handleSearch = () => {
    onSearch({
      searchQuery,
      departmentFilter,
      positionFilter
    })
  }

  const handleReset = () => {
    setSearchQuery("")
    setDepartmentFilter("")
    setPositionFilter("")
    onReset()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">연구자 검색</h2>
        <Button className="flex items-center gap-1.5" onClick={onAddResearcher}>
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
        <Button variant="outline" className="mr-2" onClick={handleReset}>
          초기화
        </Button>
        <Button onClick={handleSearch}>검색</Button>
      </div>
    </div>
  )
} 