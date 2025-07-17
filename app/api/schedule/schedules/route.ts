import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getMemberInfoFromRequest } from "@/lib/server_func"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const month = searchParams.get("month") // 0-11 (0 = January)
    const year = searchParams.get("year")

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "프로젝트 ID가 필요합니다." },
        { status: 400 }
      )
    }

    let whereCondition: any = {
      projectId: parseInt(projectId),
      deletedAt: null,
    }

    // 월과 년도가 지정된 경우 해당 월의 일정만 조회
    if (month !== null && year !== null) {
      const startDate = new Date(parseInt(year), parseInt(month), 1)
      const endDate = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59)
      
      whereCondition.startDate = {
        gte: startDate,
        lte: endDate,
      }
    }

    const schedules = await prisma.projectScheduleSchedule.findMany({
      where: whereCondition,
      orderBy: {
        startDate: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      data: schedules,
    })
  } catch (error) {
    console.error("일정 조회 오류:", error)
    return NextResponse.json(
      { success: false, message: "일정 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const memberInfo = getMemberInfoFromRequest(request)
    
    if (!memberInfo) {
      return NextResponse.json(
        { success: false, message: "사용자 정보를 찾을 수 없습니다." },
        { status: 401 }
      )
    }

    const {
      title,
      description,
      startDate,
      endDate,
      category,
      location,
      participants,
      projectId,
      typeId,
      isAllDay = false,
    } = body

    const schedule = await prisma.projectScheduleSchedule.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        category,
        location,
        participants,
        projectId: parseInt(projectId),
        typeId: parseInt(typeId) || 1, // 기본값 1
        isAllDay,
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName,
      },
    })

    return NextResponse.json({
      success: true,
      data: schedule,
    })
  } catch (error) {
    console.error("일정 생성 오류:", error)
    return NextResponse.json(
      { success: false, message: "일정 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 