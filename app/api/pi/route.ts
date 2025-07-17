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
    
    const researchers = await prisma.managePi.findMany({
      where,
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json({ success: true, data: researchers })
  } catch (error) {
    console.error('Error fetching researchers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch researchers' },
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
    
    const existing = await prisma.managePi.findFirst({ where })
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Researcher already exists' },
        { status: 400 }
      )
    }

    const result = await prisma.managePi.create({
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
    console.error('Error creating researcher:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create researcher' },
      { status: 500 }
    )
  }
} 