// 연구자 인터페이스 정의
export interface Researcher {
  id: number
  name: string
  department: string
  position: string
  email: string
  phone: string
  age?: number
  gender: '남성' | '여성'
  degree?: string
  lab?: string
  lab_url?: string
  education: string[]
  research_areas: string[]
  publications: string[]
  patents: string[]
  awards: string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// 새 연구자 등록용 인터페이스
export interface NewResearcher {
  name: string
  department: string
  position: string
  email: string
  phone: string
  age: string
  gender: string
  degree: string
  lab: string
  labUrl: string
  education: string[]
  researchAreas: string[]
  publications: string[]
  patents: string[]
  awards: string[]
}

// 페이지네이션 인터페이스
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// 검색 필터 인터페이스
export interface SearchFilters {
  searchQuery: string
  departmentFilter: string
  positionFilter: string
} 