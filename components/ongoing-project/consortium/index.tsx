"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ChevronDown, Edit2, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiFetch } from "@/lib/func"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Smartphone, Mail } from "lucide-react"

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

  // 고유 ID 생성을 위한 카운터
  const [idCounter, setIdCounter] = useState(0)
  
  // 고유 ID 생성 함수
  const generateUniqueId = useCallback((prefix: string) => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    const counter = idCounter
    setIdCounter(prev => prev + 1)
    return `${prefix}-${timestamp}-${random}-${counter}`
  }, [idCounter])

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
              org.organization_type === '참여기관' ? '참여' : 
              org.organization_type === '공동연구개발기관' ? '공동' : '수요',
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

  // 연차별 컨소시엄 데이터 자동 복사 함수
  const copyConsortiumToOtherYears = async () => {
    if (!project?.id || projectType !== "multi") return;
    
    try {
      setLoading(true);
      
      // 1차년도 데이터를 2,3,4,5차년도에 복사
      const targetYears = [2, 3, 4, 5].filter(year => year <= projectDuration);
      
      if (targetYears.length === 0) {
        alert('복사할 대상 연차가 없습니다.');
        return;
      }

      // 기관 데이터 복사
      const orgResponse = await apiFetch('/api/project-consortium-organizations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectPlanningId: project.id,
          sourceYear: 1,
          targetYears: targetYears
        })
      });

      const orgResult = await orgResponse.json();
      
      if (!orgResult.success) {
        throw new Error(orgResult.error || '기관 데이터 복사에 실패했습니다.');
      }

      // 구성원 데이터 복사
      const memberResponse = await apiFetch('/api/project-consortium-members', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectPlanningId: project.id,
          sourceYear: 1,
          targetYears: targetYears
        })
      });

      const memberResult = await memberResponse.json();
      
      if (!memberResult.success) {
        throw new Error(memberResult.error || '구성원 데이터 복사에 실패했습니다.');
      }

      // 성공 메시지 표시
      alert(`${orgResult.message}\n${memberResult.message}`);
      
      // 복사된 연차들의 데이터를 새로고침
      for (const year of targetYears) {
        await fetchConsortiumOrganizations(project.id, year);
      }
      
      // 1차년도 데이터도 새로고침하여 최신 상태 유지
      await fetchConsortiumOrganizations(project.id, 1);
      
    } catch (error) {
      console.error('컨소시엄 데이터 복사 중 오류:', error);
      alert(`컨소시엄 데이터 복사 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

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
                org.organization_type === '참여기관' ? '참여' : 
                org.organization_type === '공동연구개발기관' ? '공동' : '수요',
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
        
        // 올바른 상태에 업데이트
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

  // 컨소시엄 기관 추가
  const addConsortiumOrganization = async (organizationData: any) => {
    try {
      const response = await apiFetch('/api/project-consortium-organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectPlanningId: project.id,
          year: projectType === "multi" ? selectedYear : 1,
          organizationType: organizationData.type === '주관' ? '주관기관' : 
                           organizationData.type === '참여' ? '참여기관' : 
                           organizationData.type === '공동' ? '공동연구개발기관' : '수요기업',
          organizationName: organizationData.name,
          roleDescription: ''
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 새로 추가된 기관 데이터 가져오기
        await fetchConsortiumOrganizations(project.id, projectType === "multi" ? selectedYear : 1)
      }
      
      return result
    } catch (error) {
      console.error('컨소시엄 기관 추가 오류:', error)
      return { success: false, error: '컨소시엄 기관 추가 중 오류가 발생했습니다.' }
    }
  }

  // 컨소시엄 기관 삭제
  const deleteConsortiumOrganization = async (orgId: string) => {
    try {
      const response = await apiFetch(`/api/project-consortium-organizations?id=${orgId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 기관 데이터 다시 가져오기
        await fetchConsortiumOrganizations(project.id, projectType === "multi" ? selectedYear : 1)
      }
      
      return result
    } catch (error) {
      console.error('컨소시엄 기관 삭제 오류:', error)
      return { success: false, error: '컨소시엄 기관 삭제 중 오류가 발생했습니다.' }
    }
  }

  // 컨소시엄 구성원 추가
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
          year: projectType === "multi" ? selectedYear : 1,
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
        // 구성원 데이터 다시 가져오기
        await fetchConsortiumMembers(project.id, projectType === "multi" ? selectedYear : 1)
      }
      
      return result
    } catch (error) {
      console.error('컨소시엄 구성원 추가 오류:', error)
      return { success: false, error: '컨소시엄 구성원 추가 중 오류가 발생했습니다.' }
    }
  }

  // 컨소시엄 구성원 삭제
  const deleteConsortiumMember = async (memberId: string) => {
    try {
      const response = await apiFetch(`/api/project-consortium-members?id=${memberId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 구성원 데이터 다시 가져오기
        await fetchConsortiumMembers(project.id, projectType === "multi" ? selectedYear : 1)
      }
      
      return result
    } catch (error) {
      console.error('컨소시엄 구성원 삭제 오류:', error)
      return { success: false, error: '컨소시엄 구성원 삭제 중 오류가 발생했습니다.' }
    }
  }

  // 컨소시엄 구성원 수정
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
        // 구성원 데이터 다시 가져오기
        await fetchConsortiumMembers(project.id, projectType === "multi" ? selectedYear : 1)
      }
      
      return result
    } catch (error) {
      console.error('컨소시엄 구성원 수정 오류:', error)
      return { success: false, error: '컨소시엄 구성원 수정 중 오류가 발생했습니다.' }
    }
  }

  // 컨소시엄 기관 수정
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
                           orgData.type === '참여' ? '참여기관' : 
                           orgData.type === '공동' ? '공동연구개발기관' : '수요기업',
          organizationName: orgData.name,
          roleDescription: ''
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 기관 데이터 다시 가져오기
        await fetchConsortiumOrganizations(project.id, projectType === "multi" ? selectedYear : 1)
      }
      
      return result
    } catch (error) {
      console.error('컨소시엄 기관 수정 오류:', error)
      return { success: false, error: '컨소시엄 기관 수정 중 오류가 발생했습니다.' }
    }
  }

  // 사업 유형 변경 처리
  const handleProjectTypeChange = (type: "single" | "multi") => {
    setProjectType(type)
    
    if (type === "single") {
      // 단년도 사업으로 변경 시 1차년도 데이터만 사용
      setSelectedYear(1)
      if (project?.id) {
        fetchConsortiumOrganizations(project.id, 1)
      }
    } else {
      // 연차별 사업으로 변경 시 현재 선택된 연차 데이터 사용
      if (project?.id) {
        fetchConsortiumOrganizations(project.id, selectedYear)
      }
    }
  }

  // 사업 기간 변경 처리
  const handleDurationChange = (duration: number) => {
    setProjectDuration(duration)
  }

  // 기관 추가 처리
  const handleAddOrganization = async () => {
    const newOrg: Organization = {
      id: generateUniqueId('temp'),
      name: '',
      type: '참여',
      members: [],
      isNew: true
    }
    
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations()
      const updatedOrgs = [...currentOrgs, newOrg]
      setYearOrganizations(selectedYear, updatedOrgs)
      // 부모 컴포넌트에 변경사항 알림
      if (onConsortiumChangeRef.current) {
        onConsortiumChangeRef.current({
          projectType,
          projectDuration,
          organizations: updatedOrgs,
          yearlyOrganizations: { ...yearlyOrganizations, [selectedYear]: updatedOrgs }
        })
      }
    } else {
      const updatedOrgs = [...organizations, newOrg]
      setOrganizations(updatedOrgs)
      // 부모 컴포넌트에 변경사항 알림
      if (onConsortiumChangeRef.current) {
        onConsortiumChangeRef.current({
          projectType,
          projectDuration,
          organizations: updatedOrgs
        })
      }
    }
  }

  // 기관 삭제 처리
  const handleRemoveOrganization = async (orgId: string) => {
    if (orgId.startsWith('temp-')) {
      // 임시 기관인 경우 상태에서만 제거
      if (projectType === "multi") {
        const currentOrgs = getCurrentYearOrganizations()
        const updatedOrgs = currentOrgs.filter(org => org.id !== orgId)
        setYearOrganizations(selectedYear, updatedOrgs)
        // 부모 컴포넌트에 변경사항 알림
        if (onConsortiumChangeRef.current) {
          onConsortiumChangeRef.current({
            projectType,
            projectDuration,
            organizations: updatedOrgs,
            yearlyOrganizations: { ...yearlyOrganizations, [selectedYear]: updatedOrgs }
          })
        }
      } else {
        const updatedOrgs = organizations.filter(org => org.id !== orgId)
        setOrganizations(updatedOrgs)
        // 부모 컴포넌트에 변경사항 알림
        if (onConsortiumChangeRef.current) {
          onConsortiumChangeRef.current({
            projectType,
            projectDuration,
            organizations: updatedOrgs
          })
        }
      }
    } else {
      // 실제 기관인 경우 API 호출
      const result = await deleteConsortiumOrganization(orgId)
      if (!result.success) {
        alert(result.error || '기관 삭제 중 오류가 발생했습니다.')
      } else {
        // 삭제 성공 후 상태 업데이트 및 부모 컴포넌트에 알림
        if (projectType === "multi") {
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.filter(org => org.id !== orgId)
          setYearOrganizations(selectedYear, updatedOrgs)
          if (onConsortiumChangeRef.current) {
            onConsortiumChangeRef.current({
              projectType,
              projectDuration,
              organizations: updatedOrgs,
              yearlyOrganizations: { ...yearlyOrganizations, [selectedYear]: updatedOrgs }
            })
          }
        } else {
          const updatedOrgs = organizations.filter(org => org.id !== orgId)
          setOrganizations(updatedOrgs)
          if (onConsortiumChangeRef.current) {
            onConsortiumChangeRef.current({
              projectType,
              projectDuration,
              organizations: updatedOrgs
            })
          }
        }
      }
    }
  }

  // 구성원 추가 처리
  const handleAddMember = async (orgId: string) => {
    const newMember: Member = {
      id: generateUniqueId('temp'),
      name: '',
      position: '',
      role: '',
      phone: '',
      mobile: '',
      email: ''
    }
    
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations()
      const updatedOrgs = currentOrgs.map(org => 
        org.id === orgId 
          ? { ...org, members: [...org.members, newMember] }
          : org
      )
      setYearOrganizations(selectedYear, updatedOrgs)
    } else {
      setOrganizations(prev => prev.map(org => 
        org.id === orgId 
          ? { ...org, members: [...org.members, newMember] }
          : org
      ))
    }
    
    // 편집 모드로 전환
    setEditingMember(newMember.id)
    setEditForm({
      name: '',
      position: '',
      role: '',
      phone: '',
      mobile: '',
      email: ''
    })
  }

  // 구성원 삭제 처리
  const handleRemoveMember = async (orgId: string, memberId: string) => {
    if (memberId.startsWith('temp-')) {
      // 임시 구성원인 경우 상태에서만 제거
      if (projectType === "multi") {
        const currentOrgs = getCurrentYearOrganizations()
        const updatedOrgs = currentOrgs.map(org => 
          org.id === orgId 
            ? { ...org, members: org.members.filter(member => member.id !== memberId) }
            : org
        )
        setYearOrganizations(selectedYear, updatedOrgs)
      } else {
        setOrganizations(prev => prev.map(org => 
          org.id === orgId 
            ? { ...org, members: org.members.filter(member => member.id !== memberId) }
            : org
        ))
      }
    } else {
      // 실제 구성원인 경우 API 호출
      const result = await deleteConsortiumMember(memberId)
      if (!result.success) {
        alert(result.error || '구성원 삭제 중 오류가 발생했습니다.')
      }
    }
  }

  // 구성원 편집 시작
  const handleEditMember = (member: Member) => {
    setEditingMember(member.id)
    setEditForm({
      name: member.name,
      position: member.position,
      role: member.role,
      phone: member.phone,
      mobile: member.mobile,
      email: member.email
    })
  }

  // 구성원 저장 처리
  const handleSaveMember = async () => {
    if (!editingMember) return
    
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

  // 편집 취소
  const handleCancelEdit = () => {
    setEditingMember(null)
    setEditForm({})
  }

  // 기관 저장 처리
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
        
        if (result.success) {
          // 성공 시 해당 연차의 기관만 다시 가져오기
          if (projectType === "multi") {
            await fetchConsortiumOrganizations(project.id, selectedYear)
          } else {
            await fetchConsortiumOrganizations(project.id, 1)
          }
          
          // 부모 컴포넌트에 변경사항 알림
          if (onConsortiumChangeRef.current) {
            if (projectType === "multi") {
              const currentOrgs = getCurrentYearOrganizations()
              onConsortiumChangeRef.current({
                projectType,
                projectDuration,
                organizations: currentOrgs,
                yearlyOrganizations: { ...yearlyOrganizations, [selectedYear]: currentOrgs }
              })
            } else {
              onConsortiumChangeRef.current({
                projectType,
                projectDuration,
                organizations: organizations
              })
            }
          }
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
        
        // 부모 컴포넌트에 변경사항 알림
        if (onConsortiumChangeRef.current) {
          if (projectType === "multi") {
            const currentOrgs = getCurrentYearOrganizations()
            onConsortiumChangeRef.current({
              projectType,
              projectDuration,
              organizations: currentOrgs,
              yearlyOrganizations: { ...yearlyOrganizations, [selectedYear]: currentOrgs }
            })
          } else {
            onConsortiumChangeRef.current({
              projectType,
              projectDuration,
              organizations: organizations
            })
          }
        }
      }
      
      setEditingOrg(null)
    } catch (error) {
      console.error('기관 저장 실패:', error)
      // 실패 시에도 편집 모드 종료
      setEditingOrg(null)
    }
  }

  // 기관명 변경 처리
  const handleOrgNameChange = async (orgId: string, name: string) => {
    if (orgId.startsWith('temp-')) {
      // 임시 기관인 경우 상태만 업데이트
      if (projectType === "multi") {
        const currentOrgs = getCurrentYearOrganizations()
        const updatedOrgs = currentOrgs.map(org => 
          org.id === orgId ? { ...org, name } : org
        )
        setYearOrganizations(selectedYear, updatedOrgs)
      } else {
        setOrganizations(prev => prev.map(org => 
          org.id === orgId ? { ...org, name } : org
        ))
      }
    } else {
      // 실제 기관인 경우 API 호출
      const result = await updateConsortiumOrganization(orgId, {
        organizationName: name
      })
      if (!result.success) {
        alert(result.error || '기관명 수정 중 오류가 발생했습니다.')
      }
    }
  }

  // 기관 유형 변경 처리
  const handleOrgTypeChange = async (orgId: string, type: string) => {
    if (orgId.startsWith('temp-')) {
      // 임시 기관인 경우 상태만 업데이트
      if (projectType === "multi") {
        const currentOrgs = getCurrentYearOrganizations()
        const updatedOrgs = currentOrgs.map(org => 
          org.id === orgId ? { ...org, type } : org
        )
        setYearOrganizations(selectedYear, updatedOrgs)
      } else {
        setOrganizations(prev => prev.map(org => 
          org.id === orgId ? { ...org, type } : org
        ))
      }
    } else {
      // 실제 기관인 경우 API 호출
      const result = await updateConsortiumOrganization(orgId, {
        organizationType: type === '주관' ? '주관기관' : 
                         type === '참여' ? '참여기관' : 
                         type === '공동' ? '공동연구개발기관' : '수요기업'
      })
      if (!result.success) {
        alert(result.error || '기관 유형 수정 중 오류가 발생했습니다.')
      }
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
      Object.keys(yearlyOrganizations).forEach(yearStr => {
        const year = parseInt(yearStr)
        const yearOrgs = yearlyOrganizations[year]
        if (yearOrgs && yearOrgs.length > 0) {
          yearlyOrgsWithYears![year] = yearOrgs.filter(org => !org.isNew)
        }
      })
    }
    
    onConsortiumChangeRef.current({
      projectType,
      projectDuration,
      organizations: allOrganizations,
      yearlyOrganizations: yearlyOrgsWithYears
    })
  }, [projectType, projectDuration, organizations, yearlyOrganizations, onConsortiumChange])

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      if (project?.id) {
        if (projectType === "multi") {
          await fetchConsortiumOrganizations(project.id, selectedYear)
        } else {
          await fetchConsortiumOrganizations(project.id, 1)
          await fetchConsortiumMembers(project.id, 1)
        }
      }
    }
    
    loadInitialData()
  }, [project?.id, projectType, selectedYear])

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

      {/* 사업 정보 */}
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">연차별 관리</label>
                {selectedYear === 1 && (
                  <Button
                    onClick={copyConsortiumToOtherYears}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    {loading ? '복사 중...' : '1차년도 → 전체 연차 복사'}
                  </Button>
                )}
              </div>
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
                        <SelectTrigger className="w-24 h-8 border-0 bg-transparent p-0">
                          <SelectValue />
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="주관" className="bg-white hover:bg-gray-50">
                            주관
                          </SelectItem>
                          <SelectItem value="참여" className="bg-white hover:bg-gray-50">
                            참여
                          </SelectItem>
                          <SelectItem value="공동" className="bg-white hover:bg-gray-50">
                            공동
                          </SelectItem>
                          <SelectItem value="수요" className="bg-white hover:bg-gray-50">
                            수요
                          </SelectItem>
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
                      <div key={member.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="min-w-0">
                              <div className="text-xs text-gray-600 mb-1 font-medium">이름</div>
                              {editingMember === member.id ? (
                                <Input
                                  value={editForm.name || ""}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="h-8 text-sm border-blue-200 focus:border-blue-400"
                                  placeholder="이름을 입력하세요"
                                />
                              ) : (
                                <div className="font-semibold truncate h-8 flex items-center text-sm text-gray-800">{member.name}</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs text-gray-600 mb-1 font-medium">직급</div>
                              {editingMember === member.id ? (
                                <Input
                                  value={editForm.position || ""}
                                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                  className="h-8 text-sm border-blue-200 focus:border-blue-400"
                                  placeholder="직급을 입력하세요"
                                />
                              ) : (
                                <div className="font-semibold truncate h-8 flex items-center text-sm text-gray-800">{member.position}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white border-blue-200 text-blue-700 flex-shrink-0">{member.role}</Badge>
                            <div className="flex items-center gap-1 min-w-0">
                              <Phone className="h-3 w-3 text-blue-500 flex-shrink-0" />
                              <span className="truncate text-gray-700">{member.phone}</span>
                            </div>
                            <span className="text-gray-600 flex-shrink-0">|</span>
                            <div className="flex items-center gap-1 min-w-0">
                              <Smartphone className="h-3 w-3 text-blue-500 flex-shrink-0" />
                              <span className="truncate text-gray-700">{member.mobile}</span>
                            </div>
                            <span className="text-gray-600 flex-shrink-0">|</span>
                            <div className="flex items-center gap-1 min-w-0">
                              <Mail className="h-3 w-3 text-blue-500 flex-shrink-0" />
                              <span className="truncate text-gray-700">{member.email}</span>
                            </div>
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