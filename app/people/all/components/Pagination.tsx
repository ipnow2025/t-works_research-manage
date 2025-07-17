import React from 'react'
import { Button } from "@/components/ui/button"
import { PaginationInfo } from '../types/researcher'

interface PaginationProps {
  pagination: PaginationInfo
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export function Pagination({ 
  pagination, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}: PaginationProps) {
  if (pagination.totalPages <= 0) return null

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        전체 {pagination.totalItems}개 중{' '}
        {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalItems)}개 표시
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
        >
          이전
        </Button>
        
        {/* 페이지 번호들 */}
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum
            if (pagination.totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            )
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          다음
        </Button>
      </div>
    </div>
  )
} 