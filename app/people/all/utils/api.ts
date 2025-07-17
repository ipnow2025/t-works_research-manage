import { apiFetch } from '@/lib/func'
import { Researcher, NewResearcher, PaginationInfo, SearchFilters } from '../types/researcher'

// API 응답 타입
interface ApiResponse<T> {
  success: boolean
  data?: T
  pagination?: PaginationInfo
  error?: string
  message?: string
}

// 연구자 목록 조회
export async function fetchResearchers(
  page = 1,
  limit = 10,
  filters?: Partial<SearchFilters>
): Promise<ApiResponse<Researcher[]>> {
  try {
    const params = new URLSearchParams({
      status: 'active',
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (filters?.searchQuery) params.append('search', filters.searchQuery)
    if (filters?.departmentFilter) params.append('department', filters.departmentFilter)
    if (filters?.positionFilter) params.append('position', filters.positionFilter)

    const response = await apiFetch(`/api/researchers?${params.toString()}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching researchers:', error)
    return {
      success: false,
      error: 'Failed to fetch researchers'
    }
  }
}

// 새 연구자 등록
export async function createResearcher(researcher: NewResearcher): Promise<ApiResponse<Researcher>> {
  try {
    const response = await apiFetch('/api/researchers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(researcher),
    })

    return await response.json()
  } catch (error) {
    console.error('Error creating researcher:', error)
    return {
      success: false,
      error: 'Failed to create researcher'
    }
  }
}

// 연구자 정보 수정
export async function updateResearcher(id: number, researcher: NewResearcher): Promise<ApiResponse<Researcher>> {
  try {
    const response = await apiFetch(`/api/researchers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(researcher),
    })

    return await response.json()
  } catch (error) {
    console.error('Error updating researcher:', error)
    return {
      success: false,
      error: 'Failed to update researcher'
    }
  }
}

// 연구자 삭제
export async function deleteResearcher(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await apiFetch(`/api/researchers/${id}`, {
      method: 'DELETE',
    })

    return await response.json()
  } catch (error) {
    console.error('Error deleting researcher:', error)
    return {
      success: false,
      error: 'Failed to delete researcher'
    }
  }
} 