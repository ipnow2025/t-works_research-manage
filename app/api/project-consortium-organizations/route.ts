import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 컨소시엄 기관 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const year = searchParams.get('year') || '1' // 연차별 필터링
    
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: '프로젝트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const where: any = {
      projectPlanningId: parseInt(projectId),
      year: parseInt(year), // 연차별 필터링
      companyIdx: memberInfo.companyIdx,
      isFlag: 1
    }

    const organizations = await prisma.projectConsortiumOrganization.findMany({
      where,
      orderBy: [
        { id: 'asc' } // 등록 순서 그대로 유지
      ]
    });

    const organizationsData = organizations.map((org: any) => ({
      id: org.id,
      project_planning_id: org.projectPlanningId,
      year: org.year, // 연차 정보 추가
      organization_type: org.organizationType,
      organization_name: org.organizationName,
      role_description: org.roleDescription,
      company_idx: org.companyIdx,
      company_name: org.companyName,
      reg_date: org.regDate,
      mdy_date: org.mdyDate
    }));

    return NextResponse.json({
      success: true,
      data: organizationsData
    });
    
  } catch (error) {
    console.error('컨소시엄 기관 조회 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 기관 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 컨소시엄 기관 추가
export async function POST(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      projectPlanningId,
      year = 1, // 연차 정보 추가
      organizationType,
      organizationName,
      roleDescription
    } = body;

    if (!projectPlanningId || !organizationType || !organizationName) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const organization = await prisma.projectConsortiumOrganization.create({
      data: {
        projectPlanningId: parseInt(projectPlanningId),
        year: parseInt(year), // 연차 정보 추가
        organizationType,
        organizationName,
        roleDescription: roleDescription || '',
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName,
        regDate: currentTimestamp,
        mdyDate: currentTimestamp,
        isFlag: 1
      }
    });

    return NextResponse.json({
      success: true,
      message: '컨소시엄 기관이 성공적으로 추가되었습니다.',
      data: {
        id: organization.id,
        project_planning_id: organization.projectPlanningId,
        year: organization.year,
        organization_type: organization.organizationType,
        organization_name: organization.organizationName,
        role_description: organization.roleDescription
      }
    });

  } catch (error) {
    console.error('컨소시엄 기관 추가 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 기관 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 컨소시엄 기관 수정
export async function PUT(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      id,
      organizationType,
      organizationName,
      roleDescription
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '기관 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const organization = await prisma.projectConsortiumOrganization.update({
      where: { 
        id: parseInt(id),
        companyIdx: memberInfo.companyIdx
      },
      data: {
        organizationType: organizationType || '',
        organizationName: organizationName || '',
        roleDescription: roleDescription || '',
        mdyDate: currentTimestamp
      }
    });

    return NextResponse.json({
      success: true,
      message: '컨소시엄 기관이 성공적으로 수정되었습니다.',
      data: {
        id: organization.id,
        project_planning_id: organization.projectPlanningId,
        year: organization.year,
        organization_type: organization.organizationType,
        organization_name: organization.organizationName,
        role_description: organization.roleDescription
      }
    });

  } catch (error) {
    console.error('컨소시엄 기관 수정 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 기관 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 컨소시엄 기관 삭제
export async function DELETE(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: '기관 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await prisma.projectConsortiumOrganization.update({
      where: { 
        id: parseInt(id),
        companyIdx: memberInfo.companyIdx
      },
      data: {
        isFlag: 0,
        mdyDate: Math.floor(Date.now() / 1000)
      }
    });

    return NextResponse.json({
      success: true,
      message: '컨소시엄 기관이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('컨소시엄 기관 삭제 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 기관 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 

// PATCH: 연차별 컨소시엄 기관 자동 복사
export async function PATCH(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      projectPlanningId,
      sourceYear = 1, // 복사할 원본 연차
      targetYears = [] // 복사할 대상 연차들
    } = body;

    console.log('기관 복사 요청:', { projectPlanningId, sourceYear, targetYears });

    if (!projectPlanningId || !targetYears || targetYears.length === 0) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 원본 연차의 컨소시엄 기관들 조회
    const sourceOrganizations = await prisma.projectConsortiumOrganization.findMany({
      where: {
        projectPlanningId: parseInt(projectPlanningId),
        year: parseInt(sourceYear),
        isFlag: 1
      }
    });

    console.log('원본 기관 데이터:', { count: sourceOrganizations.length, sourceYear });

    if (sourceOrganizations.length === 0) {
      return NextResponse.json({
        success: false,
        error: '복사할 원본 데이터가 없습니다.'
      }, { status: 400 });
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const copiedOrganizations = [];

    // 각 대상 연차에 대해 기관 복사
    for (const targetYear of targetYears) {
      console.log(`${targetYear}차년도 기관 복사 시작`);
      
      // 기존 데이터가 있다면 삭제 (덮어쓰기)
      const deletedCount = await prisma.projectConsortiumOrganization.updateMany({
        where: {
          projectPlanningId: parseInt(projectPlanningId),
          year: parseInt(targetYear),
          isFlag: 1
        },
        data: {
          isFlag: 0,
          mdyDate: currentTimestamp
        }
      });

      console.log(`${targetYear}차년도 기존 데이터 삭제:`, deletedCount);

      // 잠시 대기하여 데이터베이스 업데이트 완료 보장
      await new Promise(resolve => setTimeout(resolve, 100));

      // 새로운 기관 데이터 생성
      for (const sourceOrg of sourceOrganizations) {
        const newOrganization = await prisma.projectConsortiumOrganization.create({
          data: {
            projectPlanningId: sourceOrg.projectPlanningId,
            year: parseInt(targetYear),
            organizationType: sourceOrg.organizationType,
            organizationName: sourceOrg.organizationName,
            roleDescription: sourceOrg.roleDescription,
            memberIdx: memberInfo.memberIdx,
            memberName: memberInfo.memberName,
            companyIdx: memberInfo.companyIdx,
            companyName: memberInfo.companyName,
            regDate: currentTimestamp,
            mdyDate: currentTimestamp,
            isFlag: 1
          }
        });

        copiedOrganizations.push({
          id: newOrganization.id,
          project_planning_id: newOrganization.projectPlanningId,
          year: newOrganization.year,
          organization_type: newOrganization.organizationType,
          organization_name: newOrganization.organizationName,
          role_description: newOrganization.roleDescription
        });
      }

      console.log(`${targetYear}차년도 기관 복사 완료:`, copiedOrganizations.length);
    }

    console.log('전체 기관 복사 완료:', { totalCopied: copiedOrganizations.length });

    return NextResponse.json({
      success: true,
      message: `${sourceYear}차년도 컨소시엄 기관이 ${targetYears.join(', ')}차년도에 성공적으로 복사되었습니다.`,
      data: {
        sourceYear: parseInt(sourceYear),
        targetYears: targetYears.map((y: string) => parseInt(y)),
        copiedCount: copiedOrganizations.length,
        copiedOrganizations
      }
    });

  } catch (error) {
    console.error('컨소시엄 기관 복사 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 기관 복사 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 