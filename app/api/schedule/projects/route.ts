import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "프로젝트 ID가 필요합니다." },
        { status: 400 }
      )
    }

    const projects = await prisma.scheduleProject.findMany({
      where: {
        id: parseInt(projectId),
        deletedAt: null,
      },
      include: {
        schedules: {
          where: {
            deletedAt: null,
          },
          include: {
            type: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch (error) {
    console.error("일정 프로젝트 조회 오류:", error)
    return NextResponse.json(
      { success: false, message: "일정 프로젝트 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      memberIdx,
      memberName,
      companyIdx,
      companyName,
    } = body

    const project = await prisma.scheduleProject.create({
      data: {
        name,
        description,
        memberIdx,
        memberName,
        companyIdx,
        companyName,
      },
    })

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error("일정 프로젝트 생성 오류:", error)
    return NextResponse.json(
      { success: false, message: "일정 프로젝트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 