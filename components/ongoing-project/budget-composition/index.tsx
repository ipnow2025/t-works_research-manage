"use client"

import React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { FileText, Check, X, Plus, Minus, Building2 } from "lucide-react"
import { BudgetCalculatorDialog } from "./budget-calculator-dialog"
import { apiFetch } from "@/lib/func"

interface BudgetCompositionProps {
  project: any
  consortiumData?: {
    projectType: "single" | "multi"
    projectDuration: number
    organizations: Array<{
      id: string
      name: string
      type: string
      members: Array<any>
    }>
    yearlyOrganizations?: Record<number, any> // 연차별 기관 정보
  }
}

interface Organization {
  id: string
  name: string
  type: string
  members: Array<any>
}

interface BudgetCategory {
  personnel: number // 인건비
  studentPersonnel: number // 학생인건비
  researchFacilities: number // 연구시설·장비비
  researchMaterials: number // 연구재료비
  researchActivities: number // 연구활동비
  contractedRD: number // 위탁연구개발비
  internationalJointRD: number // 국제공동연구개발비
  researchDevelopmentBurden: number // 연구개발부담비
  researchAllowance: number // 연구수당
  indirectCosts: number // 간접비
  [key: string]: number // 사용자 정의 항목을 위한 인덱스 시그니처
}

interface YearBudget {
  cash: BudgetCategory // 현금
  inkind: BudgetCategory // 현물
}

interface OrganizationBudget {
  [year: number]: YearBudget
}

interface CustomCategory {
  id: string
  name: string
  isDirect: boolean // true: 직접비, false: 간접비
}

// API 데이터 인터페이스
interface ApiBudgetCategory {
  idx: number;
  categoryName: string;
  categoryDescription?: string;
}

interface ApiProjectBudget {
  idx: number;
  projectIdx: number;
  budgetYear: number;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  budgetStatus: string;
  budgetNotes?: string;
}

interface ApiBudgetItem {
  idx: number;
  budgetIdx: number;
  categoryIdx: number;
  itemName: string;
  plannedAmount: number;
  actualAmount: number;
  itemStatus: string;
}

export function BudgetComposition({ project, consortiumData }: BudgetCompositionProps) {
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false)
  const [budgetUnit, setBudgetUnit] = useState("천원")
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<any>(0)
  const [activeTab, setActiveTab] = useState("total")

  // 기관별 예산 데이터 관리
  const [organizationBudgets, setOrganizationBudgets] = useState<Record<string, OrganizationBudget>>({})

  // 사용 가능한 연차 계산
  const availableYears = useMemo(() => {
    // 컨소시엄 데이터에서 연차 정보 우선 사용
    if (consortiumData?.yearlyOrganizations) {
      const years = Object.keys(consortiumData.yearlyOrganizations).map(Number).sort((a, b) => a - b);
      return years.length > 0 ? years : [1];
    }
    
    // 컨소시엄 데이터에서 프로젝트 기간 사용
    if (consortiumData?.projectDuration) {
      const years = Array.from({ length: consortiumData.projectDuration }, (_, i) => i + 1);
      return years;
    }
    
    // 기존 로직: organizationBudgets에서 연차 정보 추출
    const years = new Set<number>();
    
    // 모든 기관의 예산 데이터에서 연차 정보 수집
    Object.values(organizationBudgets).forEach((orgBudget) => {
      Object.keys(orgBudget).forEach((yearStr) => {
        years.add(Number(yearStr));
      });
    });
    
    // 연차가 없으면 기본값 1 반환
    if (years.size === 0) {
      return [1];
    }
    
    // 연차를 정렬하여 반환
    const sortedYears = Array.from(years).sort((a, b) => a - b);
    return sortedYears;
  }, [organizationBudgets, consortiumData]);
  
  const isMultiYear = availableYears.length > 1;

  // 사용자 정의 카테고리
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])

  // API 데이터 상태
  const [apiCategories, setApiCategories] = useState<ApiBudgetCategory[]>([])
  const [apiBudgets, setApiBudgets] = useState<ApiProjectBudget[]>([])
  const [apiItems, setApiItems] = useState<ApiBudgetItem[]>([])
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiDataLoaded, setApiDataLoaded] = useState(false) // API 데이터 로딩 완료 상태
  const [saving, setSaving] = useState(false) // 저장 중 상태
  const [hasSavedData, setHasSavedData] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // 예산 템플릿 적용 함수
  const handleApplyBudgetTemplate = (budgetData: any) => {
    // 계산된 예산 데이터를 기존 예산 형식으로 변환
    const convertedBudgets: Record<string, OrganizationBudget> = {}
    
    organizations.forEach((org, orgIndex) => {
      convertedBudgets[org.id] = {}
      
      // 연차별 예산 설정
      budgetData.yearlyBudgets.forEach((yearBudget: any, yearIndex: number) => {
        const year = yearIndex + 1
        
        // 기관별 배분 비율 계산
        let orgRatio = 0.5 // 기본 50:50
        if (budgetData.institutions) {
          if (orgIndex === 0) {
            // 주관기관
            orgRatio = budgetData.institutions.institution1.total / budgetData.results.totalBudget
          } else {
            // 참여기관
            orgRatio = budgetData.institutions.institution2.total / budgetData.results.totalBudget
          }
        }
        
        // 기관별 연차 예산 계산
        const orgYearBudget = Math.round(yearBudget.amount * orgRatio)
        
        // 카테고리별 예산 분배
        const cashBudget: BudgetCategory = {
          personnel: 0,
          studentPersonnel: 0,
          researchFacilities: 0,
          researchMaterials: 0,
          researchActivities: 0,
          contractedRD: 0,
          internationalJointRD: 0,
          researchDevelopmentBurden: 0,
          researchAllowance: 0,
          indirectCosts: 0,
        }
        
        const inkindBudget: BudgetCategory = {
          personnel: 0,
          studentPersonnel: 0,
          researchFacilities: 0,
          researchMaterials: 0,
          researchActivities: 0,
          contractedRD: 0,
          internationalJointRD: 0,
          researchDevelopmentBurden: 0,
          researchAllowance: 0,
          indirectCosts: 0,
        }
        
        // 카테고리별 예산 분배 (현금 80%, 현물 20% 가정)
        if (budgetData.categoryBudgets) {
          Object.entries(budgetData.categoryBudgets).forEach(([category, catData]: [string, any]) => {
            const categoryAmount = Math.round(catData.amount * orgRatio)
            const cashAmount = Math.round(categoryAmount * 0.8)
            const inkindAmount = categoryAmount - cashAmount
            
            if (cashBudget.hasOwnProperty(category)) {
              cashBudget[category as keyof BudgetCategory] = cashAmount
              inkindBudget[category as keyof BudgetCategory] = inkindAmount
            }
          })
        }
        
        convertedBudgets[org.id][year] = {
          cash: cashBudget,
          inkind: inkindBudget,
        }
      })
    })
    
    // 변환된 예산으로 상태 업데이트
    setOrganizationBudgets(convertedBudgets)
    
    // 연차 정보 업데이트
    const years = budgetData.yearlyBudgets.map((_: any, index: number) => index + 1)
    // setAvailableYears(years) // 이 부분은 useMemo에서 처리되므로 제거
    // setIsMultiYear(years.length > 1) // 이 부분은 useMemo에서 처리되므로 제거
    
    // 성공 메시지 표시
    alert('예산 템플릿이 성공적으로 적용되었습니다!')
  }

  // 컨소시엄 데이터에서 기관 정보 가져오기
  const organizations: Organization[] = useMemo(() => {
    // 컨소시엄 데이터에서 연차별 기관 정보 우선 사용
    if (consortiumData?.yearlyOrganizations) {
      // 현재 활성 탭에 해당하는 기관들만 필터링
      const currentTabOrgs: Organization[] = [];
      
      // 전체 탭인 경우 모든 연차의 기관들을 중복 제거하여 표시
      if (activeTab === "total") {
        const allOrgs = new Map<string, Organization>();
        
        Object.values(consortiumData.yearlyOrganizations).forEach((yearOrgs) => {
          yearOrgs.forEach((org: any) => {
            if (!allOrgs.has(org.id)) {
              allOrgs.set(org.id, {
                id: org.id,
                name: org.name,
                type: org.type,
                members: org.members || []
              });
            }
          });
        });
        
        currentTabOrgs.push(...Array.from(allOrgs.values()));
      } else {
        // 특정 기관 탭인 경우 해당 기관만 표시
        const targetOrg = consortiumData.organizations?.find(org => org.id === activeTab);
        if (targetOrg) {
          currentTabOrgs.push({
            id: targetOrg.id,
            name: targetOrg.name,
            type: targetOrg.type,
            members: targetOrg.members || []
          });
        }
      }
      
      return currentTabOrgs;
    }
    
    // 컨소시엄 데이터에서 일반 기관 정보 사용
    if (consortiumData?.organizations) {
      return consortiumData.organizations;
    }
    
    // consortiumData가 없으면 project에서 직접 가져오기
    if (project?.consortium_organizations && project.consortium_organizations.length > 0) {
      return project.consortium_organizations.map((org: any) => ({
        id: org.id.toString(),
        name: org.organization_name,
        type: org.organization_type === '주관기관' ? '주관' : '참여',
        members: org.members || []
      }))
    }
    
    // 진행중 프로젝트에서는 기본 기관 정보 제공
    if (project?.leadOrganization) {
      return [
        {
          id: "main_org",
          name: project.leadOrganization,
          type: "주관",
          members: []
        }
      ];
    }
    
    // 실제 데이터가 없으면 빈 배열 반환 (mock 데이터 제거)
    return []
  }, [consortiumData, project?.consortium_organizations, project?.leadOrganization, activeTab])

  // 기관 데이터가 변경될 때 예산 데이터 재초기화
  useEffect(() => {
    // 기관 데이터가 없으면 초기화하지 않음
    if (organizations.length === 0) {
      return;
    }
    
    // 저장된 데이터가 있는지 확인
    const hasExistingData = Object.keys(organizationBudgets).length > 0 && 
      Object.values(organizationBudgets).some(orgBudget => 
        Object.keys(orgBudget).length > 0
      );
    
    if (hasExistingData || hasSavedData) {
      return;
    }
    
    // 기존 예산 데이터에서 기관별 데이터만 업데이트
    setOrganizationBudgets((prevBudgets) => {
      const updatedBudgets: Record<string, OrganizationBudget> = { ...prevBudgets };
      
      // 새로운 기관들에 대해서만 초기화
      organizations.forEach((org: Organization, index: number) => {
        if (!updatedBudgets[org.id]) {
          // 새로운 기관인 경우에만 초기화
          // 기존 연차 정보를 유지하면서 초기화
          const existingYears = availableYears.length > 0 ? availableYears : [1];
          updatedBudgets[org.id] = {};
          
          existingYears.forEach((year) => {
            updatedBudgets[org.id][year] = {
              cash: {
                personnel: 0,
                studentPersonnel: 0,
                researchFacilities: 0,
                researchMaterials: 0,
                researchActivities: 0,
                contractedRD: 0,
                internationalJointRD: 0,
                researchDevelopmentBurden: 0,
                researchAllowance: 0,
                indirectCosts: 0,
              },
              inkind: {
                personnel: 0,
                studentPersonnel: 0,
                researchFacilities: 0,
                researchMaterials: 0,
                researchActivities: 0,
                contractedRD: 0,
                internationalJointRD: 0,
                researchDevelopmentBurden: 0,
                researchAllowance: 0,
                indirectCosts: 0,
              },
            };
          });
        }
      });
      
      // 삭제된 기관들의 데이터 제거
      Object.keys(updatedBudgets).forEach((orgId) => {
        if (!organizations.find(org => org.id === orgId)) {
          delete updatedBudgets[orgId];
        }
      });
      
      return updatedBudgets;
    });
    
  }, [organizations.length, organizations.map(org => org.id).join(',')])

  // API 데이터 가져오기 함수를 별도로 분리
  const fetchApiData = async () => {
    if (!project?.id) return;
    
    setApiLoading(true);
    setApiError(null);
    try {
      // 카테고리 가져오기
      const catRes = await apiFetch('/api/budget-categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setApiCategories(catData);
      }

      // 프로젝트 예산 가져오기
      const budRes = await apiFetch(`/api/project-budgets?projectIdx=${project.id}`);
      if (budRes.ok) {
        const budData = await budRes.json();
        setApiBudgets(budData);
        
        // 연차 정보 업데이트
        if (budData.length > 0) {
          const years = [...new Set(budData.map((b: ApiProjectBudget) => b.budgetYear))].sort() as number[];
          
          // 예산 항목 가져오기 (첫번째 예산 기준)
          const itemRes = await apiFetch(`/api/budget-items?budgetIdx=${budData[0].idx}`);
          if (itemRes.ok) {
            const itemData = await itemRes.json();
            setApiItems(itemData);
          }
        }
      }

      // 예산 상세내역 데이터 가져오기
      const detailsRes = await apiFetch(`/api/budget-details?projectIdx=${project.id}`)
      if (detailsRes.ok) {
        const detailsData = await detailsRes.json()
        if (detailsData.success && detailsData.data.length > 0) {
          // 저장된 예산 데이터가 있으면 변환하여 설정
          convertSavedBudgetDataToFormat(detailsData.data)
          setHasSavedData(true)
        } else {
          setHasSavedData(false)
        }
      } else {
        setHasSavedData(false)
      }
    } catch (error) {
      setApiError('API 데이터 로딩에 실패했습니다.')
      setHasSavedData(false)
    } finally {
      setApiLoading(false)
      setApiDataLoaded(true) // API 데이터 로딩 완료
      setDataLoaded(true) // 전체 데이터 로딩 완료
    }
  };

  // 저장된 예산 데이터를 기존 형식으로 변환하는 함수
  const convertSavedBudgetDataToFormat = (savedBudgets: any[]) => {
    const convertedBudgets: Record<string, OrganizationBudget> = {};
    
    // 저장된 데이터에서 기관 정보 추출
    const extractedOrgs = new Map<string, { id: string, name: string, type: string }>();
    
    savedBudgets.forEach((budget) => {
      if (budget.budgetItems && budget.budgetItems.length > 0) {
        budget.budgetItems.forEach((item: any) => {
          const itemName = item.itemName;
          const match = itemName.match(/^([^_]+)_(.+?) \((현금|현물)\)$/);
          if (match) {
            const [, orgId, categoryName] = match;
            if (!extractedOrgs.has(orgId)) {
              // 기관 정보가 없으면 기본값 사용
              extractedOrgs.set(orgId, {
                id: orgId,
                name: orgId, // 기본값으로 orgId 사용
                type: "주관" // 기본값
              });
            }
          }
        });
      }
    });
    
    // 기관별로 데이터 구성 (저장된 데이터에서 추출한 기관 정보 우선 사용)
    let orgsToUse = organizations.length > 0 ? organizations : Array.from(extractedOrgs.values());
    
    // 진행중 프로젝트에서 기관 ID 매핑 처리
    if (organizations.length > 0 && extractedOrgs.size > 0) {
      // organizations와 extractedOrgs 간의 매핑 생성
      const orgMapping = new Map<string, string>();
      
      // 진행중 프로젝트의 경우 기본 기관 ID 매핑
      if (organizations.length === 1 && organizations[0].id === "main_org") {
        // 기본 기관이 "main_org"인 경우, 저장된 데이터의 첫 번째 기관과 매핑
        const firstExtractedOrg = Array.from(extractedOrgs.keys())[0];
        if (firstExtractedOrg) {
          orgMapping.set(firstExtractedOrg, "main_org");
        }
      } else {
        // 일반적인 경우: 이름 기반 매핑
        organizations.forEach(org => {
          const matchingExtractedOrg = Array.from(extractedOrgs.values()).find(
            extractedOrg => extractedOrg.name === org.name || extractedOrg.id === org.id
          );
          if (matchingExtractedOrg) {
            orgMapping.set(matchingExtractedOrg.id, org.id);
          }
        });
      }
      
      // 매핑이 없는 경우 extractedOrgs를 그대로 사용
      if (orgMapping.size === 0) {
        orgsToUse = Array.from(extractedOrgs.values());
      }
    }
    
    if (orgsToUse.length === 0) {
      return;
    }
    
    orgsToUse.forEach((org) => {
      convertedBudgets[org.id] = {};
    });

    // 저장된 예산 데이터를 기관별로 분류
    savedBudgets.forEach((budget) => {
      const year = budget.budgetYear;
      
      // 해당 연차의 예산 항목들 처리
      if (budget.budgetItems && budget.budgetItems.length > 0) {
        budget.budgetItems.forEach((item: any) => {
          // 항목명에서 기관 ID, 카테고리, 타입(현금/현물) 추출
          const itemName = item.itemName;
          const isInkind = itemName.includes('(현물)');
          const type = isInkind ? 'inkind' : 'cash';
          
          // 기관 ID와 카테고리명 추출
          const match = itemName.match(/^([^_]+)_(.+?) \((현금|현물)\)$/);
          if (match) {
            const [, originalOrgId, categoryName] = match;
            
            // 기관 ID 매핑 적용
            let targetOrgId = originalOrgId;
            if (organizations.length > 0 && organizations[0].id === "main_org") {
              // 진행중 프로젝트의 경우 기본 기관으로 매핑
              targetOrgId = "main_org";
            }
            
            // 해당 기관이 존재하는지 확인
            const targetOrg = orgsToUse.find(org => org.id === targetOrgId);
            if (targetOrg) {
              // 해당 기관의 연차 데이터 초기화
              if (!convertedBudgets[targetOrgId][year]) {
                convertedBudgets[targetOrgId][year] = {
                  cash: {
                    personnel: 0,
                    studentPersonnel: 0,
                    researchFacilities: 0,
                    researchMaterials: 0,
                    researchActivities: 0,
                    contractedRD: 0,
                    internationalJointRD: 0,
                    researchDevelopmentBurden: 0,
                    researchAllowance: 0,
                    indirectCosts: 0,
                  },
                  inkind: {
                    personnel: 0,
                    studentPersonnel: 0,
                    researchFacilities: 0,
                    researchMaterials: 0,
                    researchActivities: 0,
                    contractedRD: 0,
                    internationalJointRD: 0,
                    researchDevelopmentBurden: 0,
                    researchAllowance: 0,
                    indirectCosts: 0,
                  },
                };
              }
              
              // 해당 기관에 정확한 금액 할당
              const amount = Number(item.plannedAmount);
              
              // org_ 접두사 제거하여 카테고리 이름 매칭
              const cleanCategoryName = categoryName.replace(/^org_/, '');
              
              if (convertedBudgets[targetOrgId][year][type].hasOwnProperty(cleanCategoryName)) {
                convertedBudgets[targetOrgId][year][type][cleanCategoryName as keyof BudgetCategory] = amount;
              }
            }
          } else {
            // 기존 형식 (기관 ID가 없는 경우) - 균등 분배
            const categoryName = itemName.replace(/ \(현금\)| \(현물\)/, '');
            // org_ 접두사 제거하여 카테고리 이름 매칭
            const cleanCategoryName = categoryName.replace(/^org_/, '');
            const amount = Number(item.plannedAmount);
            const orgCount = orgsToUse.length;
            const orgAmount = Math.round(amount / orgCount);
            
            orgsToUse.forEach((org, index) => {
              if (!convertedBudgets[org.id][year]) {
                convertedBudgets[org.id][year] = {
                  cash: {
                    personnel: 0,
                    studentPersonnel: 0,
                    researchFacilities: 0,
                    researchMaterials: 0,
                    researchActivities: 0,
                    contractedRD: 0,
                    internationalJointRD: 0,
                    researchDevelopmentBurden: 0,
                    researchAllowance: 0,
                    indirectCosts: 0,
                  },
                  inkind: {
                    personnel: 0,
                    studentPersonnel: 0,
                    researchFacilities: 0,
                    researchMaterials: 0,
                    researchActivities: 0,
                    contractedRD: 0,
                    internationalJointRD: 0,
                    researchDevelopmentBurden: 0,
                    researchAllowance: 0,
                    indirectCosts: 0,
                  },
                };
              }
              
              // 마지막 기관에는 나머지 금액을 할당하여 총합이 맞도록 함
              const finalAmount = index === orgCount - 1 ? amount - (orgAmount * (orgCount - 1)) : orgAmount;
              
              if (convertedBudgets[org.id][year][type].hasOwnProperty(cleanCategoryName)) {
                convertedBudgets[org.id][year][type][cleanCategoryName as keyof BudgetCategory] = finalAmount;
              }
            });
          }
        });
      }
    });
    
    setOrganizationBudgets(convertedBudgets);
    setHasSavedData(true);
  };

  // API 데이터를 기존 형식으로 변환하는 함수
  const convertApiDataToBudgetFormat = () => {
    // 기존 예산 데이터 유지하면서 API 데이터로 업데이트
    setOrganizationBudgets((prevBudgets) => {
      const convertedBudgets: Record<string, OrganizationBudget> = { ...prevBudgets };

      // API 데이터가 없으면 빈 예산으로 초기화
      if (apiBudgets.length === 0) {
        organizations.forEach((org) => {
          if (!convertedBudgets[org.id]) {
            convertedBudgets[org.id] = {
              1: {
                cash: {
                  personnel: 0,
                  studentPersonnel: 0,
                  researchFacilities: 0,
                  researchMaterials: 0,
                  researchActivities: 0,
                  contractedRD: 0,
                  internationalJointRD: 0,
                  researchDevelopmentBurden: 0,
                  researchAllowance: 0,
                  indirectCosts: 0,
                },
                inkind: {
                  personnel: 0,
                  studentPersonnel: 0,
                  researchFacilities: 0,
                  researchMaterials: 0,
                  researchActivities: 0,
                  contractedRD: 0,
                  internationalJointRD: 0,
                  researchDevelopmentBurden: 0,
                  researchAllowance: 0,
                  indirectCosts: 0,
                },
              },
            };
          }
        });
      } else {
        // API 데이터가 있으면 변환
        organizations.forEach((org, orgIndex) => {
          if (!convertedBudgets[org.id]) {
            convertedBudgets[org.id] = {};
          }
          
          apiBudgets.forEach((budget) => {
            const year = budget.budgetYear;
            const yearItems = apiItems.filter(item => item.budgetIdx === budget.idx);
            
            // 기본 카테고리 초기화
            const cashBudget: BudgetCategory = {
              personnel: 0,
              studentPersonnel: 0,
              researchFacilities: 0,
              researchMaterials: 0,
              researchActivities: 0,
              contractedRD: 0,
              internationalJointRD: 0,
              researchDevelopmentBurden: 0,
              researchAllowance: 0,
              indirectCosts: 0,
            };

            const inkindBudget: BudgetCategory = {
              personnel: 0,
              studentPersonnel: 0,
              researchFacilities: 0,
              researchMaterials: 0,
              researchActivities: 0,
              contractedRD: 0,
              internationalJointRD: 0,
              researchDevelopmentBurden: 0,
              researchAllowance: 0,
              indirectCosts: 0,
            };

            // API 항목들을 기존 카테고리에 매핑
            yearItems.forEach((item) => {
              const category = apiCategories.find(cat => cat.idx === item.categoryIdx);
              if (category) {
                // 카테고리 이름 기반 매핑
                const categoryName = category.categoryName.toLowerCase();
                const amount = item.plannedAmount || 0;
                
                // 더 정확한 매핑 로직
                if (categoryName.includes('학생') || categoryName.includes('인건') || categoryName.includes('인력')) {
                  cashBudget.studentPersonnel += amount;
                } else if (categoryName.includes('시설') || categoryName.includes('장비') || categoryName.includes('설비')) {
                  cashBudget.researchFacilities += amount;
                } else if (categoryName.includes('재료') || categoryName.includes('소모품')) {
                  cashBudget.researchMaterials += amount;
                } else if (categoryName.includes('활동') || categoryName.includes('회의') || categoryName.includes('출장')) {
                  cashBudget.researchActivities += amount;
                } else if (categoryName.includes('위탁') || categoryName.includes('외주')) {
                  cashBudget.contractedRD += amount;
                } else if (categoryName.includes('국제') || categoryName.includes('해외')) {
                  cashBudget.internationalJointRD += amount;
                } else if (categoryName.includes('추진') || categoryName.includes('관리')) {
                  cashBudget.researchDevelopmentBurden += amount;
                } else if (categoryName.includes('수당') || categoryName.includes('보수')) {
                  cashBudget.researchAllowance += amount;
                } else if (categoryName.includes('연구비') && !categoryName.includes('간접')) {
                  cashBudget.researchDevelopmentBurden += amount;
                } else if (categoryName.includes('간접') || categoryName.includes('간접비')) {
                  cashBudget.indirectCosts += amount;
                } else {
                  // 매핑되지 않은 항목은 연구개발부담비로 분류
                  cashBudget.researchDevelopmentBurden += amount;
                }
              }
            });

            convertedBudgets[org.id][year] = {
              cash: cashBudget,
              inkind: inkindBudget, // API에서는 현물 구분이 없으므로 0으로 설정
            };
          });
        });
        
        // API 데이터에서 연차 정보 추출하여 설정
        const apiYears = [...new Set(apiBudgets.map((b: ApiProjectBudget) => b.budgetYear))].sort() as number[];
      }

      return convertedBudgets;
    });
  };

  // API 데이터가 로드되면 변환 실행
  useEffect(() => {
    if (apiDataLoaded) {
      convertApiDataToBudgetFormat();
    }
  }, [apiDataLoaded, apiBudgets, apiItems, apiCategories]);

  // 기본 카테고리 라벨
  const defaultCategoryLabels = {
    personnel: "인건비",
    studentPersonnel: "학생인건비",
    researchFacilities: "연구시설·장비비",
    researchMaterials: "연구재료비",
    researchActivities: "연구활동비",
    contractedRD: "위탁연구개발비",
    internationalJointRD: "국제공동연구개발비",
    researchDevelopmentBurden: "연구개발부담비",
    researchAllowance: "연구수당",
    indirectCosts: "간접비",
  }

  // 연차 추가 함수
  const addYear = () => {
    const nextYear = Math.max(...availableYears) + 1
    
    // 새 연차에 대한 예산 데이터 초기화 (모든 기관)
    const customCategoryDefaults = customCategories.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {})

    setOrganizationBudgets((prev) => {
      const updated = { ...prev }
      organizations.forEach((org) => {
        if (!updated[org.id]) updated[org.id] = {}
        updated[org.id][nextYear] = {
          cash: {
            personnel: 0,
            studentPersonnel: 0,
            researchFacilities: 0,
            researchMaterials: 0,
            researchActivities: 0,
            contractedRD: 0,
            internationalJointRD: 0,
            researchDevelopmentBurden: 0,
            researchAllowance: 0,
            indirectCosts: 0,
            ...customCategoryDefaults,
          },
          inkind: {
            personnel: 0,
            studentPersonnel: 0,
            researchFacilities: 0,
            researchMaterials: 0,
            researchActivities: 0,
            contractedRD: 0,
            internationalJointRD: 0,
            researchDevelopmentBurden: 0,
            researchAllowance: 0,
            indirectCosts: 0,
            ...customCategoryDefaults,
          },
        }
      })
      return updated
    })
  }

  // 연차 삭제 함수
  const removeYear = (year: number) => {
    if (availableYears.length <= 1) return // 최소 1년차는 유지

    setOrganizationBudgets((prev) => {
      const updated = { ...prev }
      organizations.forEach((org) => {
        if (updated[org.id] && updated[org.id][year]) {
          delete updated[org.id][year]
        }
      })
      return updated
    })
  }

  // 전체 카테고리 라벨 (기본 + 사용자 정의)
  const getAllCategoryLabels = (): Record<string, string> => {
    const customLabels = customCategories.reduce(
      (acc, category) => {
        acc[category.id] = category.name
        return acc
      },
      {} as Record<string, string>,
    )

    return { ...defaultCategoryLabels, ...customLabels }
  }

  // 직접비 카테고리 필터링
  const getDirectCostCategories = () => {
    const defaultDirectCategories = Object.keys(defaultCategoryLabels).filter((key) => key !== "indirectCosts")
    const customDirectCategories = customCategories.filter((cat) => cat.isDirect).map((cat) => cat.id)
    return [...defaultDirectCategories, ...customDirectCategories]
  }

  // 간접비 카테고리 필터링
  const getIndirectCostCategories = () => {
    const defaultIndirectCategories = ["indirectCosts"]
    const customIndirectCategories = customCategories.filter((cat) => !cat.isDirect).map((cat) => cat.id)
    return [...defaultIndirectCategories, ...customIndirectCategories]
  }

  // 직접비 항목 추가
  const addDirectCostCategory = () => {
    const newCategory: CustomCategory = {
      id: `custom_${Date.now()}`,
      name: `새 직접비 항목 ${customCategories.filter((cat) => cat.isDirect).length + 1}`,
      isDirect: true,
    }

    setCustomCategories((prev) => [...prev, newCategory])

    // 모든 기관의 모든 연차에 새 카테고리 추가 (초기값 0)
    setOrganizationBudgets((prev) => {
      const updated = { ...prev }
      organizations.forEach((org) => {
        availableYears.forEach((year) => {
          if (updated[org.id] && updated[org.id][year]) {
            updated[org.id][year].cash[newCategory.id] = 0
            updated[org.id][year].inkind[newCategory.id] = 0
          }
        })
      })
      return updated
    })

    // 새로 추가된 항목의 이름을 편집 모드로 설정
    setTimeout(() => {
      setEditingCell(`name-${newCategory.id}`)
      setEditValue(newCategory.name)
    }, 100)
  }

  // 간접비 항목 추가
  const addIndirectCostCategory = () => {
    const newCategory: CustomCategory = {
      id: `custom_${Date.now()}`,
      name: `새 간접비 항목 ${customCategories.filter((cat) => !cat.isDirect).length + 1}`,
      isDirect: false,
    }

    setCustomCategories((prev) => [...prev, newCategory])

    // 모든 기관의 모든 연차에 새 카테고리 추가 (초기값 0)
    setOrganizationBudgets((prev) => {
      const updated = { ...prev }
      organizations.forEach((org) => {
        availableYears.forEach((year) => {
          if (updated[org.id] && updated[org.id][year]) {
            updated[org.id][year].cash[newCategory.id] = 0
            updated[org.id][year].inkind[newCategory.id] = 0
          }
        })
      })
      return updated
    })

    // 새로 추가된 항목의 이름을 편집 모드로 설정
    setTimeout(() => {
      setEditingCell(`name-${newCategory.id}`)
      setEditValue(newCategory.name)
    }, 100)
  }

  // 카테고리 이름 편집 시작
  const startCategoryNameEdit = (categoryId: string, currentName: string) => {
    setEditingCell(`name-${categoryId}`)
    setEditValue(currentName)
  }

  // 카테고리 이름 편집 저장
  const saveCategoryNameEdit = (categoryId: string, newName: string) => {
    if (newName.trim()) {
      setCustomCategories((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, name: newName.trim() } : cat)))
    }
    setEditingCell(null)
    setEditValue(0)
  }

  // 사용자 정의 카테고리 삭제
  const removeCustomCategory = (categoryId: string) => {
    setCustomCategories((prev) => prev.filter((cat) => cat.id !== categoryId))

    // 모든 기관의 예산 데이터에서 해당 카테고리 제거
    setOrganizationBudgets((prev) => {
      const updated = { ...prev }
      organizations.forEach((org) => {
        availableYears.forEach((year) => {
          if (updated[org.id] && updated[org.id][year]) {
            delete updated[org.id][year].cash[categoryId]
            delete updated[org.id][year].inkind[categoryId]
          }
        })
      })
      return updated
    })
  }

  // 전체 예산 계산 (모든 기관 합계)
  const calculateTotalCategoryAmount = (category: string, type: "cash" | "inkind", year: number) => {
    return organizations.reduce((total, org) => {
      const orgBudget = organizationBudgets[org.id]?.[year]?.[type]
      return total + (orgBudget?.[category] || 0)
    }, 0)
  }

  // 기관별 카테고리 합계 계산
  const calculateOrgCategoryTotal = (orgId: string, category: string, year?: number) => {
    if (year) {
      const yearData = organizationBudgets[orgId]?.[year]
      if (!yearData) return 0
      return (yearData.cash[category] || 0) + (yearData.inkind[category] || 0)
    }
    // 전체 합계
    return availableYears.reduce((total, year) => {
      const yearData = organizationBudgets[orgId]?.[year]
      if (!yearData) return total
      return total + (yearData.cash[category] || 0) + (yearData.inkind[category] || 0)
    }, 0)
  }

  // 전체 카테고리 합계 계산
  const calculateTotalCategoryTotal = (category: string, year?: number) => {
    if (year) {
      return organizations.reduce((total, org) => {
        return total + calculateOrgCategoryTotal(org.id, category, year)
      }, 0)
    }
    return organizations.reduce((total, org) => {
      return total + calculateOrgCategoryTotal(org.id, category)
    }, 0)
  }

  // 기관별 현금/현물별 연차별 합계 계산
  const calculateOrgTypeYearTotal = (orgId: string, type: "cash" | "inkind", year: number) => {
    const data = organizationBudgets[orgId]?.[year]?.[type]
    if (!data) return 0
    return Object.values(data).reduce((sum, value) => sum + (value || 0), 0)
  }

  // 전체 현금/현물별 연차별 합계 계산
  const calculateTotalTypeYearTotal = (type: "cash" | "inkind", year: number) => {
    return organizations.reduce((total, org) => {
      return total + calculateOrgTypeYearTotal(org.id, type, year)
    }, 0)
  }

  // 기관별 직접비 합계 계산
  const calculateOrgDirectCostsTotal = (orgId: string, type: "cash" | "inkind", year: number) => {
    const data = organizationBudgets[orgId]?.[year]?.[type]
    if (!data) return 0
    const directCategories = getDirectCostCategories()
    return directCategories.reduce((sum, category) => sum + (data[category] || 0), 0)
  }

  // 전체 직접비 합계 계산
  const calculateTotalDirectCostsTotal = (type: "cash" | "inkind", year: number) => {
    return organizations.reduce((total, org) => {
      return total + calculateOrgDirectCostsTotal(org.id, type, year)
    }, 0)
  }

  // 기관별 간접비 합계 계산
  const calculateOrgIndirectCostsTotal = (orgId: string, type: "cash" | "inkind", year: number) => {
    const data = organizationBudgets[orgId]?.[year]?.[type]
    if (!data) return 0
    const indirectCategories = getIndirectCostCategories()
    return indirectCategories.reduce((sum, category) => sum + (data[category] || 0), 0)
  }

  // 전체 간접비 합계 계산
  const calculateTotalIndirectCostsTotal = (type: "cash" | "inkind", year: number) => {
    return organizations.reduce((total, org) => {
      return total + calculateOrgIndirectCostsTotal(org.id, type, year)
    }, 0)
  }

  // 기관별 연차별 합계 계산
  const calculateOrgYearTotal = (orgId: string, year: number) => {
    return calculateOrgTypeYearTotal(orgId, "cash", year) + calculateOrgTypeYearTotal(orgId, "inkind", year)
  }

  // 전체 연차별 합계 계산
  const calculateTotalYearTotal = (year: number) => {
    return calculateTotalTypeYearTotal("cash", year) + calculateTotalTypeYearTotal("inkind", year)
  }

  // 전체 총합계 계산
  const calculateGrandTotal = () => {
    // 진행중 프로젝트에서는 프로젝트의 기존 total_cost를 우선적으로 사용
    if (project?.total_cost && project.total_cost > 0) {
      return project.total_cost;
    }
    
    // 프로젝트에 total_cost가 없는 경우에만 계산된 값 사용
    const calculatedTotal = availableYears.reduce((total, year) => {
      return total + calculateTotalYearTotal(year)
    }, 0);
    
    return calculatedTotal;
  }

  // 기관별 총합계 계산
  const calculateOrgGrandTotal = (orgId: string) => {
    return availableYears.reduce((total, year) => {
      return total + calculateOrgYearTotal(orgId, year)
    }, 0)
  }

  // 편집 시작
  const startEdit = (cellId: string, currentValue: number) => {
    setEditingCell(cellId)
    setEditValue(currentValue)
  }

  // 편집 저장
  const saveEdit = () => {
    if (editingCell) {
      const [orgId, year, type, category] = editingCell.split("-")
      setOrganizationBudgets((prev) => ({
        ...prev,
        [orgId]: {
          ...prev[orgId],
          [Number(year)]: {
            ...prev[orgId][Number(year)],
            [type]: {
              ...prev[orgId][Number(year)][type as "cash" | "inkind"],
              [category]: editValue,
            },
          },
        },
      }))
    }
    setEditingCell(null)
    setEditValue(0)
  }

  // 편집 취소
  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue(0)
  }

  const allCategoryLabels = getAllCategoryLabels()
  const directCategories = getDirectCostCategories()
  const indirectCategories = getIndirectCostCategories()

  // 예산 테이블 렌더링 함수
  const renderBudgetTable = (orgId?: string) => {
    const isTotal = !orgId

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th rowSpan={3} className="border border-gray-300 p-2 text-center font-semibold bg-gray-200 min-w-[60px]">
                연차별
              </th>
              <th rowSpan={3} className="border border-gray-300 p-2 text-center font-semibold bg-gray-200 min-w-[60px]">
                구분
              </th>
              <th
                colSpan={directCategories.length + 1}
                className="border border-gray-300 p-2 text-center font-semibold bg-green-100"
              >
                <div className="flex items-center justify-center gap-2">
                  직접비
                  {/* {!isTotal && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addDirectCostCategory}
                      className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )} */}
                </div>
              </th>
              <th
                colSpan={indirectCategories.length}
                className="border border-gray-300 p-2 text-center font-semibold bg-purple-100"
              >
                <div className="flex items-center justify-center gap-2">
                  간접비
                  {/* {!isTotal && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addIndirectCostCategory}
                      className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )} */}
                </div>
              </th>
            </tr>
            <tr className="bg-gray-100">
              {directCategories.map((category) => (
                <th key={category} className="border border-gray-300 p-1 text-center text-xs font-medium min-w-[70px]">
                  <div className="flex items-center justify-center gap-1">
                    {customCategories.find((cat) => cat.id === category) ? (
                      editingCell === `name-${category}` && !isTotal ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-6 text-xs w-20"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveCategoryNameEdit(category, editValue)
                              } else if (e.key === "Escape") {
                                cancelEdit()
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => saveCategoryNameEdit(category, editValue)}
                            className="h-5 w-5 p-0"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-5 w-5 p-0">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          className={`text-center p-1 rounded text-xs ${!isTotal ? "hover:bg-gray-100" : ""}`}
                          onClick={() => !isTotal && startCategoryNameEdit(category, allCategoryLabels[category])}
                          disabled={isTotal}
                        >
                          {allCategoryLabels[category]}
                        </button>
                      )
                    ) : (
                      allCategoryLabels[category]
                    )}
                    {customCategories.find((cat) => cat.id === category) && !isTotal && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomCategory(category)}
                        className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </th>
              ))}
              <th className="border border-gray-300 p-1 text-center text-xs font-medium bg-blue-100 min-w-[60px]">
                소계
              </th>
              {indirectCategories.map((category) => (
                <th key={category} className="border border-gray-300 p-1 text-center text-xs font-medium min-w-[60px]">
                  <div className="flex items-center justify-center gap-1">
                    {customCategories.find((cat) => cat.id === category) ? (
                      editingCell === `name-${category}` && !isTotal ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-6 text-xs w-20"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveCategoryNameEdit(category, editValue)
                              } else if (e.key === "Escape") {
                                cancelEdit()
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => saveCategoryNameEdit(category, editValue)}
                            className="h-5 w-5 p-0"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-5 w-5 p-0">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          className={`text-center p-1 rounded text-xs ${!isTotal ? "hover:bg-gray-100" : ""}`}
                          onClick={() => !isTotal && startCategoryNameEdit(category, allCategoryLabels[category])}
                          disabled={isTotal}
                        >
                          {allCategoryLabels[category]}
                        </button>
                      )
                    ) : (
                      allCategoryLabels[category]
                    )}
                    {customCategories.find((cat) => cat.id === category) && !isTotal && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomCategory(category)}
                        className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 연차별 행 생성 */}
            {availableYears.length > 0 ? (
              availableYears.map((year, yearIndex) => (
                <React.Fragment key={year}>
                  {/* 현금 행 */}
                  <tr>
                    <td
                      rowSpan={3}
                      className={`border border-gray-300 p-2 text-center font-semibold ${
                        year === 1 ? "bg-blue-50" : year === 2 ? "bg-purple-50" : "bg-yellow-50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {year}
                        {availableYears.length > 1 && year > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeYear(year)}
                            className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2 text-center bg-green-50 font-medium">현금</td>
                    {directCategories.map((category) => {
                      const cellId = `${orgId || "total"}-${year}-cash-${category}`
                      const value = isTotal
                        ? calculateTotalCategoryAmount(category, "cash", year)
                        : organizationBudgets[orgId!]?.[year]?.cash[category] || 0

                      return (
                        <td key={category} className="border border-gray-300 p-1 text-center">
                          {editingCell === cellId && !isTotal ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(Number(e.target.value))}
                                className="h-6 text-xs"
                              />
                              <Button size="sm" variant="ghost" onClick={saveEdit} className="h-5 w-5 p-0">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-5 w-5 p-0">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              className={`w-full h-full text-center p-1 rounded text-xs ${
                                isTotal ? "cursor-default" : "hover:bg-gray-100"
                              }`}
                              onClick={() => !isTotal && startEdit(cellId, value)}
                              disabled={isTotal}
                            >
                              {value.toLocaleString()}
                            </button>
                          )}
                        </td>
                      )
                    })}
                    <td className="border border-gray-300 p-1 text-center font-semibold bg-green-50 text-xs">
                      {isTotal
                        ? calculateTotalDirectCostsTotal("cash", year).toLocaleString()
                        : calculateOrgDirectCostsTotal(orgId!, "cash", year).toLocaleString()}
                    </td>
                    {indirectCategories.map((category) => {
                      const cellId = `${orgId || "total"}-${year}-cash-${category}`
                      const value = isTotal
                        ? calculateTotalCategoryAmount(category, "cash", year)
                        : organizationBudgets[orgId!]?.[year]?.cash[category] || 0

                      return (
                        <td key={category} className="border border-gray-300 p-1 text-center">
                          {editingCell === cellId && !isTotal ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(Number(e.target.value))}
                                className="h-6 text-xs"
                              />
                              <Button size="sm" variant="ghost" onClick={saveEdit} className="h-5 w-5 p-0">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-5 w-5 p-0">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              className={`w-full h-full text-center p-1 rounded text-xs ${
                                isTotal ? "cursor-default" : "hover:bg-gray-100"
                              }`}
                              onClick={() => !isTotal && startEdit(cellId, value)}
                              disabled={isTotal}
                            >
                              {value.toLocaleString()}
                            </button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  {/* 현물 행 */}
                  <tr>
                    <td className="border border-gray-300 p-2 text-center bg-orange-50 font-medium">현물</td>
                    {directCategories.map((category) => {
                      const cellId = `${orgId || "total"}-${year}-inkind-${category}`
                      const value = isTotal
                        ? calculateTotalCategoryAmount(category, "inkind", year)
                        : organizationBudgets[orgId!]?.[year]?.inkind[category] || 0

                      return (
                        <td key={category} className="border border-gray-300 p-1 text-center">
                          {editingCell === cellId && !isTotal ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(Number(e.target.value))}
                                className="h-6 text-xs"
                              />
                              <Button size="sm" variant="ghost" onClick={saveEdit} className="h-5 w-5 p-0">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-5 w-5 p-0">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              className={`w-full h-full text-center p-1 rounded text-xs ${
                                isTotal ? "cursor-default" : "hover:bg-gray-100"
                              }`}
                              onClick={() => !isTotal && startEdit(cellId, value)}
                              disabled={isTotal}
                            >
                              {value.toLocaleString()}
                            </button>
                          )}
                        </td>
                      )
                    })}
                    <td className="border border-gray-300 p-1 text-center font-semibold bg-orange-50 text-xs">
                      {isTotal
                        ? calculateTotalDirectCostsTotal("inkind", year).toLocaleString()
                        : calculateOrgDirectCostsTotal(orgId!, "inkind", year).toLocaleString()}
                    </td>
                    {indirectCategories.map((category) => {
                      const cellId = `${orgId || "total"}-${year}-inkind-${category}`
                      const value = isTotal
                        ? calculateTotalCategoryAmount(category, "inkind", year)
                        : organizationBudgets[orgId!]?.[year]?.inkind[category] || 0

                      return (
                        <td key={category} className="border border-gray-300 p-1 text-center">
                          {editingCell === cellId && !isTotal ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(Number(e.target.value))}
                                className="h-6 text-xs"
                              />
                              <Button size="sm" variant="ghost" onClick={saveEdit} className="h-5 w-5 p-0">
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-5 w-5 p-0">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              className={`w-full h-full text-center p-1 rounded text-xs ${
                                isTotal ? "cursor-default" : "hover:bg-gray-100"
                              }`}
                              onClick={() => !isTotal && startEdit(cellId, value)}
                              disabled={isTotal}
                            >
                              {value.toLocaleString()}
                            </button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  {/* 소계 행 */}
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2 text-center font-semibold">소계</td>
                    {directCategories.map((category) => (
                      <td key={category} className="border border-gray-300 p-1 text-center font-semibold text-xs">
                        {isTotal
                          ? calculateTotalCategoryTotal(category, year).toLocaleString()
                          : calculateOrgCategoryTotal(orgId!, category, year).toLocaleString()}
                      </td>
                    ))}
                    <td className="border border-gray-300 p-1 text-center font-semibold bg-blue-100 text-xs">
                      {isTotal
                        ? (
                            calculateTotalDirectCostsTotal("cash", year) + calculateTotalDirectCostsTotal("inkind", year)
                          ).toLocaleString()
                        : (
                            calculateOrgDirectCostsTotal(orgId!, "cash", year) +
                            calculateOrgDirectCostsTotal(orgId!, "inkind", year)
                          ).toLocaleString()}
                    </td>
                    {indirectCategories.map((category) => (
                      <td key={category} className="border border-gray-300 p-1 text-center font-semibold text-xs">
                        {isTotal
                          ? calculateTotalCategoryTotal(category, year).toLocaleString()
                          : calculateOrgCategoryTotal(orgId!, category, year).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))
            ) : (
              // 데이터가 없을 때 빈 행 표시
              <tr>
                <td colSpan={directCategories.length + indirectCategories.length + 3} className="border border-gray-300 p-8 text-center text-gray-500">
                  {!dataLoaded ? (
                    "예산 데이터를 불러오는 중..."
                  ) : !hasSavedData ? (
                    "저장된 예산 데이터가 없습니다. 예산을 입력하고 저장해주세요."
                  ) : (
                    "예산 데이터를 불러오는 중..."
                  )}
                </td>
              </tr>
            )}

            {/* 총계 */}
            {availableYears.length > 1 && (
              <tr className="bg-blue-100 font-bold">
                <td colSpan={2} className="border border-gray-300 p-2 text-center font-bold">
                  총계
                </td>
                {directCategories.map((category) => (
                  <td key={category} className="border border-gray-300 p-1 text-center font-bold text-xs">
                    {isTotal
                      ? calculateTotalCategoryTotal(category).toLocaleString()
                      : calculateOrgCategoryTotal(orgId!, category).toLocaleString()}
                  </td>
                ))}
                <td className="border border-gray-300 p-1 text-center font-bold bg-blue-200 text-xs">
                  {isTotal
                    ? availableYears
                        .reduce(
                          (total, year) =>
                            total +
                            calculateTotalDirectCostsTotal("cash", year) +
                            calculateTotalDirectCostsTotal("inkind", year),
                          0,
                        )
                        .toLocaleString()
                    : availableYears
                        .reduce(
                          (total, year) =>
                            total +
                            calculateOrgDirectCostsTotal(orgId!, "cash", year) +
                            calculateOrgDirectCostsTotal(orgId!, "inkind", year),
                          0,
                        )
                        .toLocaleString()}
                </td>
                {indirectCategories.map((category) => (
                  <td key={category} className="border border-gray-300 p-1 text-center font-bold text-xs">
                    {isTotal
                      ? calculateTotalCategoryTotal(category).toLocaleString()
                      : calculateOrgCategoryTotal(orgId!, category).toLocaleString()}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  // 예산 상세내역 저장 함수
  const handleSaveBudgetDetails = async () => {
    if (!project?.id) {
      alert('프로젝트 정보가 없습니다.')
      return
    }

    setSaving(true)
    try {
      // 예산 데이터를 API 형식으로 변환
      const budgetData: Record<string, Record<string, { cash: Record<string, number>, inkind: Record<string, number> }>> = {}
      
      // 연차별로 데이터 구성
      availableYears.forEach(year => {
        budgetData[year.toString()] = {}
        
        organizations.forEach(org => {
          const orgBudget = organizationBudgets[org.id]?.[year]
          if (orgBudget) {
            budgetData[year.toString()][org.id] = {
              cash: orgBudget.cash,
              inkind: orgBudget.inkind
            }
          }
        })
      })

      const response = await apiFetch('/api/budget-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectIdx: project.id,
          budgetData,
          companyIdx: project.companyIdx || 'default',
          memberIdx: project.memberIdx || 'default'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(result.message || '예산 상세내역이 성공적으로 저장되었습니다!')
        // 저장 후 예산 상세내역 데이터만 다시 로드
        try {
          const detailsRes = await apiFetch(`/api/budget-details?projectIdx=${project.id}`)
          if (detailsRes.ok) {
            const detailsData = await detailsRes.json()
            if (detailsData.success && detailsData.data.length > 0) {
              // organizations가 준비될 때까지 대기
              let retryCount = 0;
              const maxRetries = 10;
              
              const loadSavedData = () => {
                if (organizations.length > 0) {
                  // 저장된 예산 데이터가 있으면 변환하여 설정
                  convertSavedBudgetDataToFormat(detailsData.data)
                  setHasSavedData(true)
                } else if (retryCount < maxRetries) {
                  retryCount++;
                  setTimeout(loadSavedData, 100);
                } else {
                  setHasSavedData(false)
                }
              };
              
              loadSavedData();
            } else {
              setHasSavedData(false)
            }
          } else {
            setHasSavedData(false)
          }
        } catch (error) {
          setHasSavedData(false)
        }
      } else {
        throw new Error(result.error || '저장에 실패했습니다.')
      }
    } catch (error) {
      alert(`예산 상세내역 저장 중 오류가 발생했습니다: ${error}`)
    } finally {
      setSaving(false)
    }
  }

  // API 데이터 가져오기
  useEffect(() => {
    fetchApiData();
  }, [project?.id]);

  return (
    <div className="space-y-6">
      {/* API 로딩 상태 표시 */}
      {apiLoading && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span className="text-sm">예산 데이터를 불러오는 중...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {apiError && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-sm">⚠️ {apiError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 예산 요약 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">예산 구성</h2>
            <p className="text-sm text-gray-500">프로젝트 예산의 현금과 현물 구성 현황</p>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">단위:</span>
              <Select value={budgetUnit} onValueChange={setBudgetUnit}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="원">원</SelectItem>
                  <SelectItem value="천원">천원</SelectItem>
                  <SelectItem value="백만원">백만원</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={() => setShowCalculatorDialog(true)}>
              <FileText className="w-4 h-4 mr-2" />
              사업비 계산기
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-blue-600 text-sm mb-2">
                정부 사업비 {isMultiYear && `(${availableYears.length}년)`}
              </div>
              <div className="text-blue-700 text-2xl font-bold">
                {calculateGrandTotal().toLocaleString()}
                {budgetUnit}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-green-600 text-sm mb-2">정부 지원금</div>
              <div className="text-green-700 text-2xl font-bold">
                {availableYears
                  .reduce((total, year) => total + calculateTotalTypeYearTotal("cash", year), 0)
                  .toLocaleString()}
                {budgetUnit}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="text-orange-600 text-sm mb-2">민간 부담금</div>
              <div className="text-orange-700 text-2xl font-bold">
                {availableYears
                  .reduce((total, year) => total + calculateTotalTypeYearTotal("inkind", year), 0)
                  .toLocaleString()}
                {budgetUnit}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-purple-600 text-sm mb-2">현물 비율</div>
              <div className="text-purple-700 text-2xl font-bold">
                {calculateGrandTotal() > 0
                  ? Math.round(
                      (availableYears.reduce((total, year) => total + calculateTotalTypeYearTotal("inkind", year), 0) /
                        calculateGrandTotal()) *
                        100,
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 예산내역 탭 */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">예산 상세내역</CardTitle>
              <p className="text-sm text-gray-500">기관별 현금과 현물로 구분된 예산 관리</p>
            </div>
            <Button
              onClick={handleSaveBudgetDetails}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  저장 중...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  예산 저장
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* 가로 탭 레이아웃 */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-0 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("total")}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === "total"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  전체 예산
                </button>
                {/* 연차별 기관 정보를 사용하여 탭 생성 */}
                {(() => {
                  // 컨소시엄에서 연차별 기관 정보가 있으면 사용
                  if (consortiumData?.yearlyOrganizations) {
                    // 모든 연차의 기관들을 중복 제거하여 탭 생성
                    const allOrgs = new Map<string, Organization>();
                    
                    Object.values(consortiumData.yearlyOrganizations).forEach((yearOrgs) => {
                      yearOrgs.forEach((org: any) => {
                        if (!allOrgs.has(org.id)) {
                          allOrgs.set(org.id, {
                            id: org.id,
                            name: org.name,
                            type: org.type,
                            members: org.members || []
                          });
                        }
                      });
                    });
                    
                    return Array.from(allOrgs.values()).map((org) => (
                      <button
                        key={org.id}
                        onClick={() => setActiveTab(org.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                          activeTab === org.id
                            ? "border-blue-500 text-blue-600 bg-blue-50"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            org.type === "주관" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        />
                        {org.name}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            org.type === "주관"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {org.type}기관
                        </span>
                      </button>
                    ));
                  }
                  
                  // 기존 로직 (fallback)
                  return organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => setActiveTab(org.id)}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                        activeTab === org.id
                          ? "border-blue-500 text-blue-600 bg-blue-50"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          org.type === "주관" ? "bg-blue-500" : "bg-green-500"
                        }`}
                      />
                      {org.name}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          org.type === "주관"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {org.type}기관
                      </span>
                    </button>
                  ));
                })()}
              </div>
            </div>

            <TabsContent value="total" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">전체 예산 현황</h3>
                  <div className="text-sm text-gray-600">총 {organizations.length}개 기관 통합 예산</div>
                </div>
                {renderBudgetTable()}
              </div>
            </TabsContent>

            {(() => {
              // 컨소시엄에서 연차별 기관 정보가 있으면 사용
              if (consortiumData?.yearlyOrganizations) {
                // 모든 연차의 기관들을 중복 제거하여 탭 생성
                const allOrgs = new Map<string, Organization>();
                
                Object.values(consortiumData.yearlyOrganizations).forEach((yearOrgs) => {
                  yearOrgs.forEach((org: any) => {
                    if (!allOrgs.has(org.id)) {
                      allOrgs.set(org.id, {
                        id: org.id,
                        name: org.name,
                        type: org.type,
                        members: org.members || []
                      });
                    }
                  });
                });
                
                return Array.from(allOrgs.values()).map((org) => (
                  <TabsContent key={org.id} value={org.id} className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              org.type === "주관" ? "bg-blue-500" : "bg-green-500"
                            }`}
                          />
                          <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              org.type === "주관"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {org.type}기관
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          기관 총 예산: {calculateOrgGrandTotal(org.id).toLocaleString()}
                          {budgetUnit}
                        </div>
                      </div>
                      {renderBudgetTable(org.id)}
                    </div>
                  </TabsContent>
                ));
              }
              
              // 기존 로직 (fallback)
              return organizations.map((org) => (
                <TabsContent key={org.id} value={org.id} className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            org.type === "주관" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            org.type === "주관"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {org.type}기관
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        기관 총 예산: {calculateOrgGrandTotal(org.id).toLocaleString()}
                        {budgetUnit}
                      </div>
                    </div>
                    {renderBudgetTable(org.id)}
                  </div>
                </TabsContent>
              ));
            })()}
          </Tabs>

          <div className="mt-6 text-sm text-gray-600">
            <p>• 전체 탭에서는 모든 기관의 예산 합계를 확인할 수 있습니다.</p>
            <p>• 기관별 탭에서는 해당 기관의 예산을 수정할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>

      {/* 연차 추가 버튼 */}
      {/* <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              onClick={addYear}
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4" />
              연차 추가
            </Button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            다년도 사업인 경우 연차를 추가하여 연차별 예산을 관리할 수 있습니다.
          </p>
        </CardContent>
      </Card> */}

      <BudgetCalculatorDialog
        open={showCalculatorDialog}
        onOpenChange={setShowCalculatorDialog}
        onApplyTemplate={handleApplyBudgetTemplate}
        project={project}
      />
    </div>
  )
}
