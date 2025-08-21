"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ChevronDown, Edit2, Check, X, ChevronUp, ChevronDown as ChevronDownIcon, Save, Copy } from "lucide-react"
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
  roleDescription?: string
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
    return `${prefix}_${timestamp}_${random}_${counter}`
  }, [idCounter])

  // 프로젝트 데이터를 기반으로 사업 유형과 기간 계산
  const calculateProjectTypeAndDuration = () => {
    if (!project?.start_date || !project?.end_date) {
      console.log('프로젝트 날짜 정보 없음, 기본값 사용:', { type: "multi", duration: 2 });
      return { type: "multi" as const, duration: 2 }
    }

    const startDate = new Date(project.start_date)
    const endDate = new Date(project.end_date)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365))

    const result = {
      type: diffYears <= 1 ? "single" as const : "multi" as const,
      duration: Math.max(1, Math.min(5, diffYears))
    };

    console.log('프로젝트 타입 및 기간 계산:', {
      startDate: project.start_date,
      endDate: project.end_date,
      diffYears,
      calculatedType: result.type,
      calculatedDuration: result.duration
    });

    return result;
  }

  const { type: calculatedType, duration: calculatedDuration } = calculateProjectTypeAndDuration()
  
  const [projectType, setProjectType] = useState<"single" | "multi">(calculatedType)
  const [projectDuration, setProjectDuration] = useState<number>(calculatedDuration)
  const [selectedYear, setSelectedYear] = useState<number>(1) // 현재 선택된 연차

  // 연차별 기관 데이터 관리
  const [yearlyOrganizations, setYearlyOrganizations] = useState<{ [key: number]: Organization[] }>({})

  // 컴포넌트 마운트 시 2~5차년도 데이터 자동 정리 (프론트엔드만)
  useEffect(() => {
    if (projectType === "multi" && projectDuration > 1) {
      console.log('프론트엔드 2~5차년도 데이터 자동 정리 시작');
      
      setYearlyOrganizations(prev => {
        const newState = { ...prev };
        // 1차년도만 남기고 2~5차년도 모두 제거
        Object.keys(newState).forEach(yearStr => {
          const year = parseInt(yearStr);
          if (year > 1) {
            console.log(`${year}차년도 데이터 제거`);
            delete newState[year];
          }
        });
        return newState;
      });
      
      console.log('프론트엔드 2~5차년도 데이터 자동 정리 완료');
    }
  }, [projectType, projectDuration]);

  // 추가로 3차년도 데이터 정리
  useEffect(() => {
    if (projectType === "multi" && projectDuration >= 3) {
      console.log('프론트엔드 3차년도 데이터 추가 정리');
      setYearlyOrganizations(prev => {
        const newState = { ...prev };
        if (newState[3]) {
          console.log('3차년도 데이터 제거');
          delete newState[3];
        }
        return newState;
      });
    }
  }, [projectType, projectDuration]);

  // 추가로 4차년도 데이터 정리
  useEffect(() => {
    if (projectType === "multi" && projectDuration >= 4) {
      console.log('프론트엔드 4차년도 데이터 추가 정리');
      setYearlyOrganizations(prev => {
        const newState = { ...prev };
        if (newState[4]) {
          console.log('4차년도 데이터 제거');
          delete newState[4];
        }
        return newState;
      });
    }
  }, [projectType, projectDuration]);

  // 추가로 5차년도 데이터 정리
  useEffect(() => {
    if (projectType === "multi" && projectDuration >= 5) {
      console.log('프론트엔드 5차년도 데이터 추가 정리');
      setYearlyOrganizations(prev => {
        const newState = { ...prev };
        if (newState[5]) {
          console.log('5차년도 데이터 제거');
          delete newState[5];
        }
        return newState;
      });
    }
  }, [projectType, projectDuration]);

  // 현재 선택된 연차의 기관들 가져오기
  const getCurrentYearOrganizations = () => {
    return yearlyOrganizations[selectedYear] || []
  }

  // 중복 제거 유틸리티 함수
  const deduplicateOrganizations = (orgs: Organization[]): Organization[] => {
    const seen = new Set<string>()
    return orgs.filter(org => {
      if (seen.has(org.id)) {
        return false
      }
      seen.add(org.id)
      return true
    })
  }

  // 구성원 ID 유효성 검사 및 수정 함수
  const ensureValidMemberIds = (members: Member[]): Member[] => {
    return members.map((member, index) => {
      if (!member.id || member.id === 'null' || member.id === 'undefined') {
        return {
          ...member,
          id: generateUniqueId('member')
        }
      }
      return member
    })
  }

  // 주관기관을 맨 위로 정렬하는 함수
  const sortOrganizationsByPriority = (orgs: Organization[]) => {
    return [...orgs].sort((a, b) => {
      // 주관기관이 항상 맨 위에 오도록 정렬
      if (a.type === '주관' && b.type !== '주관') return -1;
      if (a.type !== '주관' && b.type === '주관') return 1;
      
      // 공동연구개발기관이 참여기관과 수요기업보다 위에 오도록 정렬
      if (a.type === '공동' && (b.type === '참여' || b.type === '수요')) return -1;
      if ((a.type === '참여' || a.type === '수요') && b.type === '공동') return 1;
      
      // 같은 타입 내에서는 기존 순서 유지 (isNew가 false인 것들이 위에)
      if (a.isNew !== b.isNew) {
        return a.isNew ? 1 : -1;
      }
      
      // 기존 순서 유지
      return 0;
    });
  };

  // 기관 순서를 위로 이동
  const moveOrganizationUp = (orgId: string) => {
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations();
      const orgIndex = currentOrgs.findIndex(org => org.id === orgId);
      
      // 이미 맨 위에 있으면 이동 불가
      if (orgIndex <= 0) {
        return;
      }
      
      // 주관기관은 이동 불가
      if (currentOrgs[orgIndex].type === '주관') {
        return;
      }
      
      // 위에 주관기관이 있으면 이동 불가
      if (orgIndex > 0 && currentOrgs[orgIndex - 1].type === '주관') {
        return;
      }
      
      // 참여기관이 공동연구개발기관 위로 이동하려고 할 때만 제한
      if (currentOrgs[orgIndex].type === '참여' && 
          orgIndex > 0 && currentOrgs[orgIndex - 1].type === '공동') {
        return;
      }
      
      const newOrgs = [...currentOrgs];
      [newOrgs[orgIndex - 1], newOrgs[orgIndex]] = [newOrgs[orgIndex], newOrgs[orgIndex - 1]];
      setYearOrganizations(selectedYear, newOrgs);
    } else {
      const orgIndex = organizations.findIndex(org => org.id === orgId);
      
      // 주관기관이거나 이미 맨 위에 있거나, 위에 주관기관이 있으면 이동 불가
      if (orgIndex <= 0 || organizations[orgIndex].type === '주관' || 
          (orgIndex > 0 && organizations[orgIndex - 1].type === '주관')) {
        return;
      }
      
      // 참여기관이 공동연구개발기관 위로 이동하려고 할 때 제한
      if (organizations[orgIndex].type === '참여' && 
          orgIndex > 0 && organizations[orgIndex - 1].type === '공동') {
        return;
      }
      
      const newOrgs = [...organizations];
      [newOrgs[orgIndex - 1], newOrgs[orgIndex]] = [newOrgs[orgIndex], newOrgs[orgIndex - 1]];
      setOrganizations(newOrgs);
    }
  };

  // 기관 순서를 아래로 이동
  const moveOrganizationDown = (orgId: string) => {
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations();
      const orgIndex = currentOrgs.findIndex(org => org.id === orgId);
      
      // 이미 맨 아래에 있으면 이동 불가
      if (orgIndex >= currentOrgs.length - 1) {
        return;
      }
      
      // 공동연구개발기관이 참여기관 아래로 이동하려고 할 때만 제한
      if (currentOrgs[orgIndex].type === '공동' && 
          orgIndex < currentOrgs.length - 1 && currentOrgs[orgIndex + 1].type === '참여') {
        return;
      }
      
      // 주관기관은 이동 불가
      if (currentOrgs[orgIndex].type === '주관') {
        return;
      }
      
      const newOrgs = [...currentOrgs];
      [newOrgs[orgIndex], newOrgs[orgIndex + 1]] = [newOrgs[orgIndex + 1], newOrgs[orgIndex]];
      setYearOrganizations(selectedYear, newOrgs);
    } else {
      const orgIndex = organizations.findIndex(org => org.id === orgId);
      
      // 이미 맨 아래에 있으면 이동 불가
      if (orgIndex >= organizations.length - 1) {
        return;
      }
      
      // 공동연구개발기관이 참여기관 아래로 이동하려고 할 때 제한
      if (organizations[orgIndex].type === '공동' && 
          orgIndex < organizations.length - 1 && organizations[orgIndex + 1].type === '참여') {
        return;
      }
      
      const newOrgs = [...organizations];
      [newOrgs[orgIndex], newOrgs[orgIndex + 1]] = [newOrgs[orgIndex + 1], newOrgs[orgIndex]];
      setOrganizations(newOrgs);
    }
  };

  // 연차별 기관 설정
  const setYearOrganizations = (year: number, orgs: Organization[]) => {
    // 중복 제거 후 주관기관 → 공동연구기관 → 참여기관 → 수요기업 순서로 정렬하되, 같은 타입 내에서는 기존 순서 유지
    const deduplicatedOrgs = deduplicateOrganizations(orgs)
    
    // 모든 기관의 구성원 ID 유효성 검사 및 수정
    const validatedOrgs = deduplicatedOrgs.map(org => ({
      ...org,
      members: ensureValidMemberIds(org.members || [])
    }))
    
    const sortedOrgs = sortOrganizationsByPriority(validatedOrgs);
    setYearlyOrganizations(prev => ({
      ...prev,
      [year]: sortedOrgs
    }))
  }

  // organizations 상태 설정 시 중복 제거를 포함하는 래퍼 함수
  const setOrganizationsWithDeduplication = (orgs: Organization[] | ((prev: Organization[]) => Organization[])) => {
    if (typeof orgs === 'function') {
      setOrganizations(prev => {
        const newOrgs = orgs(prev)
        const deduplicatedOrgs = deduplicateOrganizations(newOrgs)
        
        // 모든 기관의 구성원 ID 유효성 검사 및 수정
        const validatedOrgs = deduplicatedOrgs.map(org => ({
          ...org,
          members: ensureValidMemberIds(org.members || [])
        }))
        
        return validatedOrgs
      })
    } else {
      const deduplicatedOrgs = deduplicateOrganizations(orgs)
      
      // 모든 기관의 구성원 ID 유효성 검사 및 수정
      const validatedOrgs = deduplicatedOrgs.map(org => ({
        ...org,
        members: ensureValidMemberIds(org.members || [])
      }))
      
      setOrganizations(validatedOrgs)
    }
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
              org.organization_type === '공동' ? '공동' : '수요',
        roleDescription: org.role_description || org.roleDescription || '',
        members: [], // 구성원은 별도 API로 가져와야 함
        isNew: false
      }))
    }
    return []
  })

  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [editingOrgs, setEditingOrgs] = useState<string[]>([])
  const [editForm, setEditForm] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [addingOrganization, setAddingOrganization] = useState(false)
  const [lastAddTime, setLastAddTime] = useState(0)
  const [lastSaveTime, setLastSaveTime] = useState(0)

  // 컨소시엄 기관 저장 함수
  const handleSaveConsortium = async () => {
    if (!project?.id) {
      alert('프로젝트 정보가 없습니다.')
      return
    }

    // 이미 저장 중이면 중복 실행 방지
    if (loading) {
      console.log('저장이 이미 진행 중입니다.')
      return
    }

    // 연속 저장 방지 (2초 내에 다시 저장하면 무시)
    const now = Date.now()
    if (now - lastSaveTime < 2000) {
      console.log('너무 빠른 연속 저장입니다. 잠시 기다려주세요.')
      return
    }
    setLastSaveTime(now)

    try {
      setLoading(true)
      console.log('컨소시엄 저장 시작:', { projectId: project.id, year: selectedYear })
      
      // 현재 연차의 기관 데이터 가져오기
      const currentOrgs = getCurrentYearOrganizations()
      
      // 저장할 기관들만 필터링 (isNew가 false인 것들만)
      const orgsToSave = currentOrgs.filter(org => !org.isNew)
      
      if (orgsToSave.length === 0) {
        alert('저장할 기관이 없습니다.')
        return
      }
      
      console.log('저장할 기관들:', orgsToSave)
      
      // 연구자 데이터 백업 (기관 삭제 전에 보존)
      const researcherDataBackup = new Map<string, any[]>()
      for (const org of currentOrgs) {
        if (org.members && org.members.length > 0) {
          // 연구자 데이터의 유효성 검사 및 정리
          const validMembers = org.members.filter(member => 
            member && 
            member.name && 
            member.name.trim() !== '' &&
            (member.position || member.role || member.phone || member.mobile || member.email)
          )
          
          if (validMembers.length > 0) {
            researcherDataBackup.set(org.name, validMembers.map(member => ({
              name: member.name.trim(),
              position: member.position || '',
              role: member.role || '',
              phone: member.phone || '',
              mobile: member.mobile || '',
              email: member.email || ''
            })))
            console.log(`연구자 데이터 백업: ${org.name} - ${validMembers.length}명`)
          }
        }
      }
      
      console.log('백업된 연구자 데이터:', Object.fromEntries(researcherDataBackup))
      
      // 사용자가 정한 순서 그대로 저장 (주관, 참여, 수요, 공동 구분도 사용자가 정한 대로)
      // 기존 기관들을 모두 삭제한 후 새로운 순서로 다시 생성
      
      // 1. 기존 기관들을 모두 삭제
      console.log('기존 기관 삭제 시작')
      for (const org of currentOrgs) {
        if (org.id && !org.id.startsWith('org_')) { // 임시 ID가 아닌 경우만 삭제
          console.log('기관 삭제:', org.id, org.name)
          await apiFetch(`/api/project-consortium-organizations?id=${org.id}`, {
            method: 'DELETE'
          })
        }
      }
      
      // 2. 새로운 순서로 기관들을 다시 생성
      console.log('새 기관 생성 시작')
      const createdOrgs = []
      const createdNames = new Set() // 중복 이름 방지
      
      for (let i = 0; i < orgsToSave.length; i++) {
        const org = orgsToSave[i]
        
        // 중복 이름 체크
        if (createdNames.has(org.name)) {
          console.warn('중복된 기관명이 감지되었습니다:', org.name)
          continue
        }
        
        console.log('기관 생성:', org.name, org.type)
        
        const response = await apiFetch('/api/project-consortium-organizations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectPlanningId: project.id,
            year: selectedYear,
            organizationType: org.type === '주관' ? '주관기관' : 
                             org.type === '참여' ? '참여기관' : 
                             org.type === '공동' ? '공동연구개발기관' : '수요기업',
            organizationName: org.name,
            roleDescription: org.roleDescription || ''
          })
        })
        
        const result = await response.json()
        if (result.success) {
          createdOrgs.push(result.data)
          createdNames.add(org.name)
        } else {
          throw new Error(`기관 생성 실패: ${result.error || '알 수 없는 오류'}`)
        }
      }
      
      console.log('생성된 기관들:', createdOrgs)
      
      // 4. 연구자 데이터 복원 및 저장
      console.log('연구자 데이터 복원 시작')
      const restoredMembersCount = { success: 0, failed: 0 }
      
      for (const createdOrg of createdOrgs) {
        const orgName = createdOrg.organization_name || createdOrg.name
        const backupMembers = researcherDataBackup.get(orgName)
        
        if (backupMembers && backupMembers.length > 0) {
          console.log(`연구자 데이터 복원: ${orgName} - ${backupMembers.length}명`)
          
          // 각 연구자를 데이터베이스에 저장
          for (const member of backupMembers) {
            try {
              const memberResponse = await apiFetch('/api/project-consortium-members', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  organizationId: createdOrg.id,
                  projectPlanningId: project.id,
                  year: selectedYear,
                  memberName: member.name,
                  position: member.position,
                  role: member.role,
                  phone: member.phone,
                  mobile: member.mobile,
                  email: member.email
                })
              })
              
              const memberResult = await memberResponse.json()
              if (memberResult.success) {
                console.log(`연구자 저장 성공: ${member.name}`)
                restoredMembersCount.success++
              } else {
                console.warn(`연구자 저장 실패: ${member.name} - ${memberResult.error}`)
                restoredMembersCount.failed++
              }
            } catch (error) {
              console.error(`연구자 저장 중 오류: ${member.name}`, error)
              restoredMembersCount.failed++
            }
          }
        }
      }
      
      console.log('연구자 데이터 복원 완료:', restoredMembersCount)
      
      // 5. 성공 응답 생성
      const result = { success: true }
      
      if (result.success) {
        // 연구자 데이터 복원 결과를 포함한 성공 메시지
        const totalMembers = restoredMembersCount.success + restoredMembersCount.failed
        let successMessage = '컨소시엄 기관 순서가 저장되었습니다!'
        
        if (totalMembers > 0) {
          successMessage += `\n\n연구자 데이터 복원 결과:`
          successMessage += `\n- 성공: ${restoredMembersCount.success}명`
          if (restoredMembersCount.failed > 0) {
            successMessage += `\n- 실패: ${restoredMembersCount.failed}명 (잠시 후 다시 시도해주세요)`
          }
        }
        
        alert(successMessage)
        
        // 저장된 기관들로 상태 업데이트 (isNew 제거, 연구자 데이터 포함)
        const savedOrgs = orgsToSave.map(org => {
          const backupMembers = researcherDataBackup.get(org.name)
          return {
            ...org,
            isNew: false,
            members: backupMembers || []
          }
        })
        
        // 중복 제거 후 상태 설정
        const deduplicatedSavedOrgs = deduplicateOrganizations(savedOrgs)
        
        if (projectType === "multi") {
          setYearOrganizations(selectedYear, deduplicatedSavedOrgs)
        } else {
          setOrganizations(deduplicatedSavedOrgs)
        }
        
        // 편집 모드 해제 (저장 완료 후 입력창 닫기)
        setEditingOrgs([])
        
        // isNew 상태를 가진 기관들을 완전히 제거하여 입력창이 남지 않도록 함
        if (projectType === "multi") {
          const currentYearOrgs = getCurrentYearOrganizations()
          const cleanOrgs = currentYearOrgs.filter(org => !org.isNew)
          if (cleanOrgs.length !== currentYearOrgs.length) {
            setYearOrganizations(selectedYear, cleanOrgs)
          }
        } else {
          const cleanOrgs = organizations.filter(org => !org.isNew)
          if (cleanOrgs.length !== organizations.length) {
            setOrganizations(cleanOrgs)
          }
        }
        
        // 부모 컴포넌트에 변경사항 알림
        if (onConsortiumChangeRef.current) {
          onConsortiumChangeRef.current({
            projectType,
            projectDuration,
            organizations: deduplicatedSavedOrgs,
            yearlyOrganizations: projectType === "multi" ? { ...yearlyOrganizations, [selectedYear]: deduplicatedSavedOrgs } : undefined
          })
        }
        
        // 저장 완료 후 데이터 새로고침 (즉시 실행하여 상태 동기화)
        await fetchConsortiumOrganizations(project.id, selectedYear)
        
        // 연구자 데이터가 제대로 로드되었는지 확인
        setTimeout(async () => {
          console.log('연구자 데이터 최종 확인 및 새로고침')
          await fetchConsortiumOrganizations(project.id, selectedYear)
        }, 500)
      } else {
        throw new Error('저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('컨소시엄 기관 저장 오류:', error)
      alert(`저장에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setLoading(false)
    }
  }

  // 연차별 컨소시엄 데이터 자동 복사 함수
  const copyConsortiumToOtherYears = async () => {
    if (!project?.id || projectType !== "multi") {
      alert('복사할 수 있는 조건이 아닙니다.');
      return;
    }
    
    try {
      setLoading(true);
      console.log('복사 시작');
      
      // 1. 1차년도 데이터 확인 (로컬 상태에서)
      const sourceYearData = yearlyOrganizations[1] || [];
      console.log('1차년도 로컬 데이터:', sourceYearData);
      
      // 저장된 기관만 필터링 (isNew: false인 것들)
      const savedOrganizations = sourceYearData.filter(org => !org.isNew);
      
      if (savedOrganizations.length === 0) {
        alert('1차년도에 복사할 기관 데이터가 없습니다. 먼저 1차년도에 기관을 등록하고 저장해주세요.');
        return;
      }
      
      console.log('복사할 저장된 기관들:', savedOrganizations);
      
      // 2. 복사할 대상 연차 (2,3,4,5차년도)
      const targetYears = [2, 3, 4, 5].filter(year => year <= projectDuration);
      if (targetYears.length === 0) {
        alert('복사할 대상 연차가 없습니다.');
        return;
      }
      
      console.log('복사 대상 연차:', targetYears);
      
      // 3. 각 대상 연차에 복사
      for (const targetYear of targetYears) {
        console.log(`${targetYear}차년도 복사 시작`);
        
        // 3-1. 해당 연차의 기존 기관들 삭제
        const existingResponse = await apiFetch(`/api/project-consortium-organizations?projectPlanningId=${project.id}&year=${targetYear}`);
        const existingResult = await existingResponse.json();
        
        if (existingResult.success && existingResult.data) {
          for (const existingOrg of existingResult.data) {
            try {
              await apiFetch(`/api/project-consortium-organizations?id=${existingOrg.id}`, {
                method: 'DELETE'
              });
              console.log(`${targetYear}차년도 기존 기관 삭제: ${existingOrg.organization_name}`);
            } catch (error) {
              console.warn(`기존 기관 삭제 실패: ${existingOrg.organization_name}`, error);
            }
          }
        }
        
        // 3-2. 1차년도 기관들을 대상 연차에 복사
        for (const sourceOrg of savedOrganizations) {
          try {
            // 기관 생성
            const orgResponse = await apiFetch('/api/project-consortium-organizations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                projectPlanningId: project.id,
                year: targetYear,
                organizationType: sourceOrg.type === '주관' ? '주관기관' : 
                                 sourceOrg.type === '참여' ? '참여기관' : 
                                 sourceOrg.type === '공동' ? '공동연구개발기관' : '수요기업',
                organizationName: sourceOrg.name,
                roleDescription: sourceOrg.roleDescription || ''
              })
            });
            
            const orgResult = await orgResponse.json();
            if (!orgResult.success) {
              throw new Error(`기관 생성 실패: ${orgResult.error}`);
            }
            
            const newOrgId = orgResult.data.id;
            console.log(`${targetYear}차년도 기관 복사 성공: ${sourceOrg.name}`);
            
            // 3-3. 해당 기관의 연구자들 복사
            if (sourceOrg.members && sourceOrg.members.length > 0) {
              console.log(`${sourceOrg.name} 기관의 연구자 ${sourceOrg.members.length}명 복사`);
              
              for (const member of sourceOrg.members) {
                try {
                  await apiFetch('/api/project-consortium-members', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      organizationId: newOrgId,
                      projectPlanningId: project.id,
                      year: targetYear,
                      memberName: member.name,
                      position: member.position,
                      role: member.role,
                      phone: member.phone,
                      mobile: member.mobile,
                      email: member.email
                    })
                  });
                  console.log(`연구자 복사 성공: ${member.name}`);
                } catch (error) {
                  console.warn(`연구자 복사 실패: ${member.name}`, error);
                }
              }
            } else {
              console.log(`${sourceOrg.name} 기관에는 등록된 연구자가 없습니다.`);
            }
            
          } catch (error) {
            console.error(`기관 복사 실패: ${sourceOrg.name}`, error);
            throw error;
          }
        }
        
        console.log(`${targetYear}차년도 복사 완료`);
      }
      
      // 4. 복사 완료 후 모든 연차 데이터 새로고침
      console.log('모든 연차 데이터 새로고침');
      await fetchConsortiumOrganizations(project.id, 1);
      for (const year of targetYears) {
        await fetchConsortiumOrganizations(project.id, year);
      }
      
      // 5. 성공 메시지
      alert(`✅ 복사가 완료되었습니다!\n\n📊 복사 결과:\n- 대상 연차: ${targetYears.join(', ')}차년도\n- 복사된 기관: ${savedOrganizations.length}개\n- 모든 연구자 정보가 포함되어 복사되었습니다.`);
      
      // 6. 복사된 연차로 이동하여 결과 확인
      if (targetYears.length > 0) {
        const confirmMove = confirm(`복사된 연차들로 이동하여 결과를 확인하시겠습니까?\n\n${targetYears.join(', ')}차년도`);
        if (confirmMove) {
          setSelectedYear(targetYears[0]);
          await fetchConsortiumOrganizations(project.id, targetYears[0]);
        }
      }
      
    } catch (error) {
      console.error('복사 중 오류:', error);
      alert(`❌ 복사 중 오류가 발생했습니다:\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  }

  // 2,3,4,5차년도 컨소시엄 정보 일괄 삭제 함수
  const deleteAllOtherYearsConsortium = async () => {
    if (!project?.id || projectType !== "multi") {
      alert('삭제할 수 있는 조건이 아닙니다.');
      return;
    }
    
    // 삭제 확인
    const targetYears = [2, 3, 4, 5].filter(year => year <= projectDuration);
    if (targetYears.length === 0) {
      alert('삭제할 대상 연차가 없습니다.');
      return;
    }
    
    const confirmDelete = confirm(
      `⚠️ 주의: 이 작업은 되돌릴 수 없습니다!\n\n` +
      `다음 연차의 모든 컨소시엄 정보를 삭제하시겠습니까?\n\n` +
      `삭제 대상: ${targetYears.join(', ')}차년도\n` +
      `삭제 내용: 기관 정보 및 모든 연구자 정보\n\n` +
      `계속하시려면 '확인'을 클릭하세요.`
    );
    
    if (!confirmDelete) {
      return;
    }
    
    try {
      setLoading(true);
      console.log('일괄 삭제 시작');
      
      let totalDeletedOrgs = 0;
      let totalDeletedMembers = 0;
      let failedDeletions = [];
      
      // 각 대상 연차의 데이터 삭제
      for (const targetYear of targetYears) {
        console.log(`${targetYear}차년도 데이터 삭제 시작`);
        
        try {
          // 1. 해당 연차의 기관들 조회
          const orgsResponse = await apiFetch(`/api/project-consortium-organizations?projectPlanningId=${project.id}&year=${targetYear}`);
          
          // API 응답 상태 확인
          if (!orgsResponse.ok) {
            console.error(`${targetYear}차년도 데이터 조회 실패: HTTP ${orgsResponse.status}`);
            failedDeletions.push(`${targetYear}차년도: API 조회 실패 (HTTP ${orgsResponse.status})`);
            continue; // 다음 연차로 진행
          }
          
          const orgsResult = await orgsResponse.json();
          
          if (orgsResult.success && orgsResult.data && orgsResult.data.length > 0) {
            console.log(`${targetYear}차년도 기관 ${orgsResult.data.length}개 발견`);
            
            for (const org of orgsResult.data) {
              try {
                const orgName = org.organization_name || org.name || '알 수 없는 기관';
                console.log(`기관 삭제 시작: ${orgName} (ID: ${org.id})`);
                
                // 2. 해당 기관의 연구자들 먼저 삭제
                const membersResponse = await apiFetch(`/api/project-consortium-members?organizationId=${org.id}`);
                
                if (!membersResponse.ok) {
                  console.error(`연구자 조회 실패: HTTP ${membersResponse.status}`);
                  failedDeletions.push(`연구자 조회 실패 (${orgName})`);
                  continue; // 다음 기관으로 진행
                }
                
                const membersResult = await membersResponse.json();
                
                if (membersResult.success && membersResult.data && membersResult.data.length > 0) {
                  console.log(`${orgName} 기관의 연구자 ${membersResult.data.length}명 삭제 시작`);
                  
                  for (const member of membersResult.data) {
                    try {
                      const memberName = member.member_name || member.name || '알 수 없는 연구자';
                      console.log(`연구자 삭제: ${memberName} (ID: ${member.id})`);
                      
                      const deleteMemberResponse = await apiFetch(`/api/project-consortium-members?id=${member.id}`, {
                        method: 'DELETE'
                      });
                      
                      if (deleteMemberResponse.ok) {
                        totalDeletedMembers++;
                        console.log(`✅ 연구자 삭제 성공: ${memberName}`);
                      } else {
                        const errorResult = await deleteMemberResponse.json().catch(() => ({}));
                        throw new Error(`API 응답 오류: ${deleteMemberResponse.status} - ${errorResult.error || '알 수 없는 오류'}`);
                      }
                      
                    } catch (error) {
                      console.error(`❌ 연구자 삭제 실패: ${member.member_name || member.name}`, error);
                      failedDeletions.push(`연구자 ${member.member_name || member.name} (${targetYear}차년도)`);
                    }
                  }
                } else {
                  console.log(`${orgName} 기관에는 등록된 연구자가 없습니다.`);
                }
                
                // 3. 기관 삭제
                console.log(`기관 삭제: ${orgName} (ID: ${org.id})`);
                const deleteOrgResponse = await apiFetch(`/api/project-consortium-organizations?id=${org.id}`, {
                  method: 'DELETE'
                });
                
                if (deleteOrgResponse.ok) {
                  totalDeletedOrgs++;
                  console.log(`✅ 기관 삭제 성공: ${orgName}`);
                } else {
                  const errorResult = await deleteOrgResponse.json().catch(() => ({}));
                  throw new Error(`API 응답 오류: ${deleteOrgResponse.status} - ${errorResult.error || '알 수 없는 오류'}`);
                }
                
              } catch (error) {
                console.error(`❌ 기관 삭제 실패: ${org.organization_name || org.name}`, error);
                failedDeletions.push(`기관 ${org.organization_name || org.name} (${targetYear}차년도)`);
              }
            }
          } else if (orgsResult.success && (!orgsResult.data || orgsResult.data.length === 0)) {
            console.log(`${targetYear}차년도에는 삭제할 데이터가 없습니다.`);
          } else {
            console.error(`${targetYear}차년도 API 응답 오류:`, orgsResult);
            failedDeletions.push(`${targetYear}차년도: API 응답 오류`);
          }
          
        } catch (error) {
          console.error(`${targetYear}차년도 처리 중 오류:`, error);
          failedDeletions.push(`${targetYear}차년도 전체: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
      }
      
      // 4. 삭제 완료 후 실제로 데이터가 삭제되었는지 확인
      console.log('삭제 결과 검증 시작');
      let verificationResults = [];
      
      for (const targetYear of targetYears) {
        try {
          const verifyResponse = await apiFetch(`/api/project-consortium-organizations?projectPlanningId=${project.id}&year=${targetYear}`);
          
          // API 응답 상태 확인
          if (!verifyResponse.ok) {
            console.error(`${targetYear}차년도 검증 실패: HTTP ${verifyResponse.status}`);
            verificationResults.push(`${targetYear}차년도: 검증 실패 (HTTP ${verifyResponse.status})`);
            continue;
          }
          
          const verifyResult = await verifyResponse.json();
          
          if (verifyResult.success && verifyResult.data && verifyResult.data.length > 0) {
            const remainingOrgs = verifyResult.data.length;
            console.warn(`⚠️ ${targetYear}차년도에 여전히 ${remainingOrgs}개 기관이 남아있음`);
            verificationResults.push(`${targetYear}차년도: ${remainingOrgs}개 기관 남음`);
          } else if (verifyResult.success && (!verifyResult.data || verifyResult.data.length === 0)) {
            console.log(`✅ ${targetYear}차년도 데이터 완전 삭제 확인됨`);
            verificationResults.push(`${targetYear}차년도: 삭제 완료`);
          } else {
            console.error(`${targetYear}차년도 검증 응답 오류:`, verifyResult);
            verificationResults.push(`${targetYear}차년도: 검증 응답 오류`);
          }
        } catch (error) {
          console.error(`${targetYear}차년도 검증 중 오류:`, error);
          verificationResults.push(`${targetYear}차년도: 검증 중 오류`);
        }
      }
      
      // 5. 로컬 상태 정리
      setYearlyOrganizations(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(yearStr => {
          const year = parseInt(yearStr);
          if (year > 1) {
            delete newState[year];
          }
        });
        return newState;
      });
      
      // 프론트엔드에서만 2~5차년도 데이터 정리 (API 호출 없이)
      console.log('프론트엔드 로컬 상태 정리 완료');
      
      // 6. 결과 메시지 생성
      let resultMessage = `🗑️ 일괄 삭제 결과:\n\n`;
      resultMessage += `📊 삭제 통계:\n`;
      resultMessage += `- 삭제된 연차: ${targetYears.join(', ')}차년도\n`;
      resultMessage += `- 삭제된 기관: ${totalDeletedOrgs}개\n`;
      resultMessage += `- 삭제된 연구자: ${totalDeletedMembers}명\n\n`;
      
      if (failedDeletions.length > 0) {
        resultMessage += `❌ 삭제 실패 항목:\n${failedDeletions.join('\n')}\n\n`;
      }
      
      resultMessage += `🔍 검증 결과:\n${verificationResults.join('\n')}\n\n`;
      
      // 검증 결과 분석
      const hasApiFailures = verificationResults.some(result => result.includes('검증 실패') || result.includes('검증 응답 오류'));
      const hasRemainingData = verificationResults.some(result => result.includes('남음'));
      const allDeleted = verificationResults.every(result => result.includes('삭제 완료'));
      
      if (hasApiFailures) {
        resultMessage += `⚠️ API 호출 실패로 일부 연차의 검증을 완료할 수 없습니다.\n`;
        resultMessage += `삭제가 실제로 완료되었는지 확인할 수 없습니다.\n\n`;
      }
      
      if (hasRemainingData) {
        resultMessage += `❌ 일부 데이터가 여전히 남아있습니다.\n`;
        resultMessage += `삭제가 완전하지 않았습니다.\n\n`;
      }
      
      if (allDeleted && !hasApiFailures) {
        resultMessage += `✅ 모든 데이터가 성공적으로 삭제되었습니다.`;
      } else if (totalDeletedOrgs > 0 || totalDeletedMembers > 0) {
        resultMessage += `⚠️ 일부 데이터만 삭제되었습니다.\n`;
        resultMessage += `다시 시도하거나 수동으로 확인해주세요.`;
      } else {
        resultMessage += `❌ 삭제된 데이터가 없습니다.\n`;
        resultMessage += `API 호출 실패로 인해 삭제를 시도할 수 없었습니다.`;
      }
      
      // 7. 결과 표시
      alert(resultMessage);
      
      // 8. 1차년도로 이동
      setSelectedYear(1);
      
      // 9. 최종 상태 새로고침
      await fetchConsortiumOrganizations(project.id, 1);
      
    } catch (error) {
      console.error('일괄 삭제 중 오류:', error);
      alert(`❌ 삭제 중 오류가 발생했습니다:\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n일부 데이터만 삭제되었을 수 있습니다.`);
    } finally {
      setLoading(false);
    }
  }

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
          
          // API에서 가져온 구성원의 ID가 없거나 유효하지 않은 경우 고유 ID 생성
          const memberId = member.id && member.id.toString() !== 'null' && member.id.toString() !== 'undefined' 
            ? member.id.toString() 
            : generateUniqueId('member')
          
          acc[orgId].push({
            id: memberId,
            name: member.member_name || '',
            position: member.position || '',
            role: member.role || '',
            phone: member.phone || '',
            mobile: member.mobile || '',
            email: member.email || ''
          })
          return acc
        }, {})
                
        // 올바른 상태에 구성원 추가
        if (projectType === "multi") {
          // 연차별 사업인 경우
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.map(org => ({
            ...org,
            members: ensureValidMemberIds(membersByOrg[org.id] || [])
          }))
          setYearOrganizations(year, updatedOrgs)
        } else {
          // 단년도 사업인 경우
          setOrganizations(prev => prev.map(org => ({
            ...org,
            members: ensureValidMemberIds(membersByOrg[org.id] || [])
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
      
      // 편집 상태 초기화 (데이터 새로고침 시 깨끗한 상태로 시작)
      setEditingOrgs([])
      
      const response = await apiFetch(`/api/project-consortium-organizations?projectId=${projectId}&year=${year}`)
      const result = await response.json()
            
      if (result.success) {
        const newOrganizations = result.data.map((org: any) => ({
          id: org.id.toString(),
          name: org.organization_name,
          type: org.organization_type === '주관기관' ? '주관' : 
                org.organization_type === '참여기관' ? '참여' : 
                org.organization_type === '공동연구개발기관' ? '공동' : '수요',
          roleDescription: org.role_description || org.roleDescription || '',
          members: [], // 구성원은 별도 API로 가져와야 함
          isNew: false
        }))
                
        if (projectType === "multi") {
          // 저장 완료 후에는 isNew가 true인 기관들을 모두 제거 (저장된 기관만 유지)
          const savedOrgs = newOrganizations.filter((org: Organization) => !org.isNew)
          setYearOrganizations(year, savedOrgs)
          // 기관 데이터 설정 후 구성원 데이터 가져오기
          if (savedOrgs.length > 0) {
            // 기관 데이터를 직접 전달하여 구성원 데이터 가져오기
            await fetchConsortiumMembersWithOrgs(projectId, year, savedOrgs)
          }
        } else {
          // 저장 완료 후에는 isNew가 true인 기관들을 모두 제거 (저장된 기관만 유지)
          const savedOrgs = newOrganizations.filter((org: Organization) => !org.isNew)
          setOrganizations(savedOrgs)
          // 기관 데이터 설정 후 구성원 데이터 가져오기
          if (savedOrgs.length > 0) {
            // 기관 데이터를 직접 전달하여 구성원 데이터 가져오기
            await fetchConsortiumMembersWithOrgs(projectId, year, savedOrgs)
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
      console.log(`fetchConsortiumMembersWithOrgs 시작: projectId=${projectId}, year=${year}, orgs=${orgs.length}개`);
      
      const response = await apiFetch(`/api/project-consortium-members?projectId=${projectId}&year=${year}`)
      const result = await response.json()
      
      console.log(`${year}차년도 구성원 데이터 응답:`, result);
            
      if (result.success) {
        // 기관별로 구성원 그룹화
        const membersByOrg = result.data.reduce((acc: any, member: any) => {
          const orgId = member.organization_id.toString()
          if (!acc[orgId]) {
            acc[orgId] = []
          }
          
          // API에서 가져온 구성원의 ID가 없거나 유효하지 않은 경우 고유 ID 생성
          const memberId = member.id && member.id.toString() !== 'null' && member.id.toString() !== 'undefined' 
            ? member.id.toString() 
            : generateUniqueId('member')
          
          acc[orgId].push({
            id: memberId,
            name: member.member_name || '',
            position: member.position || '',
            role: member.role || '',
            phone: member.phone || '',
            mobile: member.mobile || '',
            email: member.email || ''
          })
          return acc
        }, {})
        
        // 구성원 ID 유효성 검사 및 수정
        Object.keys(membersByOrg).forEach(orgId => {
          membersByOrg[orgId] = ensureValidMemberIds(membersByOrg[orgId])
        })
        
        console.log(`${year}차년도 기관별 구성원 그룹화:`, membersByOrg);
                
        // 전달받은 기관 데이터에 구성원 추가
        const updatedOrgs = orgs.map(org => ({
          ...org,
          members: ensureValidMemberIds(membersByOrg[org.id] || [])
        }))
        
        console.log(`${year}차년도 구성원 추가된 기관 데이터:`, updatedOrgs);
        
        // 올바른 상태에 설정 - 새로 추가된 기관들을 맨 아래에 배치
        if (projectType === "multi") {
          // 기존에 새로 추가된 기관(isNew: true)이 있다면 보존
          const currentOrgs = getCurrentYearOrganizations()
          const newOrgs = currentOrgs.filter((org: Organization) => org.isNew)
          
          // 중복 제거: 구성원이 추가된 기관과 새로 추가된 기관의 ID가 겹치지 않도록 함
          const existingIds = new Set(updatedOrgs.map(org => org.id))
          const filteredNewOrgs = newOrgs.filter((org: Organization) => !existingIds.has(org.id))
          
          // API에서 가져온 기관들을 먼저 배치하고, 새로 추가된 기관들을 맨 아래에 배치
          const combinedOrgs = [...updatedOrgs, ...filteredNewOrgs]
          console.log(`${year}차년도 최종 구성원 포함 기관 데이터 설정:`, combinedOrgs);
          setYearOrganizations(year, combinedOrgs)
        } else {
          // 기존에 새로 추가된 기관(isNew: true)이 있다면 보존
          const newOrgs = organizations.filter((org: Organization) => org.isNew)
          
          // 중복 제거: 구성원이 추가된 기관과 새로 추가된 기관의 ID가 겹치지 않도록 함
          const existingIds = new Set(updatedOrgs.map(org => org.id))
          const filteredNewOrgs = newOrgs.filter((org: Organization) => !existingIds.has(org.id))
          
          // API에서 가져온 기관들을 먼저 배치하고, 새로 추가된 기관들을 맨 아래에 배치
          const combinedOrgs = [...updatedOrgs, ...filteredNewOrgs]
          console.log(`${year}차년도 단년도 최종 구성원 포함 기관 데이터 설정:`, combinedOrgs);
          setOrganizations(combinedOrgs)
        }
      } else {
        console.error(`${year}차년도 구성원 데이터 조회 실패:`, result.error);
      }
    } catch (error) {
      console.error(`${year}차년도 컨소시엄 구성원 조회 오류:`, error)
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
                           organizationData.type === '참여' ? '참여기관' : 
                           organizationData.type === '공동' ? '공동연구개발기관' : '수요기업',
          organizationName: organizationData.name,
          roleDescription: organizationData.roleDescription || ''
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
  const deleteConsortiumOrganization = async (orgId: string, retryCount = 0) => {
    try {
      console.log('기관 삭제 시작:', { orgId, projectId: project?.id, year: selectedYear, retryCount })
      
      // 프로젝트 ID 유효성 검사
      if (!project?.id) {
        throw new Error('프로젝트 정보가 유효하지 않습니다.')
      }
      
      // 기관 ID 유효성 검사
      if (!orgId || orgId.startsWith('org_')) {
        throw new Error('삭제할 수 없는 기관입니다.')
      }
      
      // API 호출에 타임아웃 설정 (10초)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.')), 10000)
      })
      
      const apiPromise = apiFetch(`/api/project-consortium-organizations?id=${orgId}`, {
        method: 'DELETE'
      })
      
      let response: Response
      try {
        response = await Promise.race([apiPromise, timeoutPromise])
      } catch (timeoutError) {
        if (timeoutError instanceof Error && timeoutError.message.includes('시간이 초과')) {
          throw new Error('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.')
        }
        throw timeoutError
      }
      
      if (!response.ok) {
        // HTTP 500 에러 등 서버 오류에 대한 더 자세한 처리
        if (response.status >= 500) {
          console.error('서버 오류 발생:', { status: response.status, statusText: response.statusText, retryCount })
          
          // 서버 오류인 경우 최대 2번까지 재시도
          if (retryCount < 2) {
            console.log(`서버 오류로 재시도 중... (${retryCount + 1}/2)`)
            // 1초 대기 후 재시도
            await new Promise(resolve => setTimeout(resolve, 1000))
            return deleteConsortiumOrganization(orgId, retryCount + 1)
          } else {
            throw new Error(`서버 오류가 지속되고 있습니다. (${response.status}) 잠시 후 다시 시도해주세요.`)
          }
        } else if (response.status === 404) {
          throw new Error('요청한 기관을 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.')
        } else if (response.status === 403) {
          throw new Error('삭제 권한이 없습니다. 관리자에게 문의해주세요.')
        } else {
          throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`)
        }
      }
      
      let result
      try {
        result = await response.json()
        console.log('삭제 API 응답:', result)
      } catch (jsonError) {
        console.error('JSON 파싱 오류:', jsonError)
        throw new Error('서버 응답을 처리할 수 없습니다.')
      }
      
      // API 응답 구조 확인 및 에러 처리 개선
      if (result && result.success) {
        // 성공 시 해당 연차의 기관 목록을 다시 가져옴
        console.log('기관 삭제 성공:', orgId)
        await fetchConsortiumOrganizations(project.id, selectedYear)
        return true
      } else {
        // API에서 에러 메시지를 반환한 경우
        const errorMessage = result?.error || result?.message || 'API에서 오류가 발생했습니다.'
        console.warn('API 삭제 실패:', errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('컨소시엄 기관 삭제 오류:', error)
      
      // 네트워크 오류나 기타 예외 상황
      if (error instanceof Error) {
        // 이미 Error 객체인 경우 그대로 사용
        throw error
      } else {
        // 알 수 없는 타입의 오류인 경우 Error 객체로 변환
        throw new Error('삭제 중 알 수 없는 오류가 발생했습니다.')
      }
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
                           orgData.type === '참여' ? '참여기관' : 
                           orgData.type === '공동' ? '공동연구개발기관' : '수요기업',
          organizationName: orgData.name,
          roleDescription: orgData.roleDescription || ''
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
    
    // 1년차 기관들을 정렬된 순서로 전달 (주관기관 → 공동연구기관 → 참여기관 → 수요기관)
    let firstYearOrgs: Organization[] = []
    
    if (projectType === "multi" && yearlyOrganizations[1]) {
      // 연차별 사업인 경우: 1년차 기관들을 정렬된 순서로 전달
      firstYearOrgs = yearlyOrganizations[1].filter(org => !org.isNew)
    } else {
      // 단년도 사업인 경우: organizations를 정렬된 순서로 전달
      firstYearOrgs = organizations.filter(org => !org.isNew)
    }
    
    // 정렬된 순서를 그대로 사용 (sortOrganizationsByPriority로 이미 정렬됨)
    onConsortiumChangeRef.current({
      projectType,
      projectDuration,
      organizations: firstYearOrgs, // 정렬된 1년차 기관들의 순서를 그대로 사용
      yearlyOrganizations: yearlyOrgsWithYears,
    })
    
  }, [projectType, projectDuration, organizations, yearlyOrganizations])

  // 편집 중인 기관 ID를 추가하는 함수
  const addEditingOrg = (orgId: string) => {
    setEditingOrgs(prev => prev.includes(orgId) ? prev : [...prev, orgId])
  }

  // 편집 중인 기관 ID를 제거하는 함수
  const removeEditingOrg = (orgId: string) => {
    setEditingOrgs(prev => prev.filter(id => id !== orgId))
  }

  // 새로 추가된 기관이 있을 때 자동으로 편집 모드 활성화
  useEffect(() => {
    // 즉시 편집 모드 설정 (setTimeout 제거하여 race condition 방지)
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations()
      const newOrgs = currentOrgs.filter(org => org.isNew)
      newOrgs.forEach(org => {
        if (!editingOrgs.includes(org.id)) {
          addEditingOrg(org.id)
        }
      })
    } else {
      const newOrgs = organizations.filter(org => org.isNew)
      newOrgs.forEach(org => {
        if (!editingOrgs.includes(org.id)) {
          addEditingOrg(org.id)
        }
      })
    }
  }, [projectType, organizations, yearlyOrganizations, selectedYear, editingOrgs])

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
    // 이미 추가 중이면 중복 실행 방지
    if (addingOrganization) {
      console.log('기관 추가가 이미 진행 중입니다.')
      return
    }

    // 연속 클릭 방지 (1초 내에 다시 클릭하면 무시)
    const now = Date.now()
    if (now - lastAddTime < 1000) {
      console.log('너무 빠른 연속 클릭입니다. 잠시 기다려주세요.')
      return
    }
    setLastAddTime(now)

    setAddingOrganization(true)
    
    try {
      const newOrg: Organization = {
        id: generateUniqueId('org'),
        name: "",
        type: "참여",
        roleDescription: "",
        members: [],
        isNew: true,
      }
      
      if (projectType === "multi") {
        // 연차별 사업인 경우 - 새 기관을 맨 아래에 추가
        const currentOrgs = getCurrentYearOrganizations()
        // 기존 기관들을 먼저 정렬 (isNew가 false인 것들)
        const existingOrgs = currentOrgs.filter(org => !org.isNew)
        const updatedOrgs = [...existingOrgs, newOrg]
        
        console.log('새 기관 추가 (연차별):', {
          newOrg,
          existingCount: existingOrgs.length,
          updatedCount: updatedOrgs.length,
          year: selectedYear
        })
        
        // 중복 제거 후 설정
        const deduplicatedOrgs = deduplicateOrganizations(updatedOrgs)
        setYearOrganizations(selectedYear, deduplicatedOrgs)
        
        // 부모 컴포넌트에 변경사항 알림
        if (onConsortiumChangeRef.current) {
          onConsortiumChangeRef.current({
            projectType,
            projectDuration,
            organizations: deduplicatedOrgs,
            yearlyOrganizations: { ...yearlyOrganizations, [selectedYear]: deduplicatedOrgs }
          })
        }
        
        // 편집 모드 설정을 즉시 실행 (setTimeout 제거)
        addEditingOrg(newOrg.id)
      } else {
        // 단년도 사업인 경우 - 새 기관을 맨 아래에 추가
        const existingOrgs = organizations.filter(org => !org.isNew)
        const updatedOrgs = [...existingOrgs, newOrg]
        
        console.log('새 기관 추가 (단년도):', {
          newOrg,
          existingCount: existingOrgs.length,
          updatedCount: updatedOrgs.length
        })
        
        // 중복 제거 후 설정
        const deduplicatedOrgs = deduplicateOrganizations(updatedOrgs)
        setOrganizations(deduplicatedOrgs)
        
        // 부모 컴포넌트에 변경사항 알림
        if (onConsortiumChangeRef.current) {
          onConsortiumChangeRef.current({
            projectType,
            projectDuration,
            organizations: deduplicatedOrgs
          })
        }
        
        // 편집 모드 설정을 즉시 실행 (setTimeout 제거)
        addEditingOrg(newOrg.id)
      }
    } catch (error) {
      console.error('기관 추가 중 오류 발생:', error)
      alert('기관 추가 중 오류가 발생했습니다.')
    } finally {
      setAddingOrganization(false)
    }
  }

  const handleCancelAddOrganization = (orgId: string) => {
    // 새로 추가된 기관 추가 취소
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
    removeEditingOrg(orgId)
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
      console.log('기관 삭제 시도:', { orgId, orgName: orgToDelete.name })
      
      const deleteResult = await deleteConsortiumOrganization(orgId)
      
      if (deleteResult) {
        console.log('기관 삭제 성공:', orgId)
        
        // 삭제 성공 후 상태 업데이트 및 부모 컴포넌트에 알림
        if (projectType === "multi") {
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.filter((org) => org.id !== orgId)
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
          const updatedOrgs = organizations.filter((org) => org.id !== orgId)
          setOrganizations(updatedOrgs)
          
          if (onConsortiumChangeRef.current) {
            onConsortiumChangeRef.current({
              projectType,
              projectDuration,
              organizations: updatedOrgs
            })
          }
        }
        
        // 성공 메시지 표시
        alert(`"${orgToDelete.name}" 기관이 성공적으로 삭제되었습니다.`)
      } else {
        throw new Error('삭제 결과를 확인할 수 없습니다.')
      }
      
    } catch (error) {
      console.error('기관 삭제 실패:', error)
      
      // 사용자에게 에러 메시지 표시
      let errorMessage = '알 수 없는 오류가 발생했습니다.'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as any).message
      }
      
      // 서버 오류인 경우 더 자세한 안내
      if (errorMessage.includes('서버 오류') || errorMessage.includes('500')) {
        alert(`기관 삭제에 실패했습니다: ${errorMessage}\n\n서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.`)
      } else {
        alert(`기관 삭제에 실패했습니다: ${errorMessage}`)
      }
      
      // 실패 시에도 UI에서 제거하지 않음 (사용자가 다시 시도할 수 있도록)
      // 대신 에러 로깅만 수행
    }
  }

  const handleAddMember = async (orgId: string) => {
    const newMember: Member = {
      id: generateUniqueId('member'),
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
      
      removeEditingOrg(orgId)
    } catch (error) {
      console.error('기관 저장 실패:', error)
      // 실패 시에도 편집 모드 종료
      removeEditingOrg(orgId)
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
        // 새 기관인 경우 로컬 상태만 업데이트 (isNew 플래그 유지)
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
          // 주관기관이 되었다면 자동으로 맨 위로 이동
          setYearOrganizations(selectedYear, updatedOrgs)
        } else {
          const updatedOrgs = organizations.map((org) => (org.id === orgId ? { ...org, type } : org))
          // 주관기관이 되었다면 자동으로 맨 위로 이동
          setOrganizations(updatedOrgs)
        }
      } else {
        // 새 기관인 경우 로컬 상태만 업데이트 (isNew 플래그 유지)
        if (projectType === "multi") {
          const currentOrgs = getCurrentYearOrganizations()
          const updatedOrgs = currentOrgs.map((org) => (org.id === orgId ? { ...org, type } : org))
          // 주관기관이 되었다면 자동으로 맨 위로 이동
          setYearOrganizations(selectedYear, updatedOrgs)
        } else {
          const updatedOrgs = organizations.map((org) => (org.id === orgId ? { ...org, type } : org))
          // 주관기관이 되었다면 자동으로 맨 위로 이동
          setYearOrganizations(selectedYear, updatedOrgs)
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

  const handleOrgRoleDescriptionChange = (orgId: string, roleDescription: string) => {
    // 실시간으로 로컬 상태 업데이트 (API 호출 없이)
    if (projectType === "multi") {
      const currentOrgs = getCurrentYearOrganizations()
      const updatedOrgs = currentOrgs.map((org) => (org.id === orgId ? { ...org, roleDescription } : org))
      setYearOrganizations(selectedYear, updatedOrgs)
    } else {
      const updatedOrgs = organizations.map((org) => (org.id === orgId ? { ...org, roleDescription } : org))
      setOrganizations(updatedOrgs)
    }
  }

  const handleEditRoleDescription = (orgId: string) => {
    // 역할 설명 편집 모드 활성화
    addEditingOrg(orgId)
  }

  const handleSaveRoleDescription = async (orgId: string) => {
    try {
      // 현재 편집 중인 기관 데이터 가져오기
      const orgToSave = projectType === "multi" 
        ? getCurrentYearOrganizations().find(org => org.id === orgId)
        : organizations.find(org => org.id === orgId)
      
      if (orgToSave) {
        // API 호출하여 데이터베이스에 저장
        await updateConsortiumOrganization(orgId, orgToSave)
        
        // 편집 모드 해제
        removeEditingOrg(orgId)
        
        // 성공 메시지
        console.log('역할 설명이 저장되었습니다.')
      }
    } catch (error) {
      console.error('역할 설명 저장 실패:', error)
      alert('역할 설명 저장에 실패했습니다.')
    }
  }

  const handleCancelEditRoleDescription = (orgId: string) => {
    // 편집 모드 해제
    removeEditingOrg(orgId)
    
    // 원래 데이터로 복원
    if (projectType === "multi") {
      fetchConsortiumOrganizations(project.id, selectedYear)
    } else {
      fetchConsortiumOrganizations(project.id, 1)
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
      case "수요":
        return "수요"
      default:
        return "공동"
    }
  }

  // 연차별 기간 계산 함수
  const calculateYearPeriods = () => {
    if (!project?.start_date) return [];
    
    const startDate = new Date(project.start_date);
    const periods = [];
    
    for (let year = 1; year <= projectDuration; year++) {
      if (year === 1) {
        // 1차년도: 시작일부터 해당년도 12월 31일까지
        const endOfFirstYear = new Date(startDate.getFullYear(), 11, 31);
        periods.push({
          year,
          startDate: startDate,
          endDate: endOfFirstYear,
          displayText: `${startDate.getFullYear()}.${(startDate.getMonth() + 1).toString().padStart(2, '0')}.${startDate.getDate().toString().padStart(2, '0')} ~ ${endOfFirstYear.getFullYear()}.12.31`
        });
      } else {
        // 2차년도 이후: 해당년도 1월 1일부터 12월 31일까지
        const yearStart = new Date(startDate.getFullYear() + year - 1, 0, 1);
        const yearEnd = new Date(startDate.getFullYear() + year - 1, 11, 31);
        periods.push({
          year,
          startDate: yearStart,
          endDate: yearEnd,
          displayText: `${yearStart.getFullYear()}.01.01 ~ ${yearEnd.getFullYear()}.12.31`
        });
      }
    }
    
    return periods;
  };

  const yearPeriods = calculateYearPeriods();

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
              {/* 디버깅 정보 */}
              <div className="mb-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                <div>프로젝트 타입: {projectType}</div>
                <div>프로젝트 기간: {projectDuration}년</div>
                <div>선택된 연차: {selectedYear}차년도</div>
                <div>복사 버튼 표시 조건: {selectedYear === 1 ? '표시됨' : '숨김'}</div>
                {yearPeriods.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <div className="font-medium">연차별 기간:</div>
                    {yearPeriods.map(period => (
                      <div key={period.year} className={`${period.year === selectedYear ? 'font-bold text-blue-600' : ''}`}>
                        {period.year}차년도: {period.displayText}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">연차별 관리</label>
                {selectedYear === 1 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={copyConsortiumToOtherYears}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-300 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                          복사 중...
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          1차년도 → 전체 연차 복사
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={deleteAllOtherYearsConsortium}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                          삭제 중...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          나머지 연차 컨소시엄 정보 삭제
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: projectDuration }, (_, i) => i + 1).map((year) => {
                  const yearPeriod = yearPeriods.find(p => p.year === year);
                  return (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleYearChange(year)}
                      className="flex flex-col items-center min-w-[110px] h-auto py-2 px-3"
                    >
                      <span className="text-sm font-medium">{year}차년도</span>
                      {yearPeriod && (
                        <span className="text-xs opacity-80 mt-1 leading-tight text-center">
                          {yearPeriod.displayText}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
              
              {/* 2차년도 이상에서 데이터 새로고침 버튼 */}
              {selectedYear > 1 && (
                <div className="mt-2">
                  <Button
                    onClick={() => fetchConsortiumOrganizations(project.id, selectedYear)}
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    {loading ? '새로고침 중...' : `${selectedYear}차년도 데이터 새로고침`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 기관 목록 */}
      {(() => {
        const currentOrgs = projectType === "multi" ? getCurrentYearOrganizations() : organizations
        
        // 최종 중복 제거 확인
        const finalOrgs = deduplicateOrganizations(currentOrgs)
        
        // 디버깅을 위한 로깅
        if (finalOrgs.length !== currentOrgs.length) {
          console.warn('중복 기관이 감지되어 제거됨:', {
            original: currentOrgs.length,
            deduplicated: finalOrgs.length,
            duplicates: currentOrgs.length - finalOrgs.length
          })
        }
        
        if (finalOrgs.length > 0) {
          return finalOrgs.map((org, index) => (
                         <Card key={`${org.id}_${index}`} className={`border ${org.isNew || editingOrgs.includes(org.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {getOrgIcon(org.type)}
                    </div>
                    <div className="flex items-center gap-6">
                      {/* 기관명 */}
                      <div className="w-48">
                        {org.isNew || editingOrgs.includes(org.id) ? (
                          <Input
                            value={org.name}
                            onChange={(e) => handleOrgNameChange(org.id, e.target.value)}
                            placeholder="기관명을 입력하세요"
                            className="text-lg font-medium border border-blue-300 bg-blue-50 p-2 rounded w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            autoFocus
                          />
                        ) : (
                          <span className="text-lg font-medium">{org.name}</span>
                        )}
                      </div>
                      
                      {/* 구분 */}
                      <div className="w-32">
                        <Select value={org.type} onValueChange={(value) => handleOrgTypeChange(org.id, value)}>
                          <SelectTrigger className={`w-full h-8 py-0 px-2 ${org.isNew || editingOrgs.includes(org.id) ? 'border border-blue-300 bg-blue-50' : 'border-0 bg-transparent'}`}>
                            <SelectValue />
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
                      
                      {/* 역할 설명 */}
                      <div className="w-80">
                        {org.isNew || editingOrgs.includes(org.id) ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={org.roleDescription || ""}
                              onChange={(e) => handleOrgRoleDescriptionChange(org.id, e.target.value)}
                              placeholder="역할 설명을 입력하세요"
                              className="text-sm border border-blue-300 bg-blue-50 p-2 rounded flex-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            {!org.isNew && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveRoleDescription(org.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 h-6 px-2 border-green-300"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelEditRoleDescription(org.id)}
                                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 h-6 px-2 border-gray-300"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 flex-1">
                              {org.roleDescription || "역할 설명 없음"}
                            </span>
                            {/* 역할 설명 편집 버튼 - 오른쪽 수정/삭제 그룹으로 이동
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditRoleDescription(org.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 w-6 p-0"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                                    <div className="flex items-center gap-3">
                    {/* 순서 변경 버튼들 */}
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOrganizationUp(org.id)}
                        disabled={org.type === '주관' || 
                          (projectType === "multi" ? 
                            getCurrentYearOrganizations().findIndex(o => o.id === org.id) <= 0 ||
                            (getCurrentYearOrganizations().findIndex(o => o.id === org.id) > 0 && 
                             getCurrentYearOrganizations()[getCurrentYearOrganizations().findIndex(o => o.id === org.id) - 1].type === '주관') ||
                            (org.type === '참여' && getCurrentYearOrganizations().findIndex(o => o.id === org.id) > 0 && 
                             getCurrentYearOrganizations()[getCurrentYearOrganizations().findIndex(o => o.id === org.id) - 1].type === '공동')
                            : 
                            organizations.findIndex(o => o.id === org.id) <= 0 ||
                            (organizations.findIndex(o => o.id === org.id) > 0 && 
                             organizations[organizations.findIndex(o => o.id === org.id) - 1].type === '주관') ||
                            (org.type === '참여' && organizations.findIndex(o => o.id === org.id) > 0 && 
                             organizations[organizations.findIndex(o => o.id === org.id) - 1].type === '공동')
                            )}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveOrganizationDown(org.id)}
                        disabled={projectType === "multi" ? 
                           getCurrentYearOrganizations().findIndex(o => o.id === org.id) >= getCurrentYearOrganizations().length - 1
                           : 
                           organizations.findIndex(o => o.id === org.id) >= organizations.length - 1}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* 구분선 */}
                    <div className="w-px h-8 bg-gray-300"></div>
                    
                    {/* 연구자 추가 버튼 */}
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
                        <>
                          <Button
                            onClick={() => handleSaveOrganization(org.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            저장
                          </Button>
                          <Button
                            onClick={() => handleCancelAddOrganization(org.id)}
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            취소
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {/* 구분선 */}
                    <div className="w-px h-8 bg-gray-300"></div>
                    
                    {/* 수정/삭제 버튼들 */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRoleDescription(org.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  return org.members.length > 0 ? (
                    org.members.map((member, memberIndex) => {
                      // 구성원 ID 유효성 최종 확인 및 로깅
                      if (!member.id || member.id === 'null' || member.id === 'undefined') {
                        console.warn('유효하지 않은 구성원 ID 발견:', { member, orgId: org.id, memberIndex })
                        // 즉시 유효한 ID 생성
                        const validId = generateUniqueId('member')
                        member.id = validId
                        console.log('유효한 ID로 수정됨:', validId)
                      }
                      
                      return (
                        <div key={member.id || `member_${org.id}_${memberIndex}_${member.name || 'unnamed'}`} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-16 text-sm flex-1">
                              {editingMember === member.id ? (
                                <>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-600 font-medium">이름</span>
                                    <Input
                                      value={editForm.name || ""}
                                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                      className="h-8 text-sm border-blue-200 focus:border-blue-400 w-20"
                                      placeholder="이름"
                                    />
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-600 font-medium">직급</span>
                                    <Input
                                      value={editForm.position || ""}
                                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                      className="h-8 text-sm border-blue-200 focus:border-blue-400 w-24"
                                      placeholder="직급"
                                    />
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-600 font-medium">역할</span>
                                    <Input
                                      value={editForm.role || ""}
                                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                      className="h-8 text-sm border-blue-200 focus:border-blue-400 w-20"
                                      placeholder="역할"
                                    />
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-600 font-medium">전화번호</span>
                                    <Input
                                      value={editForm.phone || ""}
                                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                      className="h-8 text-sm border-blue-200 focus:border-blue-400 w-24"
                                      placeholder="전화번호"
                                    />
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-600 font-medium">휴대폰</span>
                                    <Input
                                      value={editForm.mobile || ""}
                                      onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                                      className="h-8 text-sm border-blue-200 focus:border-blue-400 w-24"
                                      placeholder="휴대폰"
                                    />
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-600 font-medium">이메일</span>
                                    <Input
                                      value={editForm.email || ""}
                                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                      className="h-8 text-sm border-blue-200 focus:border-blue-400 w-28"
                                      placeholder="이메일"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-6">
                                    <span className="text-gray-600">이름</span>
                                    <span className="font-semibold text-gray-800">{member.name}</span>
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-6">
                                    <span className="text-gray-600">직급</span>
                                    <span className="font-semibold text-gray-800">{member.position}</span>
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-6">
                                    <span className="text-gray-600">역할</span>
                                    <span className="font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded text-xs">{member.role}</span>
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-6">
                                    <span className="text-gray-600">전화번호</span>
                                    <span className="font-semibold text-gray-800">{member.phone}</span>
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-6">
                                    <span className="text-gray-600">휴대폰</span>
                                    <span className="font-semibold text-gray-800">{member.mobile}</span>
                                  </div>
                                  <span className="text-gray-400">|</span>
                                  <div className="flex items-center gap-6">
                                    <span className="text-gray-600">이메일</span>
                                    <span className="font-semibold text-gray-800">{member.email}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* 수정/삭제 버튼들 */}
                            <div className="flex items-center gap-2 ml-4">
                              {editingMember === member.id ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSaveMember}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 px-3 border-green-300"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    저장
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 h-8 px-3 border-gray-300"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    취소
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditMember(member)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-3 border-blue-300"
                                  >
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    수정
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveMember(org.id, member.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3 border-red-300"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    삭제
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
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

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleAddOrganization}
          variant="outline"
          disabled={addingOrganization}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addingOrganization ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
              추가 중...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              컨소시엄 기관 추가
            </>
          )}
        </Button>
        <Button
          onClick={handleSaveConsortium}
          variant="outline"
          disabled={loading}
          className="border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              저장 중...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              컨소시엄 기관 저장
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
