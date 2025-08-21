import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 컨소시엄 구성원 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const organizationId = searchParams.get('organizationId')
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

    if (organizationId) {
      where.organizationId = parseInt(organizationId)
    }

    const members = await prisma.projectConsortiumMember.findMany({
      where,
      orderBy: { regDate: 'asc' }
    });

    const membersData = members.map((member: any) => ({
      id: member.id,
      organization_id: member.organizationId,
      project_planning_id: member.projectPlanningId,
      year: member.year, // 연차 정보 추가
      member_name: member.memberName,
      position: member.position,
      role: member.role,
      phone: member.phone,
      mobile: member.mobile,
      email: member.email,
      company_idx: member.companyIdx,
      company_name: member.companyName,
      reg_date: member.regDate,
      mdy_date: member.mdyDate
    }));

    return NextResponse.json({
      success: true,
      data: membersData
    });
    
  } catch (error) {
    console.error('컨소시엄 구성원 조회 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 구성원 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 컨소시엄 구성원 추가
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
      organizationId,
      projectPlanningId,
      year = 1, // 연차 정보 추가
      memberName,
      position,
      role,
      phone,
      mobile,
      email
    } = body;

    if (!organizationId || !projectPlanningId || !memberName) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const member = await prisma.projectConsortiumMember.create({
      data: {
        organizationId: parseInt(organizationId),
        projectPlanningId: parseInt(projectPlanningId),
        year: parseInt(year), // 연차 정보 추가
        memberName,
        position: position || '',
        role: role || '',
        phone: phone || '',
        mobile: mobile || '',
        email: email || '',
        memberIdx: memberInfo.memberIdx,
        memberNameCreator: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName,
        regDate: currentTimestamp,
        mdyDate: currentTimestamp,
        isFlag: 1
      }
    });

    return NextResponse.json({
      success: true,
      message: '컨소시엄 구성원이 성공적으로 추가되었습니다.',
      data: {
        id: member.id,
        organization_id: member.organizationId,
        project_planning_id: member.projectPlanningId,
        member_name: member.memberName,
        position: member.position,
        role: member.role,
        phone: member.phone,
        mobile: member.mobile,
        email: member.email
      }
    });

  } catch (error) {
    console.error('컨소시엄 구성원 추가 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 구성원 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 컨소시엄 구성원 수정
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
      memberName,
      position,
      role,
      phone,
      mobile,
      email
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '구성원 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const member = await prisma.projectConsortiumMember.update({
      where: { 
        id: parseInt(id),
        companyIdx: memberInfo.companyIdx
      },
      data: {
        memberName: memberName || '',
        position: position || '',
        role: role || '',
        phone: phone || '',
        mobile: mobile || '',
        email: email || '',
        mdyDate: currentTimestamp
      }
    });

    return NextResponse.json({
      success: true,
      message: '컨소시엄 구성원이 성공적으로 수정되었습니다.',
      data: {
        id: member.id,
        organization_id: member.organizationId,
        project_planning_id: member.projectPlanningId,
        year: member.year,
        member_name: member.memberName,
        position: member.position,
        role: member.role,
        phone: member.phone,
        mobile: member.mobile,
        email: member.email
      }
    });

  } catch (error) {
    console.error('컨소시엄 구성원 수정 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 구성원 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 컨소시엄 구성원 삭제
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
        { success: false, error: '구성원 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await prisma.projectConsortiumMember.update({
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
      message: '컨소시엄 구성원이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('컨소시엄 구성원 삭제 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 구성원 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 

// PATCH: 연차별 컨소시엄 구성원 자동 복사
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

    console.log('구성원 복사 요청:', { projectPlanningId, sourceYear, targetYears });

    if (!projectPlanningId || !targetYears || targetYears.length === 0) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 원본 연차의 컨소시엄 구성원들 조회
    const sourceMembers = await prisma.projectConsortiumMember.findMany({
      where: {
        projectPlanningId: parseInt(projectPlanningId),
        year: parseInt(sourceYear),
        isFlag: 1
      }
    });

    console.log('원본 구성원 데이터:', { count: sourceMembers.length, sourceYear });

    if (sourceMembers.length === 0) {
      return NextResponse.json({
        success: false,
        error: '복사할 원본 데이터가 없습니다.'
      }, { status: 400 });
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const copiedMembers = [];

    // 각 대상 연차에 대해 구성원 복사
    for (const targetYear of targetYears) {
      console.log(`${targetYear}차년도 구성원 복사 시작`);
      
      // 기존 데이터가 있다면 삭제 (덮어쓰기)
      const deletedCount = await prisma.projectConsortiumMember.updateMany({
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

      console.log(`${targetYear}차년도 기존 구성원 데이터 삭제:`, deletedCount);

      // 잠시 대기하여 데이터베이스 업데이트 완료 보장
      await new Promise(resolve => setTimeout(resolve, 100));

      // 새로운 구성원 데이터 생성
      for (const sourceMember of sourceMembers) {
        const newMember = await prisma.projectConsortiumMember.create({
          data: {
            organizationId: sourceMember.organizationId,
            projectPlanningId: sourceMember.projectPlanningId,
            year: parseInt(targetYear),
            memberName: sourceMember.memberName,
            position: sourceMember.position,
            role: sourceMember.role,
            phone: sourceMember.phone,
            mobile: sourceMember.mobile,
            email: sourceMember.email,
            memberIdx: memberInfo.memberIdx,
            memberNameCreator: memberInfo.memberName,
            companyIdx: memberInfo.companyIdx,
            companyName: memberInfo.companyName,
            regDate: currentTimestamp,
            mdyDate: currentTimestamp,
            isFlag: 1
          }
        });

        copiedMembers.push({
          id: newMember.id,
          organization_id: newMember.organizationId,
          project_planning_id: newMember.projectPlanningId,
          year: newMember.year,
          member_name: newMember.memberName,
          position: newMember.position,
          role: newMember.role,
          phone: newMember.phone,
          mobile: newMember.mobile,
          email: newMember.email
        });
      }

      console.log(`${targetYear}차년도 구성원 복사 완료:`, copiedMembers.length);
    }

    console.log('전체 구성원 복사 완료:', { totalCopied: copiedMembers.length });

    return NextResponse.json({
      success: true,
      message: `${sourceYear}차년도 컨소시엄 구성원이 ${targetYears.join(', ')}차년도에 성공적으로 복사되었습니다.`,
      data: {
        sourceYear: parseInt(sourceYear),
        targetYears: targetYears.map(y => parseInt(y)),
        copiedCount: copiedMembers.length,
        copiedMembers
      }
    });

  } catch (error) {
    console.error('컨소시엄 구성원 복사 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 구성원 복사 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 