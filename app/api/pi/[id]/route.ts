import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const piId = parseInt(id);

    if (isNaN(piId)) {
      return NextResponse.json(
        { error: 'Invalid PI ID' },
        { status: 400 }
      );
    }

    const pi = await prisma.pi.findUnique({
      where: { id: piId },
    });

    if (!pi) {
      return NextResponse.json(
        { error: 'PI not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pi);
  } catch (error) {
    console.error('Error fetching PI:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PI' },
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
    const piId = parseInt(id);

    if (isNaN(piId)) {
      return NextResponse.json(
        { error: 'Invalid PI ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, phone, organization, position } = body;

    const updatedPi = await prisma.pi.update({
      where: { id: piId },
      data: {
        name,
        email,
        phone,
        organization,
        position,
      },
    });

    return NextResponse.json(updatedPi);
  } catch (error) {
    console.error('Error updating PI:', error);
    return NextResponse.json(
      { error: 'Failed to update PI' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const piId = parseInt(id);
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.companyIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 존재 확인 및 권한 체크
    const where: any = { 
      id: piId, 
      companyIdx: memberInfo.companyIdx,
      isFlag: 1 
    }
    
    const existing = await prisma.managePi.findFirst({ where })
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Researcher not found or access denied' },
        { status: 404 }
      )
    }

    // Soft delete
    await prisma.managePi.update({
      where: { id: piId },
      data: {
        isFlag: 0,
        mdyDate: Math.floor(Date.now() / 1000)
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting researcher:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete researcher' },
      { status: 500 }
    )
  }
} 