import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - 특정 연구자 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const researcherId = Number(id);

    if (isNaN(researcherId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 연구자 ID입니다." },
        { status: 400 }
      );
    }

    const researcher = await prisma.researcher.findUnique({
      where: { id: researcherId },
    });

    if (!researcher) {
      return NextResponse.json(
        { success: false, message: "연구자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: researcher,
    });
  } catch (error) {
    console.error("연구자 조회 오류:", error);
    return NextResponse.json(
      { success: false, message: "연구자 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const researcherId = Number(id);
    const body = await request.json();

    if (isNaN(researcherId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 연구자 ID입니다." },
        { status: 400 }
      );
    }

    const updatedResearcher = await prisma.researcher.update({
      where: { id: researcherId },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedResearcher,
    });
  } catch (error) {
    console.error("연구자 수정 오류:", error);
    return NextResponse.json(
      { success: false, message: "연구자 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const researcherId = Number(id);

    if (isNaN(researcherId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 연구자 ID입니다." },
        { status: 400 }
      );
    }

    await prisma.researcher.delete({
      where: { id: researcherId },
    });

    return NextResponse.json({
      success: true,
      message: "연구자가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("연구자 삭제 오류:", error);
    return NextResponse.json(
      { success: false, message: "연구자 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 