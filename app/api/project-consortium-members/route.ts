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