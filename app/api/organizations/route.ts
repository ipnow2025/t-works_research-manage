import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

export async function GET(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.companyIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const where: any = { 
      companyIdx: memberInfo.companyIdx,
      isFlag: 1 
    }
    
    const organizations = await prisma.manageOrganization.findMany({
      where,
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json({ success: true, data: organizations })
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.companyIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    // 중복 체크 (같은 회사 내에서)
    const where: any = { 
      name: name.trim(), 
      companyIdx: memberInfo.companyIdx,
      isFlag: 1 
    }
    
    const existing = await prisma.manageOrganization.findFirst({ where })
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Organization already exists' },
        { status: 400 }
      )
    }

    const result = await prisma.manageOrganization.create({
      data: {
        name: name.trim(),
        memberIdx: memberInfo?.memberIdx || null,
        memberName: memberInfo?.memberName || null,
        companyIdx: memberInfo?.companyIdx || null,
        companyName: memberInfo?.companyName || null,
        regDate: Math.floor(Date.now() / 1000),
        mdyDate: Math.floor(Date.now() / 1000)
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        id: result.id, 
        name: result.name,
        member_idx: result.memberIdx,
        member_name: result.memberName
      }
    })
  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create organization' },
      { status: 500 }
    )
  }
} 