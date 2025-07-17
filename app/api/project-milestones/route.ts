import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 마일스톤 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "프로젝트 ID가 필요합니다." },
        { status: 400 }
      )
    }

    const milestones = await prisma.projectMilestones.findMany({
      where: {
        projectId: parseInt(projectId)
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: milestones
    })
  } catch (error) {
    console.error('마일스톤 목록 조회 오류:', error)
    return NextResponse.json(
      { success: false, error: "마일스톤 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// 마일스톤 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, title, description, status, due_date, completion_date, progress_percentage, priority } = body

    if (!projectId || !title) {
      return NextResponse.json(
        { success: false, error: "프로젝트 ID와 제목은 필수입니다." },
        { status: 400 }
      )
    }

    const milestone = await prisma.projectMilestones.create({
      data: {
        projectId: parseInt(projectId),
        title,
        description: description || null,
        status: status || 'PLANNED',
        dueDate: due_date ? new Date(due_date) : null,
        completionDate: completion_date ? new Date(completion_date) : null,
        priority: priority || 'MEDIUM',
        progressPercentage: progress_percentage || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: milestone
    })
  } catch (error) {
    console.error('마일스톤 생성 오류:', error)
    return NextResponse.json(
      { success: false, error: "마일스톤 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 