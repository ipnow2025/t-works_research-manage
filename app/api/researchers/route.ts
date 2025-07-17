import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - 연구자 목록 조회 (검색 기능 + 페이지네이션 포함)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''
    const position = searchParams.get('position') || ''
    const status = searchParams.get('status') || 'active'
    
    // 페이지네이션 파라미터
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Prisma where 조건 생성
    const where: any = {
      deletedAt: null,
    }
    if (status) where.status = status
    if (search) where.name = { contains: search }
    if (department) where.department = department
    if (position) where.position = position

    // 전체 카운트 조회
    const total = await prisma.manageResearcher.count({ where })

    // 페이지네이션이 적용된 데이터 조회
    const researchers = await prisma.manageResearcher.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    })

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: researchers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    })
  } catch (error) {
    console.error('Error fetching researchers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch researchers' },
      { status: 500 }
    )
  }
}

// POST - 새 연구자 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      department,
      position,
      email,
      phone,
      age,
      gender = '남성',
      degree,
      lab,
      labUrl,
      education = [],
      researchAreas = [],
      publications = [],
      patents = [],
      awards = []
    } = body

    // 필수 필드 검증
    if (!name || !department || !position || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // 이메일 중복 검사
    const existingResearcher = await prisma.manageResearcher.findFirst({
      where: { email, deletedAt: null }
    })
    if (existingResearcher) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      )
    }

    // 새 연구자 등록
    const newResearcher = await prisma.manageResearcher.create({
      data: {
        name,
        department,
        position,
        email,
        phone,
        age: age || null,
        gender,
        degree: degree || null,
        lab: lab || null,
        labUrl: labUrl || null,
        education,
        researchAreas,
        publications,
        patents,
        awards,
        status: 'active',
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Researcher created successfully',
      data: newResearcher
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating researcher:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create researcher' },
      { status: 500 }
    )
  }
} 