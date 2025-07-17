import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const organizationId = parseInt(id);

    if (isNaN(organizationId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 조직 ID입니다." },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, message: "조직을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error("조직 조회 오류:", error);
    return NextResponse.json(
      { success: false, message: "조직 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const organizationId = parseInt(id);
    const body = await request.json();

    if (isNaN(organizationId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 조직 ID입니다." },
        { status: 400 }
      );
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedOrganization,
    });
  } catch (error) {
    console.error("조직 수정 오류:", error);
    return NextResponse.json(
      { success: false, message: "조직 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.companyIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 존재 확인 및 권한 체크
    const where: any = { 
      id, 
      companyIdx: memberInfo.companyIdx,
      isFlag: 1 
    }
    
    const existing = await prisma.manageOrganization.findFirst({ where })
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Organization not found or access denied' },
        { status: 404 }
      )
    }

    // Soft delete
    await prisma.manageOrganization.update({
      where: { id },
      data: {
        isFlag: 0,
        mdyDate: Math.floor(Date.now() / 1000)
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting organization:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete organization' },
      { status: 500 }
    )
  }
} 