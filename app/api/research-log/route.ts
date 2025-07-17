import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getMemberInfoFromRequest } from '@/lib/server_func'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    if (!projectId) {
      return NextResponse.json({ error: '프로젝트 ID가 필요합니다.' }, { status: 400 })
    }

    // 연구일지 목록 조회 (projectId로 직접 조회)
    const [logs, total] = await Promise.all([
      prisma.researchLog.findMany({
        where: {
          projectTitle: {
            contains: projectId
          }
        },
        orderBy: { date: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.researchLog.count({
        where: {
          projectTitle: {
            contains: projectId
          }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('연구일지 조회 오류:', error)
    return NextResponse.json({ error: '연구일지 조회 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userInfo = getMemberInfoFromRequest(request)
    if (!userInfo) {
      return NextResponse.json({ error: '사용자 정보를 가져올 수 없습니다.' }, { status: 401 })
    }

    const body = await request.json()
    const { date, title, author, projectId, content, category, attachments } = body

    if (!date || !title || !author || !projectId) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 })
    }

    // 연구일지 생성 (projectId를 projectTitle로 사용)
    const researchLog = await prisma.researchLog.create({
      data: {
        date: new Date(date),
        title,
        author,
        projectTitle: `Project ${projectId}`,
        fileCount: attachments?.length || 0
      }
    })

    // 연구 기록도 함께 생성
    if (content) {
      await prisma.researchRecord.create({
        data: {
          recordDate: new Date(date),
          title,
          content,
          author,
          projectTitle: `Project ${projectId}`,
          experimentType: category,
          participants: author,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: researchLog
    })
  } catch (error) {
    console.error('연구일지 생성 오류:', error)
    return NextResponse.json({ error: '연구일지 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }
} 