import React from 'react'
import { Button } from "@/components/ui/button"
import { Download, Edit, Trash, SearchX } from "lucide-react"
import { Researcher } from '../types/researcher'
import { Pagination } from './Pagination'

interface ResearcherListProps {
  researchers: Researcher[]
  isLoading: boolean
  pagination: any
  currentPage: number
  itemsPerPage: number
  onResearcherClick: (researcher: Researcher) => void
  onEditResearcher: (researcher: Researcher) => void
  onDeleteResearcher: (id: number) => void
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export function ResearcherList({
  researchers,
  isLoading,
  pagination,
  currentPage,
  itemsPerPage,
  onResearcherClick,
  onEditResearcher,
  onDeleteResearcher,
  onPageChange,
  onItemsPerPageChange
}: ResearcherListProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">전체 인력 목록</h2>
        <div className="flex gap-2 items-center">
          {/* 페이지 크기 선택 */}
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className="p-2 border border-gray-200 rounded-md text-sm"
          >
            <option value={5}>5개씩</option>
            <option value={10}>10개씩</option>
            <option value={20}>20개씩</option>
            <option value={50}>50개씩</option>
          </select>
          
          <Button variant="outline" className="flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </div>
      ) : (
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
                <th className="p-3 text-center text-xs font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody>
              {researchers.length > 0 ? (
                researchers.map((researcher) => (
                  <tr key={researcher.id} className="border-b border-gray-100">
                    <td className="p-3">
                      <button 
                        className="text-blue-600 hover:underline" 
                        onClick={() => onResearcherClick(researcher)}
                      >
                        {researcher.name}
                      </button>
                    </td>
                    <td className="p-3">{researcher.department}</td>
                    <td className="p-3">{researcher.position}</td>
                    <td className="p-3">{researcher.email}</td>
                    <td className="p-3">{researcher.phone}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                        {researcher.status === "active" ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-green-500 hover:text-green-600"
                          onClick={() => onEditResearcher(researcher)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => onDeleteResearcher(researcher.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <SearchX
                        size={48}
                        className="text-gray-300"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">검색 결과가 없습니다</p>
                        <p className="text-xs text-gray-500 mt-1">
                          다른 검색 조건을 시도해보거나 새로운 연구자를 등록해보세요
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      <Pagination
        pagination={pagination}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  )
} 