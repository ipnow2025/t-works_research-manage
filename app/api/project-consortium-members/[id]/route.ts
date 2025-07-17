import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 특정 컨소시엄 구성원 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 구성원 ID입니다.' },
        { status: 400 }
      );
    }

    const member = await prisma.projectConsortiumMember.findFirst({
      where: { 
        id: memberId,
        companyIdx: memberInfo.companyIdx,
        isFlag: 1
      }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: '구성원을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
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
    console.error('컨소시엄 구성원 조회 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 구성원 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 컨소시엄 구성원 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);
    const body = await request.json();

    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 구성원 ID입니다.' },
        { status: 400 }
      );
    }

    const {
      memberName,
      position,
      role,
      phone,
      mobile,
      email
    } = body;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const member = await prisma.projectConsortiumMember.update({
      where: { 
        id: memberId,
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 구성원 ID입니다.' },
        { status: 400 }
      );
    }

    await prisma.projectConsortiumMember.update({
      where: { 
        id: memberId,
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