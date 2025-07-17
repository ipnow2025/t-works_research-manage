import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getMemberInfoFromRequest } from '@/lib/server_func'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const researchLog = await prisma.researchLog.findUnique({
      where: { id: parseInt(id) }
    })

    if (!researchLog) {
      return NextResponse.json({ error: '연구일지를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: researchLog
    })
  } catch (error) {
    console.error('연구일지 조회 오류:', error)
    return NextResponse.json({ error: '연구일지 조회 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInfo = getMemberInfoFromRequest(request)
    if (!userInfo) {
      return NextResponse.json({ error: '사용자 정보를 가져올 수 없습니다.' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { date, title, author, content, category, attachments } = body

    if (!date || !title || !author) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 })
    }

    const existingLog = await prisma.researchLog.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingLog) {
      return NextResponse.json({ error: '연구일지를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 연구일지 수정
    const updatedLog = await prisma.researchLog.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        title,
        author,
        fileCount: attachments?.length || 0
      }
    })

    // 연구 기록도 함께 수정
    if (content) {
      const existingRecord = await prisma.researchRecord.findFirst({
        where: {
          recordDate: existingLog.date,
          title: existingLog.title,
          author: existingLog.author
        }
      })

      if (existingRecord) {
        await prisma.researchRecord.update({
          where: { id: existingRecord.id },
          data: {
            recordDate: new Date(date),
            title,
            content,
            author,
            experimentType: category,
            participants: author,
            updatedAt: new Date()
          }
        })
      } else {
        await prisma.researchRecord.create({
          data: {
            recordDate: new Date(date),
            title,
            content,
            author,
            projectTitle: existingLog.projectTitle,
            experimentType: category,
            participants: author,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedLog
    })
  } catch (error) {
    console.error('연구일지 수정 오류:', error)
    return NextResponse.json({ error: '연구일지 수정 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInfo = getMemberInfoFromRequest(request)
    if (!userInfo) {
      return NextResponse.json({ error: '사용자 정보를 가져올 수 없습니다.' }, { status: 401 })
    }

    const { id } = await params

    const existingLog = await prisma.researchLog.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingLog) {
      return NextResponse.json({ error: '연구일지를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 연구일지 삭제
    await prisma.researchLog.delete({
      where: { id: parseInt(id) }
    })

    // 관련 연구 기록도 삭제
    await prisma.researchRecord.deleteMany({
      where: {
        recordDate: existingLog.date,
        title: existingLog.title,
        author: existingLog.author
      }
    })

    return NextResponse.json({
      success: true,
      message: '연구일지가 삭제되었습니다.'
    })
  } catch (error) {
    console.error('연구일지 삭제 오류:', error)
    return NextResponse.json({ error: '연구일지 삭제 중 오류가 발생했습니다.' }, { status: 500 })
  }
} 