import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 특정 컨소시엄 기관 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orgId = parseInt(id);

    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(orgId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 기관 ID입니다.' },
        { status: 400 }
      );
    }

    const organization = await prisma.projectConsortiumOrganization.findFirst({
      where: { 
        id: orgId,
        companyIdx: memberInfo.companyIdx,
        isFlag: 1
      }
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: '기관을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
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
    console.error('컨소시엄 기관 조회 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '컨소시엄 기관 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 컨소시엄 기관 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orgId = parseInt(id);
    const body = await request.json();

    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(orgId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 기관 ID입니다.' },
        { status: 400 }
      );
    }

    const {
      organizationType,
      organizationName,
      roleDescription
    } = body;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const organization = await prisma.projectConsortiumOrganization.update({
      where: { 
        id: orgId,
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orgId = parseInt(id);

    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(orgId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 기관 ID입니다.' },
        { status: 400 }
      );
    }

    await prisma.projectConsortiumOrganization.update({
      where: { 
        id: orgId,
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