import { useState, useEffect } from 'react'
import { Researcher, NewResearcher, PaginationInfo, SearchFilters } from '../types/researcher'
import { fetchResearchers, createResearcher, updateResearcher, deleteResearcher } from '../utils/api'

export function useResearchers() {
  const [researchers, setResearchers] = useState<Researcher[]>([])
  const [filteredResearchers, setFilteredResearchers] = useState<Researcher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  })

  // 연구자 목록 조회
  const loadResearchers = async (page = 1, filters?: Partial<SearchFilters>) => {
    try {
      setIsLoading(true)
      const response = await fetchResearchers(page, itemsPerPage, filters)
      
      if (response.success && response.data && response.pagination) {
        setResearchers(response.data)
        setFilteredResearchers(response.data)
        setPagination(response.pagination)
        setCurrentPage(page)
      } else {
        console.error('Failed to fetch researchers:', response.error)
      }
    } catch (error) {
      console.error('Error loading researchers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 검색 실행
  const searchResearchers = async (filters: Partial<SearchFilters>) => {
    await loadResearchers(1, filters)
  }

  // 새 연구자 등록
  const addResearcher = async (newResearcher: NewResearcher): Promise<boolean> => {
    try {
      const response = await createResearcher(newResearcher)
      
      if (response.success) {
        // 목록 새로고침
        await loadResearchers(currentPage)
        return true
      } else {
        alert(`등록 실패: ${response.error}`)
        return false
      }
    } catch (error) {
      console.error('Error creating researcher:', error)
      alert("등록 중 오류가 발생했습니다.")
      return false
    }
  }

  // 연구자 정보 수정
  const editResearcher = async (id: number, updatedResearcher: NewResearcher): Promise<boolean> => {
    try {
      const response = await updateResearcher(id, updatedResearcher)
      
      if (response.success) {
        // 목록 새로고침
        await loadResearchers(currentPage)
        return true
      } else {
        alert(`수정 실패: ${response.error}`)
        return false
      }
    } catch (error) {
      console.error('Error updating researcher:', error)
      alert("수정 중 오류가 발생했습니다.")
      return false
    }
  }

  // 연구자 삭제
  const removeResearcher = async (id: number): Promise<boolean> => {
    if (!confirm("정말로 이 연구자를 삭제하시겠습니까?")) return false

    try {
      const response = await deleteResearcher(id)

      if (response.success) {
        alert("연구자가 삭제되었습니다.")
        await loadResearchers(currentPage)
        return true
      } else {
        alert(`삭제 실패: ${response.error}`)
        return false
      }
    } catch (error) {
      console.error('Error deleting researcher:', error)
      alert("삭제 중 오류가 발생했습니다.")
      return false
    }
  }

  // 페이지 변경
  const changePage = (page: number) => {
    loadResearchers(page)
  }

  // 페이지 크기 변경
  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
    loadResearchers(1)
  }

  // 초기 로드
  useEffect(() => {
    loadResearchers(1)
  }, [itemsPerPage])

  return {
    // 상태
    researchers,
    filteredResearchers,
    isLoading,
    currentPage,
    itemsPerPage,
    pagination,

    // 액션
    loadResearchers,
    searchResearchers,
    addResearcher,
    editResearcher,
    removeResearcher,
    changePage,
    changeItemsPerPage
  }
} 