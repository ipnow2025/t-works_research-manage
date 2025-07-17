import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 마일스톤 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const milestoneId = parseInt(resolvedParams.id);

    if (isNaN(milestoneId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 마일스톤 ID입니다." },
        { status: 400 }
      );
    }

    const milestone = await prisma.projectMilestones.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) {
      return NextResponse.json(
        { success: false, message: "마일스톤을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: milestone,
    });
  } catch (error) {
    console.error("마일스톤 조회 오류:", error);
    return NextResponse.json(
      { success: false, message: "마일스톤 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const milestoneId = parseInt(resolvedParams.id);
    const body = await request.json();

    if (isNaN(milestoneId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 마일스톤 ID입니다." },
        { status: 400 }
      );
    }

    // Transform snake_case to camelCase for Prisma
    const transformedData: any = {};
    
    if (body.title !== undefined) transformedData.title = body.title;
    if (body.description !== undefined) transformedData.description = body.description;
    if (body.status !== undefined) transformedData.status = body.status;
    if (body.due_date !== undefined) transformedData.dueDate = body.due_date ? new Date(body.due_date) : null;
    if (body.completion_date !== undefined) transformedData.completionDate = body.completion_date ? new Date(body.completion_date) : null;
    if (body.progress_percentage !== undefined) transformedData.progressPercentage = body.progress_percentage;
    if (body.priority !== undefined) transformedData.priority = body.priority;
    if (body.projectId !== undefined) transformedData.projectId = body.projectId;

    const updatedMilestone = await prisma.projectMilestones.update({
      where: { id: milestoneId },
      data: transformedData,
    });

    return NextResponse.json({
      success: true,
      data: updatedMilestone,
    });
  } catch (error) {
    console.error("마일스톤 수정 오류:", error);
    return NextResponse.json(
      { success: false, message: "마일스톤 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const milestoneId = parseInt(resolvedParams.id);

    if (isNaN(milestoneId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 마일스톤 ID입니다." },
        { status: 400 }
      );
    }

    await prisma.projectMilestones.delete({
      where: { id: milestoneId },
    });

    return NextResponse.json({
      success: true,
      message: "마일스톤이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("마일스톤 삭제 오류:", error);
    return NextResponse.json(
      { success: false, message: "마일스톤 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 