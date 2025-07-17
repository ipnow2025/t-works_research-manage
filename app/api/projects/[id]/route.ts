import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      type,
      organization,
      pi,
      startDate,
      endDate,
      budget,
      description
    } = body
    const id = parseInt(params.id)
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.companyIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // ID 유효성 검증
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }
    
    // 필수 필드 검증
    if (!name || !type || !organization || !pi || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // 존재 확인 및 권한 체크
    const where: any = { 
      id, 
      companyIdx: memberInfo.companyIdx,
      isFlag: 1 
    }
    
    const existing = await prisma.manageProject.findFirst({ where })
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // 상태 결정
    let status = '기획중'
    if (type === 'application') status = '신청완료'
    else if (type === 'ongoing') status = '진행중'

    const updatedProject = await prisma.manageProject.update({
      where: { id },
      data: {
        name,
        type,
        organization,
        piName: pi,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: budget ? parseInt(budget) : null,
        description: description || null,
        status,
        mdyDate: Math.floor(Date.now() / 1000)
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      data: updatedProject
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
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

    // ID 유효성 검증
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // 존재 확인 및 권한 체크
    const where: any = { 
      id, 
      companyIdx: memberInfo.companyIdx,
      isFlag: 1 
    }
    
    const existing = await prisma.manageProject.findFirst({ where })
    
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Soft delete
    await prisma.manageProject.update({
      where: { id },
      data: {
        isFlag: 0,
        mdyDate: Math.floor(Date.now() / 1000)
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
} 