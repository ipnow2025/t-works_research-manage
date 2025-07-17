import { apiFetch } from '@/lib/func'

// 수행기관 API
export const organizationApi = {
  // 모든 수행기관 조회
  getAll: async () => {
    const response = await apiFetch('/api/organizations')
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 새 수행기관 추가
  create: async (name: string) => {
    const response = await apiFetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 수행기관 수정
  update: async (id: number, name: string) => {
    const response = await apiFetch(`/api/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 수행기관 삭제
  delete: async (id: number) => {
    const response = await apiFetch(`/api/organizations/${id}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  }
}

// 연구책임자 API
export const researcherApi = {
  // 모든 연구책임자 조회
  getAll: async () => {
    const response = await apiFetch('/api/pi')
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 새 연구책임자 추가
  create: async (name: string) => {
    const response = await apiFetch('/api/pi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 연구책임자 수정
  update: async (id: number, name: string) => {
    const response = await apiFetch(`/api/pi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 연구책임자 삭제
  delete: async (id: number) => {
    const response = await apiFetch(`/api/pi/${id}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  }
}

// 프로젝트 API
export const projectApi = {
  // 모든 프로젝트 조회 (검색 기능 포함)
  getAll: async (filters?: {
    year?: string
    organization?: string
    status?: string
    searchQuery?: string
  }) => {
    const params = new URLSearchParams()
    if (filters?.year) params.append('year', filters.year)
    if (filters?.organization) params.append('organization', filters.organization)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.searchQuery) params.append('searchQuery', filters.searchQuery)
    
    const url = `/api/projects${params.toString() ? `?${params.toString()}` : ''}`
    const response = await apiFetch(url)
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 새 프로젝트 추가
  create: async (projectData: {
    name: string
    type: string
    organization: string
    pi: string
    startDate: string
    endDate: string
    budget?: string
    description?: string
  }) => {
    const response = await apiFetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 프로젝트 수정
  update: async (id: number, projectData: {
    name: string
    type: string
    organization: string
    pi: string
    startDate: string
    endDate: string
    budget?: string
    description?: string
  }) => {
    const response = await apiFetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result.data
  },

  // 프로젝트 삭제
  delete: async (id: number) => {
    const response = await apiFetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    return result
  }
} 