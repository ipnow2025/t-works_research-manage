import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') || ''
    const organization = searchParams.get('organization') || ''
    const status = searchParams.get('status') || ''
    const searchQuery = searchParams.get('searchQuery') || ''
    
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

    if (year) {
      where.startDate = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${parseInt(year) + 1}-01-01`)
      }
    }

    if (organization) {
      where.organization = organization
    }

    if (status) {
      where.status = status
    }

    if (searchQuery) {
      where.name = { contains: searchQuery }
    }

    const projects = await prisma.manageProject.findMany({
      where,
      orderBy: { regDate: 'desc' }
    })
    
    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const memberInfo = getMemberInfoFromRequest(request);

    // 필수 필드 검증
    if (!name || !type || !organization || !pi || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // 상태 결정
    let status = '기획중'
    if (type === 'application') status = '신청완료'
    else if (type === 'ongoing') status = '진행중'

    const newProject = await prisma.manageProject.create({
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
      message: 'Project created successfully',
      data: newProject
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
} 