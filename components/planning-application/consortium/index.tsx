"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ChevronDown, Edit2, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiFetch } from "@/lib/func"

interface Member {
  id: string
  name: string
  position: string
  role: string
  phone: string
  mobile: string
  email: string
}

interface Organization {
  id: string
  name: string
  type: string
  members: Member[]
  isNew?: boolean
}

interface ConsortiumProps {
  project: any
  onConsortiumChange?: (data: {
    projectType: "single" | "multi"
    projectDuration: number
    organizations: Organization[]
    yearlyOrganizations?: { [key: number]: Organization[] }
  }) => void
}

export function Consortium({ project, onConsortiumChange }: ConsortiumProps) {
  // onConsortiumChange 콜백을 ref로 저장
  const onConsortiumChangeRef = useRef(onConsortiumChange)
  
  // 콜백이 변경될 때마다 ref 업데이트
  useEffect(() => {
    onConsortiumChangeRef.current = onConsortiumChange
  }, [onConsortiumChange])

  // 프로젝트 데이터를 기반으로 사업 유형과 기간 계산
  const calculateProjectTypeAndDuration = () => {
    if (!project?.start_date || !project?.end_date) {
      return { type: "multi" as const, duration: 2 }
    }

    const startDate = new Date(project.start_date)
    const endDate = new Date(project.end_date)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365))

    return {
      type: diffYears <= 1 ? "single" as const : "multi" as const,
      duration: Math.max(1, Math.min(5, diffYears))
    }
  }

  const { type: calculatedType, duration: calculatedDuration } = calculateProjectTypeAndDuration()
  
  const [projectType, setProjectType] = useState<"single" | "multi">(calculatedType)
  const [projectDuration, setProjectDuration] = useState<number>(calculatedDuration)
  const [selectedYear, setSelectedYear] = useState<number>(1) // 현재 선택된 연차

  // 연차별 기관 데이터 관리
  const [yearlyOrganizations, setYearlyOrganizations] = useState<{ [key: number]: Organization[] }>({})

  // 현재 선택된 연차의 기관들 가져오기
  const getCurrentYearOrganizations = () => {
    return yearlyOrganizations[selectedYear] || []
  }

  // 연차별 기관 설정
  const setYearOrganizations = (year: number, orgs: Organization[]) => {
    setYearlyOrganizations(prev => ({
      ...prev,
      [year]: orgs
    }))
  }

  // 연차 변경 시 기관 데이터 복사
  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    
    // 해당 연차의 컨소시엄 기관과 구성원 데이터 가져오기
    if (project?.id && projectType === "multi") {
      fetchConsortiumOrganizations(project.id, year)
    }
  }

  // API 데이터를 사용하여 organizations 초기화
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    if (project?.consortium_organizations && project.consortium_organizations.length > 0) {
      return project.consortium_organizations.map((org: any) => ({
        id: org.id.toString(),
        name: org.organization_name,
        type: org.organization_type === '주관기관' ? '주관' : 
              org.organization_type === '공동연구개발기관' ? '공동' : '참여',
        members: [], // 구성원은 별도 API로 가져와야 함
        isNew: false
      }))
    }
    return []
  })

  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [editingOrg, setEditingOrg] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [loading, setLoading] = useState(false)

  // 컨소시엄 구성원 데이터 가져오기
  const fetchConsortiumMembers = async (projectId: number, year: number = 1) => {
    try {
      
      const response = await apiFetch(`/api/project-consortium-members?projectId=${projectId}&year=${year}`)
      const result = await response.json()
            
      if (result.success) {
        // 기관별로 구성원 그룹화
        const membersByOrg = result.data.reduce((acc: any, member: any) => {
          const orgId = member.organization_id.toString()
          if (!acc[orgId]) {
            acc[orgId] = []
          }
          acc[orgId].push({
            id: member.id.toString(),
            name: member.member_name,
            position: member.position,
            role: member.role,
            phone: member.phone,
            mobile: member.mobile,
            email: member.email
          })
          return acc
        }, {})
                
        // 올바른 상태에 구성원 추가
        if (projectType === "multi") {
          // 연차별 사업인 경우
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.map(org => ({
            ...org,
            members: membersByOrg[org.id] || []
          }))
          setYearOrganizations(year, updatedOrgs)
        } else {
          // 단년도 사업인 경우
          setOrganizations(prev => prev.map(org => ({
            ...org,
            members: membersByOrg[org.id] || []
          })))
        }
      }
    } catch (error) {
      console.error('컨소시엄 구성원 조회 오류:', error)
    }
  }

  // 컨소시엄 기관 데이터 가져오기
  const fetchConsortiumOrganizations = async (projectId: number, year: number = 1) => {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/project-consortium-organizations?projectId=${projectId}&year=${year}`)
      const result = await response.json()
            
      if (result.success) {
        const newOrganizations = result.data.map((org: any) => ({
          id: org.id.toString(),
          name: org.organization_name,
          type: org.organization_type === '주관기관' ? '주관' : 
                org.organization_type === '공동연구개발기관' ? '공동' : '참여',
          members: [], // 구성원은 별도 API로 가져와야 함
          isNew: false
        }))
                
        if (projectType === "multi") {
          setYearOrganizations(year, newOrganizations)
          // 기관 데이터 설정 후 구성원 데이터 가져오기
          if (newOrganizations.length > 0) {
            // 기관 데이터를 직접 전달하여 구성원 데이터 가져오기
            await fetchConsortiumMembersWithOrgs(projectId, year, newOrganizations)
          }
        } else {
          setOrganizations(newOrganizations)
          // 기관 데이터 설정 후 구성원 데이터 가져오기
          if (newOrganizations.length > 0) {
            // 기관 데이터를 직접 전달하여 구성원 데이터 가져오기
            await fetchConsortiumMembersWithOrgs(projectId, year, newOrganizations)
          }
        }
      }
    } catch (error) {
      console.error('컨소시엄 기관 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 기관 데이터를 직접 받아서 구성원 데이터를 가져오는 함수
  const fetchConsortiumMembersWithOrgs = async (projectId: number, year: number, orgs: Organization[]) => {
    try {
      
      const response = await apiFetch(`/api/project-consortium-members?projectId=${projectId}&year=${year}`)
      const result = await response.json()
            
      if (result.success) {
        // 기관별로 구성원 그룹화
        const membersByOrg = result.data.reduce((acc: any, member: any) => {
          const orgId = member.organization_id.toString()
          if (!acc[orgId]) {
            acc[orgId] = []
          }
          acc[orgId].push({
            id: member.id.toString(),
            name: member.member_name,
            position: member.position,
            role: member.role,
            phone: member.phone,
            mobile: member.mobile,
            email: member.email
          })
          return acc
        }, {})
                
        // 전달받은 기관 데이터에 구성원 추가
        const updatedOrgs = orgs.map(org => ({
          ...org,
          members: membersByOrg[org.id] || []
        }))
        
        // 올바른 상태에 설정
        if (projectType === "multi") {
          setYearOrganizations(year, updatedOrgs)
        } else {
          setOrganizations(updatedOrgs)
        }
      }
    } catch (error) {
      console.error('컨소시엄 구성원 조회 오류:', error)
    }
  }

  // 컨소시엄 기관 추가 API
  const addConsortiumOrganization = async (organizationData: any) => {
    try {
      const response = await apiFetch('/api/project-consortium-organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectPlanningId: project.id,
          year: selectedYear,
          organizationType: organizationData.type === '주관' ? '주관기관' : 
                           organizationData.type === '공동' ? '공동연구개발기관' : '참여기관',
          organizationName: organizationData.name,
          roleDescription: ''
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // 성공 시 해당 연차의 기관 목록을 다시 가져옴
        await fetchConsortiumOrganizations(project.id, selectedYear)
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('컨소시엄 기관 추가 오류:', error)
      throw error
    }
  }

  // 컨소시엄 기관 삭제 API
  const deleteConsortiumOrganization = async (orgId: string) => {
    try {
      const response = await apiFetch(`/api/project-consortium-organizations?id=${orgId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      if (result.success) {
        // 성공 시 해당 연차의 기관 목록을 다시 가져옴
        await fetchConsortiumOrganizations(project.id, selectedYear)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('컨소시엄 기관 삭제 오류:', error)
      throw error
    }
  }

  // 컨소시엄 구성원 추가 API
  const addConsortiumMember = async (memberData: any, orgId: string) => {
    try {
      const response = await apiFetch('/api/project-consortium-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: orgId,
          projectPlanningId: project.id,
          year: selectedYear,
          memberName: memberData.name,
          position: memberData.position,
          role: memberData.role,
          phone: memberData.phone,
          mobile: memberData.mobile,
          email: memberData.email
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // 성공 시 해당 연차의 구성원 목록을 다시 가져옴
        await fetchConsortiumMembers(project.id, selectedYear)
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('컨소시엄 구성원 추가 오류:', error)
      throw error
    }
  }

  // 컨소시엄 구성원 삭제 API
  const deleteConsortiumMember = async (memberId: string) => {
    try {
      const response = await apiFetch(`/api/project-consortium-members?id=${memberId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      if (result.success) {
        // 성공 시 해당 연차의 구성원 목록을 다시 가져옴
        await fetchConsortiumMembers(project.id, selectedYear)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('컨소시엄 구성원 삭제 오류:', error)
      throw error
    }
  }

  // 컨소시엄 구성원 수정 API
  const updateConsortiumMember = async (memberId: string, memberData: any) => {
    try {
      const response = await apiFetch('/api/project-consortium-members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: memberId,
          memberName: memberData.name,
          position: memberData.position,
          role: memberData.role,
          phone: memberData.phone,
          mobile: memberData.mobile,
          email: memberData.email
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // 성공 시 해당 연차의 구성원 목록을 다시 가져옴
        await fetchConsortiumMembers(project.id, selectedYear)
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('컨소시엄 구성원 수정 오류:', error)
      throw error
    }
  }

  // 컨소시엄 기관 수정 API
  const updateConsortiumOrganization = async (orgId: string, orgData: any) => {
    try {
      const response = await apiFetch('/api/project-consortium-organizations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orgId,
          organizationType: orgData.type === '주관' ? '주관기관' : 
                           orgData.type === '공동' ? '공동연구개발기관' : '참여기관',
          organizationName: orgData.name,
          roleDescription: ''
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // 성공 시 해당 연차의 기관 목록과 구성원 목록을 다시 가져옴
        await fetchConsortiumOrganizations(project.id, selectedYear)
        await fetchConsortiumMembers(project.id, selectedYear)
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('컨소시엄 기관 수정 오류:', error)
      throw error
    }
  }

  // 프로젝트 데이터가 변경되면 organizations 업데이트
  useEffect(() => {
    if (project?.id) {      
      // 연차별 사업인 경우
      if (projectType === "multi") {
        // 해당 연차의 데이터 로드
        fetchConsortiumOrganizations(project.id, selectedYear)
      } else {
        // 단년도 사업인 경우
        fetchConsortiumOrganizations(project.id, 1)
      }
    }
  }, [project?.id, selectedYear, projectType]) // yearlyOrganizations, organizations 제거하여 무한 루프 방지

  // 프로젝트 데이터가 변경되면 사업 유형과 기간도 업데이트
  useEffect(() => {
    const { type, duration } = calculateProjectTypeAndDuration()
    setProjectType(type)
    setProjectDuration(duration)
  }, [project])

  // 컨소시엄 데이터 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (!onConsortiumChangeRef.current) return;
    
    let allOrganizations: Organization[] = []
    
    if (projectType === "multi") {
      // 연차별 사업인 경우: 모든 연차의 기관들을 하나의 배열로 합치기 (저장된 기관만)
      Object.values(yearlyOrganizations).forEach((yearOrgs) => {
        const savedOrgs = yearOrgs.filter(org => !org.isNew) // 저장된 기관만 필터링
        allOrganizations = [...allOrganizations, ...savedOrgs]
      })
    } else {
      // 단년도 사업인 경우 (저장된 기관만)
      allOrganizations = organizations.filter(org => !org.isNew)
    }
    
    // 연차별 기관 정보에서 연차 정보 추출
    const yearlyOrgsWithYears: { [key: number]: Organization[] } | undefined = projectType === "multi" ? {} : undefined;
    if (projectType === "multi" && yearlyOrganizations) {
      Object.entries(yearlyOrganizations).forEach(([yearStr, yearOrgs]) => {
        const year = Number(yearStr);
        const savedOrgs = yearOrgs.filter(org => !org.isNew);
        if (savedOrgs.length > 0) {
          yearlyOrgsWithYears![year] = savedOrgs;
        }
      });
    }
    
    onConsortiumChangeRef.current({
      projectType,
      projectDuration,
      organizations: allOrganizations,
      yearlyOrganizations: yearlyOrgsWithYears,
    })
    
  }, [projectType, projectDuration, organizations, yearlyOrganizations])

  const handleProjectTypeChange = (type: "single" | "multi") => {
    setProjectType(type)
    if (type === "single") {
      setProjectDuration(1)
      // 연차별 데이터를 단년도 데이터로 변환
      const currentOrgs = getCurrentYearOrganizations()
      if (currentOrgs.length > 0) {
        setOrganizations(currentOrgs)
      }
    } else {
      setProjectDuration(2)
      // 단년도 데이터를 연차별 데이터로 변환
      if (organizations.length > 0) {
        setYearOrganizations(1, organizations)
      }
    }
  }

  const handleDurationChange = (duration: number) => {
    setProjectDuration(duration)
  }

  const handleAddOrganization = async () => {
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: "",
      type: "공동",
      members: [],
      isNew: true,
    }
    
    if (projectType === "multi") {
      // 연차별 사업인 경우
      const currentOrgs = getCurrentYearOrganizations()
      setYearOrganizations(selectedYear, [...currentOrgs, newOrg])
    } else {
      // 단년도 사업인 경우
      setOrganizations(prev => [...prev, newOrg])
    }
    setEditingOrg(newOrg.id)
  }

  const handleRemoveOrganization = async (orgId: string) => {
    // 삭제할 기관 정보 가져오기
    let orgToDelete: Organization | null = null
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations()
      orgToDelete = currentOrgs.find(org => org.id === orgId) || null
    } else {
      orgToDelete = organizations.find(org => org.id === orgId) || null
    }

    if (!orgToDelete) return

    // 확인 알림
    const isConfirmed = window.confirm(
      `"${orgToDelete.name}" 기관을 삭제하시겠습니까?\n\n이 기관에 등록된 모든 연구자도 함께 삭제됩니다.`
    )

    if (!isConfirmed) return

    try {
      await deleteConsortiumOrganization(orgId)
    } catch (error) {
      console.error('기관 삭제 실패:', error)
      // 실패 시에도 UI에서 제거 (사용자 경험을 위해)
      if (projectType === "multi") {
        const currentOrgs = getCurrentYearOrganizations()
        setYearOrganizations(selectedYear, currentOrgs.filter((org) => org.id !== orgId))
      } else {
        setOrganizations(prev => prev.filter((org) => org.id !== orgId))
      }
    }
  }

  const handleAddMember = async (orgId: string) => {
    const newMember: Member = {
      id: `member_${Date.now()}`,
      name: "",
      position: "",
      role: "",
      phone: "",
      mobile: "",
      email: "",
    }
    
    // UI에 즉시 추가 (사용자 경험을 위해)
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations()
      const updatedOrgs = currentOrgs.map((org) => 
        org.id === orgId ? { ...org, members: [...org.members, newMember] } : org
      )
      setYearOrganizations(selectedYear, updatedOrgs)
    } else {
      setOrganizations(prev => prev.map((org) => 
        org.id === orgId ? { ...org, members: [...org.members, newMember] } : org
      ))
    }
    setEditingMember(newMember.id)
    setEditForm(newMember)
  }

  const handleRemoveMember = async (orgId: string, memberId: string) => {
    // 삭제할 연구자 정보 가져오기
    let memberToDelete: Member | null = null
    let orgName = ''
    
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations()
      const org = currentOrgs.find(o => o.id === orgId)
      if (org) {
        orgName = org.name
        memberToDelete = org.members.find(m => m.id === memberId) || null
      }
    } else {
      const org = organizations.find(o => o.id === orgId)
      if (org) {
        orgName = org.name
        memberToDelete = org.members.find(m => m.id === memberId) || null
      }
    }

    if (!memberToDelete) return

    // 확인 알림
    const isConfirmed = window.confirm(
      `"${memberToDelete.name}" 연구자를 삭제하시겠습니까?\n\n기관: ${orgName}\n이름: ${memberToDelete.name}\n직급: ${memberToDelete.position}`
    )

    if (!isConfirmed) return

    try {
      await deleteConsortiumMember(memberId)
    } catch (error) {
      console.error('구성원 삭제 실패:', error)
      // 실패 시에도 UI에서 제거 (사용자 경험을 위해)
      if (projectType === "multi") {
        const currentOrgs = getCurrentYearOrganizations()
        const updatedOrgs = currentOrgs.map((org) => 
          org.id === orgId ? { ...org, members: org.members.filter((m) => m.id !== memberId) } : org
        )
        setYearOrganizations(selectedYear, updatedOrgs)
      } else {
        setOrganizations(prev => prev.map((org) => 
          org.id === orgId ? { ...org, members: org.members.filter((m) => m.id !== memberId) } : org
        ))
      }
    }
  }

  const handleEditMember = (member: Member) => {
    setEditingMember(member.id)
    setEditForm({ ...member })
  }

  const handleSaveMember = async () => {
    try {      
      // 현재 편집 중인 구성원이 새로 추가된 것인지 확인
      let isNewMember = false
      let orgId = ''
      let orgIsNew = false
      
      if (projectType === "multi") {
        const currentOrgs = getCurrentYearOrganizations()
        for (const org of currentOrgs) {
          const member = org.members.find(m => m.id === editingMember)
          if (member) {
            orgId = org.id
            orgIsNew = org.isNew || false
            isNewMember = member.name === "" // 이름이 비어있으면 새 구성원
            break
          }
        }
      } else {
        for (const org of organizations) {
          const member = org.members.find(m => m.id === editingMember)
          if (member) {
            orgId = org.id
            orgIsNew = org.isNew || false
            isNewMember = member.name === "" // 이름이 비어있으면 새 구성원
            break
          }
        }
      }
            
      // 새 기관에 연구자를 추가하려는 경우, 기관을 먼저 저장
      if (orgIsNew) {
        await handleSaveOrganization(orgId)
        // 기관 저장 후 새로운 기관 ID를 가져와야 함
        if (projectType === "multi") {
          await fetchConsortiumOrganizations(project.id, selectedYear)
        } else {
          await fetchConsortiumOrganizations(project.id, 1)
        }
        // 잠시 대기 후 연구자 저장
        setTimeout(async () => {
          // 업데이트된 기관 목록에서 올바른 기관 ID 찾기
          let updatedOrgId = ''
          if (projectType === "multi") {
            const currentOrgs = getCurrentYearOrganizations()
            const org = currentOrgs.find(o => o.name === editForm.name || o.isNew === false)
            if (org) {
              updatedOrgId = org.id
            }
          } else {
            const org = organizations.find(o => o.name === editForm.name || o.isNew === false)
            if (org) {
              updatedOrgId = org.id
            }
          }
          
          if (updatedOrgId) {
            await addConsortiumMember(editForm, updatedOrgId)
            // 성공 시 해당 연차의 구성원만 다시 가져오기
            if (projectType === "multi") {
              await fetchConsortiumMembers(project.id, selectedYear)
            } else {
              await fetchConsortiumMembers(project.id, 1)
            }
          }
        }, 500)
      } else if (isNewMember && orgId) {
        // 새 구성원인 경우 API 호출
        await addConsortiumMember(editForm, orgId)
        // 성공 시 해당 연차의 구성원만 다시 가져오기
        if (projectType === "multi") {
          await fetchConsortiumMembers(project.id, selectedYear)
        } else {
          await fetchConsortiumMembers(project.id, 1)
        }
      } else if (editingMember) {
        // 기존 구성원인 경우 API 호출
        await updateConsortiumMember(editingMember, editForm)
        // 성공 시 해당 연차의 구성원만 다시 가져오기
        if (projectType === "multi") {
          await fetchConsortiumMembers(project.id, selectedYear)
        } else {
          await fetchConsortiumMembers(project.id, 1)
        }
      }
      
      setEditingMember(null)
      setEditForm({})
    } catch (error) {
      console.error('구성원 저장 실패:', error)
      // 실패 시에도 편집 모드 종료
      setEditingMember(null)
      setEditForm({})
    }
  }

  const handleCancelEdit = () => {
    setEditingMember(null)
    setEditForm({})
  }

  const handleSaveOrganization = async (orgId: string) => {
    try {      
      // 현재 편집 중인 기관 데이터 가져오기
      let orgToSave: Organization | null = null
      
      if (projectType === "multi") {
        const currentOrgs = getCurrentYearOrganizations()
        orgToSave = currentOrgs.find(org => org.id === orgId) || null
      } else {
        orgToSave = organizations.find(org => org.id === orgId) || null
      }
      
      if (orgToSave && orgToSave.isNew) {
        // 새 기관인 경우 API 호출
        const result = await addConsortiumOrganization(orgToSave)
        
        // 성공 시 해당 연차의 기관만 다시 가져오기
        if (projectType === "multi") {
          await fetchConsortiumOrganizations(project.id, selectedYear)
        } else {
          await fetchConsortiumOrganizations(project.id, 1)
        }
      } else if (orgToSave) {
        // 기존 기관인 경우 API 호출
        await updateConsortiumOrganization(orgId, orgToSave)
        
        // 성공 시 해당 연차의 기관만 다시 가져오기
        if (projectType === "multi") {
          await fetchConsortiumOrganizations(project.id, selectedYear)
        } else {
          await fetchConsortiumOrganizations(project.id, 1)
        }
      }
      
      setEditingOrg(null)
    } catch (error) {
      console.error('기관 저장 실패:', error)
      // 실패 시에도 편집 모드 종료
      setEditingOrg(null)
    }
  }

  const handleOrgNameChange = async (orgId: string, name: string) => {
    try {      
      // API 호출하여 데이터베이스에 저장
      const orgToUpdate = projectType === "multi" 
        ? getCurrentYearOrganizations().find(org => org.id === orgId)
        : organizations.find(org => org.id === orgId)
      
      if (orgToUpdate && !orgToUpdate.isNew) {
        await updateConsortiumOrganization(orgId, { ...orgToUpdate, name })
        
        // 성공 시 로컬 상태만 업데이트 (API 재호출 없이)
        if (projectType === "multi") {
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.map((org) => (org.id === orgId ? { ...org, name } : org))
          setYearOrganizations(selectedYear, updatedOrgs)
        } else {
          setOrganizations((orgs) => orgs.map((org) => (org.id === orgId ? { ...org, name } : org)))
        }
      } else {
        // 새 기관인 경우 로컬 상태만 업데이트
        if (projectType === "multi") {
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.map((org) => (org.id === orgId ? { ...org, name } : org))
          setYearOrganizations(selectedYear, updatedOrgs)
        } else {
          setOrganizations((orgs) => orgs.map((org) => (org.id === orgId ? { ...org, name } : org)))
        }
      }
    } catch (error) {
      console.error('기관명 변경 실패:', error)
      // 실패 시 원래 상태로 되돌리기
      if (projectType === "multi") {
        await fetchConsortiumOrganizations(project.id, selectedYear)
        await fetchConsortiumMembers(project.id, selectedYear)
      } else {
        await fetchConsortiumOrganizations(project.id, 1)
        await fetchConsortiumMembers(project.id, 1)
      }
    }
  }

  const handleOrgTypeChange = async (orgId: string, type: string) => {
    try {      
      // API 호출하여 데이터베이스에 저장
      const orgToUpdate = projectType === "multi" 
        ? getCurrentYearOrganizations().find(org => org.id === orgId)
        : organizations.find(org => org.id === orgId)
      
      if (orgToUpdate && !orgToUpdate.isNew) {
        await updateConsortiumOrganization(orgId, { ...orgToUpdate, type })
        
        // 성공 시 로컬 상태만 업데이트 (API 재호출 없이)
        if (projectType === "multi") {
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.map((org) => (org.id === orgId ? { ...org, type } : org))
          setYearOrganizations(selectedYear, updatedOrgs)
        } else {
          setOrganizations((orgs) => orgs.map((org) => (org.id === orgId ? { ...org, type } : org)))
        }
      } else {
        // 새 기관인 경우 로컬 상태만 업데이트
        if (projectType === "multi") {
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.map((org) => (org.id === orgId ? { ...org, type } : org))
          setYearOrganizations(selectedYear, updatedOrgs)
        } else {
          setOrganizations((orgs) => orgs.map((org) => (org.id === orgId ? { ...org, type } : org)))
        }
      }
    } catch (error) {
      console.error('기관 타입 변경 실패:', error)
      // 실패 시 원래 상태로 되돌리기
      if (projectType === "multi") {
        await fetchConsortiumOrganizations(project.id, selectedYear)
        await fetchConsortiumMembers(project.id, selectedYear)
      } else {
        await fetchConsortiumOrganizations(project.id, 1)
        await fetchConsortiumMembers(project.id, 1)
      }
    }
  }

  const getOrgIcon = (type: string) => {
    switch (type) {
      case "주관":
        return "주관"
      case "참여":
        return "참여"
      case "공동":
        return "공동"
      default:
        return "공동"
    }
  }

  return (
    <div className="space-y-6">
      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg">컨소시엄 데이터를 불러오는 중...</div>
        </div>
      )}

      {/* 사업 유형 설정 */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">사업 정보</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">사업 유형</label>
              <Select value={projectType} onValueChange={handleProjectTypeChange}>
                <SelectTrigger> 
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="single" className="bg-white hover:bg-gray-50">
                    단년도 사업
                  </SelectItem>
                  <SelectItem value="multi" className="bg-white hover:bg-gray-50">
                    연차별 사업
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {projectType === "multi" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">사업 기간</label>
                <Select
                  value={projectDuration.toString()}
                  onValueChange={(value) => handleDurationChange(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="2" className="bg-white hover:bg-gray-50">
                      2년
                    </SelectItem>
                    <SelectItem value="3" className="bg-white hover:bg-gray-50">
                      3년
                    </SelectItem>
                    <SelectItem value="4" className="bg-white hover:bg-gray-50">
                      4년
                    </SelectItem>
                    <SelectItem value="5" className="bg-white hover:bg-gray-50">
                      5년
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* 연차별 관리 (연차별 사업인 경우) */}
          {projectType === "multi" && projectDuration > 1 && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">연차별 관리</label>
              <div className="flex gap-2">
                {Array.from({ length: projectDuration }, (_, i) => i + 1).map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleYearChange(year)}
                  >
                    {year}차년도
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 기관 목록 */}
      {(() => {
        const currentOrgs = projectType === "multi" ? getCurrentYearOrganizations() : organizations
        
        if (currentOrgs.length > 0) {
          return currentOrgs.map((org) => (
            <Card key={org.id} className="border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {getOrgIcon(org.type)}
                    </div>
                    <div className="flex items-center gap-2">
                      {org.isNew || editingOrg === org.id ? (
                        <Input
                          value={org.name}
                          onChange={(e) => handleOrgNameChange(org.id, e.target.value)}
                          placeholder="기관명을 입력하세요"
                          className="text-lg font-medium border-0 bg-transparent p-0 h-auto focus-visible:ring-0 min-w-[200px]"
                        />
                      ) : (
                        <span className="text-lg font-medium">{org.name}</span>
                      )}
                      <Select value={org.type} onValueChange={(value) => handleOrgTypeChange(org.id, value)}>
                        <SelectTrigger className="w-24 h-8 border-0 bg-transparent py-0 px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="주관" className="bg-white hover:bg-gray-50">
                            주관
                          </SelectItem>
                          <SelectItem value="참여" className="bg-white hover:bg-gray-50">
                            참여
                          </SelectItem>
                          {/* <SelectItem value="공동" className="bg-white hover:bg-gray-50">
                            공동
                          </SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!org.isNew && (
                      <Button
                        onClick={() => handleAddMember(org.id)}
                        size="sm"
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        연구자 추가
                      </Button>
                    )}
                    {org.isNew && (
                      <Button
                        onClick={() => handleSaveOrganization(org.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        저장
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOrganization(org.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  return org.members.length > 0 ? (
                    org.members.map((member) => (
                      <div key={member.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="grid grid-cols-3 gap-8 flex-1">
                            <div className="min-w-0">
                              <div className="text-sm text-gray-600 mb-1">이름</div>
                              {editingMember === member.id ? (
                                <Input
                                  value={editForm.name || ""}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="h-10 text-base"
                                  placeholder="이름을 입력하세요"
                                />
                              ) : (
                                <div className="font-medium truncate h-10 flex items-center">{member.name}</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm text-gray-600 mb-1">직급</div>
                              {editingMember === member.id ? (
                                <Input
                                  value={editForm.position || ""}
                                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                  className="h-10 text-base"
                                  placeholder="직급을 입력하세요"
                                />
                              ) : (
                                <div className="font-medium truncate h-10 flex items-center">{member.position}</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm text-gray-600 mb-1">역할</div>
                              {editingMember === member.id ? (
                                <Input
                                  value={editForm.role || ""}
                                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                  className="h-10 text-base"
                                  placeholder="역할을 입력하세요"
                                />
                              ) : (
                                <div className="font-medium truncate h-10 flex items-center">{member.role}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            {editingMember === member.id ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleSaveMember}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMember(member)}
                                className="text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(org.id, member.id)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">전화번호</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.phone || ""}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="h-10 text-base"
                                placeholder="전화번호를 입력하세요"
                              />
                            ) : (
                              <div className="text-sm truncate h-10 flex items-center">{member.phone}</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">휴대폰</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.mobile || ""}
                                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                                className="h-10 text-base"
                                placeholder="휴대폰을 입력하세요"
                              />
                            ) : (
                              <div className="text-sm truncate h-10 flex items-center">{member.mobile}</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-gray-600 mb-1">이메일</div>
                            {editingMember === member.id ? (
                              <Input
                                value={editForm.email || ""}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="h-10 text-base"
                                placeholder="이메일을 입력하세요"
                              />
                            ) : (
                              <div className="text-sm truncate h-10 flex items-center">{member.email}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      등록된 연구자가 없습니다.
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          ))
        } else {
          return (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">등록된 컨소시엄 구성이 없습니다</div>
              <p>프로젝트에 참여하는 기관들을 등록해주세요.</p>
            </div>
          )
        }
      })()}

      <div className="flex justify-center">
        <Button
          onClick={handleAddOrganization}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          컨소시엄 기관 추가
        </Button>
      </div>
    </div>
  )
}
