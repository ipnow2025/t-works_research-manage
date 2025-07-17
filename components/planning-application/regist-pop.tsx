import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Upload, X, ExternalLink, Edit, Check } from "lucide-react";
import { useState, useRef } from "react";
import { apiFetch } from "@/lib/func";

const RegistPop = ({
  isRegisterDialogOpen, 
  setIsRegisterDialogOpen, 
  onRegistrationSuccess
}: {
  isRegisterDialogOpen: boolean, 
  setIsRegisterDialogOpen: (isRegisterDialogOpen: boolean) => void,
  onRegistrationSuccess?: () => void
}) => {
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    projectName: '',
    projectManager: '',
    startDate: '',
    endDate: '',
    applicationDate: '',
    department: '',
    institution: '',
    totalCost: '',
    announcementLink: '',
    projectPurpose: '',
    projectDetails: ''
  });

  // 파일 업로드 상태
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 정책목표 상태 (목표달성 현황 탭)
  const [policyGoals, setPolicyGoals] = useState<Array<{
    id: number;
    policyName: string;
    targetValue: string;
    achievementRate: string;
  }>>([]);
  const [editingPolicyGoal, setEditingPolicyGoal] = useState<number | null>(null);
  const [newPolicyGoalIds, setNewPolicyGoalIds] = useState<Set<number>>(new Set());

  // 컨소시엄 구성 상태 (기관 정보)
  const [consortiumOrganizations, setConsortiumOrganizations] = useState<Array<{
    id: number;
    organizationType: string;
    organizationName: string;
    roleDescription: string;
  }>>([]);
  const [editingConsortiumOrganization, setEditingConsortiumOrganization] = useState<number | null>(null);
  const [newConsortiumOrganizationIds, setNewConsortiumOrganizationIds] = useState<Set<number>>(new Set());

  // 입력 값 변경 핸들러
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 총사업비 포맷팅 핸들러
  const handleTotalCostChange = (value: string) => {
    // 숫자와 콤마만 허용
    const cleanValue = value.replace(/[^\d,]/g, '');
    
    // 숫자만 추출해서 콤마 추가
    const numericValue = cleanValue.replace(/,/g, '');
    if (numericValue === '') {
      handleInputChange('totalCost', '');
      return;
    }
    
    // 3자리마다 콤마 추가
    const formattedValue = Number(numericValue).toLocaleString();
    handleInputChange('totalCost', formattedValue);
  };

  // 퍼센트 값 포맷팅 핸들러
  const handlePercentChange = (value: string, callback: (value: string) => void) => {
    // 숫자와 소수점, % 기호만 허용
    const cleanValue = value.replace(/[^\d.%]/g, '');
    
    // % 기호 제거하고 숫자만 추출
    const numericValue = cleanValue.replace(/%/g, '');
    
    if (numericValue === '') {
      callback('');
      return;
    }
    
    // 소수점 검증 (한 개만 허용)
    const dotCount = (numericValue.match(/\./g) || []).length;
    if (dotCount > 1) return;
    
    // 유효한 숫자 범위 검증 (완전한 숫자일 때만)
    const number = parseFloat(numericValue);
    if (!isNaN(number) && (number < 0 || number > 100)) return;
    
    callback(numericValue);
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // 드래그 앤 드롭 핸들러들
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // 파일 삭제 핸들러
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 공고문 링크 열기
  const openAnnouncementLink = () => {
    if (formData.announcementLink) {
      window.open(formData.announcementLink, '_blank');
    }
  };

  // 정책목표 관련 핸들러
  const addPolicyGoal = () => {
    const newGoal = {
      id: Date.now(),
      policyName: '',
      targetValue: '',
      achievementRate: ''
    };
    setPolicyGoals(prev => [...prev, newGoal]);
    setEditingPolicyGoal(newGoal.id); // 새로 추가된 항목을 편집 모드로
    setNewPolicyGoalIds(prev => new Set([...prev, newGoal.id])); // 새로 추가된 항목으로 마킹
  };

  const updatePolicyGoal = (id: number, field: string, value: string) => {
    setPolicyGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    );
  };

  const removePolicyGoal = (id: number) => {
    setPolicyGoals(prev => prev.filter(goal => goal.id !== id));
    setNewPolicyGoalIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    if (editingPolicyGoal === id) {
      setEditingPolicyGoal(null);
    }
  };

  const startEditPolicyGoal = (id: number) => {
    setEditingPolicyGoal(id);
  };

  const saveEditPolicyGoal = (id: number) => {
    setEditingPolicyGoal(null);
    // 저장 시 새로 추가된 항목 마킹 해제
    setNewPolicyGoalIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const cancelEditPolicyGoal = (id: number) => {
    // 새로 추가된 항목이면 삭제, 아니면 편집 취소
    if (newPolicyGoalIds.has(id)) {
      removePolicyGoal(id);
    } else {
      setEditingPolicyGoal(null);
    }
  };

  // 컨소시엄 구성 관련 핸들러
  const addConsortiumOrganization = () => {
    const newOrganization = {
      id: Date.now(),
      organizationType: '',
      organizationName: '',
      roleDescription: ''
    };
    setConsortiumOrganizations(prev => [...prev, newOrganization]);
    setEditingConsortiumOrganization(newOrganization.id); // 새로 추가된 항목을 편집 모드로
    setNewConsortiumOrganizationIds(prev => new Set([...prev, newOrganization.id])); // 새로 추가된 항목으로 마킹
  };

  // 주관기관이 이미 존재하는지 확인
  const hasLeadOrganization = () => {
    return consortiumOrganizations.some(org => org.organizationType === '주관기관');
  };

  // 현재 편집 중인 항목에서 주관기관을 선택할 수 있는지 확인
  const canSelectLeadOrganization = (currentOrgId: number) => {
    // 현재 편집 중인 항목이 이미 주관기관이거나, 다른 주관기관이 없을 때만 선택 가능
    const currentOrg = consortiumOrganizations.find(org => org.id === currentOrgId);
    const currentIsLead = currentOrg?.organizationType === '주관기관';
    const otherLeadExists = consortiumOrganizations.some(org => 
      org.id !== currentOrgId && org.organizationType === '주관기관'
    );
    
    return currentIsLead || !otherLeadExists;
  };

  const updateConsortiumOrganization = (id: number, field: string, value: string) => {
    setConsortiumOrganizations(prev =>
      prev.map(organization =>
        organization.id === id ? { ...organization, [field]: value } : organization
      )
    );
  };

  const removeConsortiumOrganization = (id: number) => {
    setConsortiumOrganizations(prev => prev.filter(organization => organization.id !== id));
    setNewConsortiumOrganizationIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    if (editingConsortiumOrganization === id) {
      setEditingConsortiumOrganization(null);
    }
  };

  const startEditConsortiumOrganization = (id: number) => {
    setEditingConsortiumOrganization(id);
  };

  const saveEditConsortiumOrganization = (id: number) => {
    setEditingConsortiumOrganization(null);
    // 저장 시 새로 추가된 항목 마킹 해제
    setNewConsortiumOrganizationIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const cancelEditConsortiumOrganization = (id: number) => {
    // 새로 추가된 항목이면 삭제, 아니면 편집 취소
    if (newConsortiumOrganizationIds.has(id)) {
      removeConsortiumOrganization(id);
    } else {
      setEditingConsortiumOrganization(null);
    }
  };

  // 유효성 검사 함수 (사업기간 체크만)
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 사업기간 검증 (둘 다 입력된 경우만)
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.period = "사업 종료일은 시작일보다 이후여야 합니다";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const regist = async () => {
    // 사업기간 검증만 수행
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // FormData 생성
      const formDataToSend = new FormData();
      
      // 총사업비 처리 (빈 값일 때 0으로 설정)
      const processedFormData = {
        ...formData,
        totalCost: formData.totalCost ? formData.totalCost.replace(/,/g, '') : '0'
      };
      
      // 프로젝트 데이터 (JSON)
      const projectData = {
        // 폼 데이터 (처리된 값)
        ...processedFormData,
        // 정책목표 데이터
        policyGoals,
        // 컨소시엄 구성 데이터
        consortiumOrganizations
      };
      
      formDataToSend.append('projectData', JSON.stringify(projectData));
      
      // 첨부파일 추가
      uploadedFiles.forEach((file, index) => {
        formDataToSend.append(`attachmentFile_${index}`, file);
      });
      
      // API 호출
      const response = await apiFetch('/api/project-planning', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        alert('과제 기획이 성공적으로 등록되었습니다.');
        // 성공 시 모달 닫기
        setIsRegisterDialogOpen(false);
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }
      } else {
        console.error('등록 실패:', result);
        alert(`등록 실패: ${result.message}`);
      }
      
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
      alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent 
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          style={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 9999
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">새 과제 기획</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-project-name" className="text-sm font-medium">
                  사업명
                </Label>
                <Input 
                  id="new-project-name" 
                  placeholder="예: 스마트공장 구축지원 사업"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className={errors.projectName ? 'border-red-500' : ''}
                />
                {errors.projectName && (
                  <p className="text-sm text-red-500">{errors.projectName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-manager" className="text-sm font-medium">
                  총괄책임자
                </Label>
                <Input 
                  id="new-project-manager" 
                  placeholder="담당자 실명 입력"
                  value={formData.projectManager}
                  onChange={(e) => handleInputChange('projectManager', e.target.value)}
                  className={errors.projectManager ? 'border-red-500' : ''}
                />
                {errors.projectManager && (
                  <p className="text-sm text-red-500">{errors.projectManager}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-period" className="text-sm font-medium">
                  사업기간
                </Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input 
                      id="new-start-date" 
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={errors.period ? 'border-red-500' : ''}
                    />
                  </div>
                  <span>~</span>
                  <div className="flex-1">
                    <Input 
                      id="new-end-date" 
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      min={formData.startDate || undefined}
                      className={errors.period ? 'border-red-500' : ''}
                    />
                  </div>
                </div>
                {errors.period && (
                  <p className="text-sm text-red-500">{errors.period}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-application-date" className="text-sm font-medium">
                  신청일
                </Label>
                <Input 
                  id="new-project-application-date" 
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) => handleInputChange('applicationDate', e.target.value)}
                  className={errors.applicationDate ? 'border-red-500' : ''}
                />
                {errors.applicationDate && (
                  <p className="text-sm text-red-500">{errors.applicationDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-department" className="text-sm font-medium">
                  주관부처
                </Label>
                <Input 
                  id="new-project-department" 
                  placeholder="주관부처 입력"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={errors.department ? 'border-red-500' : ''}
                />
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-institution" className="text-sm font-medium">
                  전문기관
                </Label>
                <Input 
                  id="new-project-institution" 
                  placeholder="전문기관 입력"
                  value={formData.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className={errors.institution ? 'border-red-500' : ''}
                />
                {errors.institution && (
                  <p className="text-sm text-red-500">{errors.institution}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-project-cost" className="text-sm font-medium">
                  총사업비
                </Label>
                <div className="relative">
                  <Input 
                    id="new-project-cost" 
                    type="text" 
                    placeholder="예: 30,000"
                    value={formData.totalCost}
                    onChange={(e) => handleTotalCostChange(e.target.value)}
                    className={errors.totalCost ? 'border-red-500' : ''}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    천원
                  </span>
                </div>
                {errors.totalCost && (
                  <p className="text-sm text-red-500">{errors.totalCost}</p>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="tab1">기본정보</TabsTrigger>
              {/* <TabsTrigger value="tab2">목표달성 현황</TabsTrigger> */}
              <TabsTrigger value="tab3">컨소시엄 구성</TabsTrigger>
            </TabsList>

            {/* 기본정보 Tab */}
            <TabsContent value="tab1" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">공고문 링크</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="공고문 URL을 입력하세요"
                    value={formData.announcementLink}
                    onChange={(e) => handleInputChange('announcementLink', e.target.value)}
                    className="flex-1"
                  />
                  {/* <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600"
                    onClick={openAnnouncementLink}
                    disabled={!formData.announcementLink}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    링크 열기
                  </Button> */}
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label className="text-sm font-medium">첨부파일</Label>
                <div 
                  className={`border-2 border-dashed rounded-md p-4 transition-colors ${
                    isDragging 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className={`h-8 w-8 mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm mb-2 ${isDragging ? 'text-blue-600' : 'text-gray-500'}`}>
                      {isDragging ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭하여 업로드하세요'}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className={isDragging ? 'border-blue-400 text-blue-600' : ''}
                    >
                      파일 선택
                    </Button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-sm font-medium">업로드된 파일:</Label>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center space-x-2">
                            <Upload className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                              업로드 완료
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="new-project-purpose" className="text-sm font-medium">
                  사업목적
                </Label>
                <Textarea 
                  id="new-project-purpose" 
                  placeholder="사업의 목적을 입력하세요" 
                  className="min-h-[100px]"
                  value={formData.projectPurpose}
                  onChange={(e) => handleInputChange('projectPurpose', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-project-details" className="text-sm font-medium">
                  사업내용
                </Label>
                <Textarea 
                  id="new-project-details" 
                  placeholder="사업의 상세 내용을 입력하세요" 
                  className="min-h-[150px]"
                  value={formData.projectDetails}
                  onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                />
              </div>
            </TabsContent>

            {/* 목표달성 현황 Tab */}
            {/* <TabsContent value="tab2" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">정책목표 테이블</h3>
                <Button size="sm" onClick={addPolicyGoal}>
                  <Plus className="h-4 w-4 mr-2" />
                  정책목표 추가
                </Button>
              </div>

              <div className="max-h-60 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>정책명</TableHead>
                    <TableHead>목표값(%)</TableHead>
                    <TableHead>달성률(%)</TableHead>
                    <TableHead className="w-[100px]">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {policyGoals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      등록된 정책목표가 없습니다
                    </TableCell>
                  </TableRow>
                    ) : (
                      policyGoals.map((goal) => (
                        <TableRow key={goal.id}>
                          <TableCell>
                            {editingPolicyGoal === goal.id ? (
                              <Input
                                placeholder="정책명 입력"
                                value={goal.policyName}
                                onChange={(e) => updatePolicyGoal(goal.id, 'policyName', e.target.value)}
                              />
                            ) : (
                              <div className="px-3 py-2 text-sm">
                                {goal.policyName || '-'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingPolicyGoal === goal.id ? (
                              <Input
                                type="text"
                                placeholder="예: 85.5"
                                value={goal.targetValue}
                                onChange={(e) => handlePercentChange(e.target.value, (value) => updatePolicyGoal(goal.id, 'targetValue', value))}
                              />
                            ) : (
                              <div className="px-3 py-2 text-sm">
                                {goal.targetValue && goal.targetValue !== '' ? `${goal.targetValue}%` : '-'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingPolicyGoal === goal.id ? (
                              <Input
                                type="text"
                                placeholder="예: 92.3"
                                value={goal.achievementRate}
                                onChange={(e) => handlePercentChange(e.target.value, (value) => updatePolicyGoal(goal.id, 'achievementRate', value))}
                              />
                            ) : (
                              <div className="px-3 py-2 text-sm">
                                {goal.achievementRate && goal.achievementRate !== '' ? `${goal.achievementRate}%` : '-'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {editingPolicyGoal === goal.id ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => saveEditPolicyGoal(goal.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => cancelEditPolicyGoal(goal.id)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditPolicyGoal(goal.id)}
                                    className="text-yellow-500 hover:text-yellow-700"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removePolicyGoal(goal.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                </TableBody>
              </Table>
              </div>
            </TabsContent> */}

            {/* 컨소시엄 구성 Tab */}
            <TabsContent value="tab3" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">컨소시엄 구성</h3>
                <Button size="sm" onClick={addConsortiumOrganization}>
                  <Plus className="h-4 w-4 mr-2" />
                  컨소시엄 추가
                </Button>
              </div>

              <div className="max-h-60 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>구분</TableHead>
                    <TableHead>기관명</TableHead>
                    <TableHead>역할 설명</TableHead>
                    <TableHead className="w-[100px]">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {consortiumOrganizations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      등록된 컨소시엄 구성원이 없습니다
                    </TableCell>
                  </TableRow>
                    ) : (
                      consortiumOrganizations.map((organization) => (
                        <TableRow key={organization.id}>
                          <TableCell>
                            {editingConsortiumOrganization === organization.id ? (
                              <Select 
                                value={organization.organizationType} 
                                onValueChange={(value) => updateConsortiumOrganization(organization.id, 'organizationType', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="구분 선택" />
                                </SelectTrigger>
                                <SelectContent 
                                  className="bg-white border border-gray-200 shadow-lg z-50"
                                  style={{ backgroundColor: 'white', zIndex: 9999 }}
                                >
                                  <SelectItem 
                                    value="주관기관" 
                                    disabled={!canSelectLeadOrganization(organization.id)}
                                  >
                                    주관기관 {!canSelectLeadOrganization(organization.id) && '(이미 등록됨)'}
                                  </SelectItem>
                                  <SelectItem value="참여기업">참여기업</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="px-3 py-2 text-sm">
                                {organization.organizationType || '-'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingConsortiumOrganization === organization.id ? (
                              <Input
                                placeholder="기관명"
                                value={organization.organizationName}
                                onChange={(e) => updateConsortiumOrganization(organization.id, 'organizationName', e.target.value)}
                              />
                            ) : (
                              <div className="px-3 py-2 text-sm">
                                {organization.organizationName || '-'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingConsortiumOrganization === organization.id ? (
                              <Input
                                placeholder="역할 설명"
                                value={organization.roleDescription}
                                onChange={(e) => updateConsortiumOrganization(organization.id, 'roleDescription', e.target.value)}
                              />
                            ) : (
                              <div className="px-3 py-2 text-sm">
                                {organization.roleDescription || '-'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {editingConsortiumOrganization === organization.id ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => saveEditConsortiumOrganization(organization.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => cancelEditConsortiumOrganization(organization.id)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditConsortiumOrganization(organization.id)}
                                    className="text-yellow-500 hover:text-yellow-700"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeConsortiumOrganization(organization.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                </TableBody>
              </Table>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between space-x-2 pt-4">
            {/* <Button variant="outline">이전</Button> */}
            <div className="flex space-x-2">
              <DialogClose asChild>
                  <Button variant="outline" disabled={isSubmitting}>취소</Button>
              </DialogClose>
              {/* <Button variant="outline">임시저장</Button> */}
                <Button onClick={regist} disabled={isSubmitting}>
                  {isSubmitting ? '등록 중...' : '등록'}
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default RegistPop; 