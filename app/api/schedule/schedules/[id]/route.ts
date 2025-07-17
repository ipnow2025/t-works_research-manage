import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getMemberInfoFromRequest } from "@/lib/server_func"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const memberInfo = getMemberInfoFromRequest(request)
    const { id } = await params
    
    if (!memberInfo) {
      return NextResponse.json(
        { success: false, message: "사용자 정보를 찾을 수 없습니다." },
        { status: 401 }
      )
    }

    const scheduleId = parseInt(id)
    
    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 일정 ID입니다." },
        { status: 400 }
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
      typeId,
      isAllDay = false,
    } = body

    // 기존 일정 확인
    const existingSchedule = await prisma.projectScheduleSchedule.findFirst({
      where: {
        id: scheduleId,
        deletedAt: null,
      },
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { success: false, message: "일정을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    const updatedSchedule = await prisma.projectScheduleSchedule.update({
      where: {
        id: scheduleId,
      },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        category,
        location,
        participants,
        typeId: parseInt(typeId) || 1,
        isAllDay,
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedSchedule,
    })
  } catch (error) {
    console.error("일정 수정 오류:", error)
    return NextResponse.json(
      { success: false, message: "일정 수정 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const memberInfo = getMemberInfoFromRequest(request)
    const { id } = await params
    
    if (!memberInfo) {
      return NextResponse.json(
        { success: false, message: "사용자 정보를 찾을 수 없습니다." },
        { status: 401 }
      )
    }

    const scheduleId = parseInt(id)
    
    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 일정 ID입니다." },
        { status: 400 }
      )
    }

    // 기존 일정 확인
    const existingSchedule = await prisma.projectScheduleSchedule.findFirst({
      where: {
        id: scheduleId,
        deletedAt: null,
      },
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { success: false, message: "일정을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 소프트 삭제 (deletedAt 필드 업데이트)
    await prisma.projectScheduleSchedule.update({
      where: {
        id: scheduleId,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "일정이 삭제되었습니다.",
    })
  } catch (error) {
    console.error("일정 삭제 오류:", error)
    return NextResponse.json(
      { success: false, message: "일정 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 