import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getMemberInfoFromRequest } from "@/lib/server_func"

export async function GET(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request)
    
    if (!memberInfo || !memberInfo.companyIdx) {
      return NextResponse.json(
        { success: false, message: "회사 정보를 찾을 수 없습니다." },
        { status: 401 }
      )
    }

    let types = await prisma.projectScheduleType.findMany({
      where: {
        companyIdx: memberInfo.companyIdx,
        deletedAt: null,
      },
      orderBy: {
        category: "asc",
      },
    })

    // 타입이 없으면 기본 타입들을 생성
    if (types.length === 0) {
      const defaultTypes = [
        { category: "회의", color: "#3B82F6" },
        { category: "마감일", color: "#EF4444" },
        { category: "마일스톤", color: "#10B981" },
        { category: "기타", color: "#6B7280" },
      ]

      for (const defaultType of defaultTypes) {
        await prisma.projectScheduleType.create({
          data: {
            ...defaultType,
            memberIdx: memberInfo.memberIdx,
            memberName: memberInfo.memberName,
            companyIdx: memberInfo.companyIdx,
            companyName: memberInfo.companyName,
          },
        })
      }

      // 생성된 타입들을 다시 조회
      types = await prisma.projectScheduleType.findMany({
        where: {
          companyIdx: memberInfo.companyIdx,
          deletedAt: null,
        },
        orderBy: {
          category: "asc",
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: types,
    })
  } catch (error) {
    console.error("일정 타입 조회 오류:", error)
    return NextResponse.json(
      { success: false, message: "일정 타입 조회 중 오류가 발생했습니다." },
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
      category,
      color,
    } = body

    const type = await prisma.projectScheduleType.create({
      data: {
        category,
        color,
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName,
      },
    })

    return NextResponse.json({
      success: true,
      data: type,
    })
  } catch (error) {
    console.error("일정 타입 생성 오류:", error)
    return NextResponse.json(
      { success: false, message: "일정 타입 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 