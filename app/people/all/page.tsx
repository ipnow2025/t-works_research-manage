"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 분리된 컴포넌트들
import { SearchFilters } from './components/SearchFilters'
import { ResearcherList } from './components/ResearcherList'
import { ResearcherDetail } from './components/ResearcherDetail'
import { ResearcherForm } from './components/ResearcherForm'

// 훅과 타입
import { useResearchers } from './hooks/useResearchers'
import { Researcher, SearchFilters as SearchFiltersType, NewResearcher } from './types/researcher'

export default function PeoplePage() {
  // 연구자 데이터 및 로직
  const {
    filteredResearchers,
    isLoading,
    currentPage,
    itemsPerPage,
    pagination,
    searchResearchers,
    addResearcher,
    editResearcher,
    removeResearcher,
    changePage,
    changeItemsPerPage,
    loadResearchers
  } = useResearchers()

  // UI 상태
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [editingResearcher, setEditingResearcher] = useState<Researcher | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  // 이벤트 핸들러
  const handleSearch = (filters: SearchFiltersType) => {
    searchResearchers(filters)
  }

  const handleReset = () => {
    loadResearchers(1)
  }

  const handleResearcherClick = (researcher: Researcher) => {
    setSelectedResearcher(researcher)
  }

  const handleCloseDetail = () => {
    setSelectedResearcher(null)
  }

  const handleShowCreateForm = () => {
    setFormMode('create')
    setEditingResearcher(null)
    setShowRegistrationForm(true)
  }

  const handleShowEditForm = (researcher: Researcher) => {
    setFormMode('edit')
    setEditingResearcher(researcher)
    setShowRegistrationForm(true)
  }

  const handleCloseForm = () => {
    setShowRegistrationForm(false)
    setEditingResearcher(null)
  }

  const handleFormSubmit = async (formData: NewResearcher, id?: number): Promise<boolean> => {
    if (formMode === 'create') {
      return await addResearcher(formData)
    } else if (formMode === 'edit' && id) {
      return await editResearcher(id, formData)
    }
    return false
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">전체 인력관리</h1>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-5 hidden">
          <TabsTrigger value="all">전체 인력보기</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {/* 검색 필터 */}
          <Card className="mb-6">
            <CardContent>
              <SearchFilters
                onSearch={handleSearch}
                onReset={handleReset}
                onAddResearcher={handleShowCreateForm}
              />
            </CardContent>
          </Card>

          {/* 연구자 목록 */}
          <Card>
            <CardContent>
              <ResearcherList
                researchers={filteredResearchers}
                isLoading={isLoading}
                pagination={pagination}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onResearcherClick={handleResearcherClick}
                onEditResearcher={handleShowEditForm}
                onDeleteResearcher={removeResearcher}
                onPageChange={changePage}
                onItemsPerPageChange={changeItemsPerPage}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 연구자 상세 정보 모달 */}
      <ResearcherDetail
        researcher={selectedResearcher}
        isOpen={!!selectedResearcher}
        onClose={handleCloseDetail}
      />

      {/* 연구자 등록/수정 폼 모달 */}
      <ResearcherForm
        isOpen={showRegistrationForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingResearcher={editingResearcher}
        mode={formMode}
      />
    </div>
  )
}