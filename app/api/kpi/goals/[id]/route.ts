import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 특정 KPI 목표 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const goalId = parseInt(resolvedParams.id);

    if (isNaN(goalId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 KPI 목표 ID입니다.' },
        { status: 400 }
      );
    }

    const kpiGoal = await prisma.projectKpiGoal.findUnique({
      where: { id: goalId }
    });

    if (!kpiGoal) {
      return NextResponse.json(
        { success: false, error: 'KPI 목표를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: kpiGoal.id,
        project_id: kpiGoal.projectId,
        year: kpiGoal.year,
        kpi_type: kpiGoal.kpiType,
        target_value: kpiGoal.targetValue,
        description: kpiGoal.description,
        member_name: kpiGoal.memberName,
        created_at: kpiGoal.createdAt,
        updated_at: kpiGoal.updatedAt
      }
    });

  } catch (error) {
    console.error('KPI 목표 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 목표 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: KPI 목표 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const goalId = parseInt(resolvedParams.id);
    const body = await request.json();
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(goalId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 KPI 목표 ID입니다.' },
        { status: 400 }
      );
    }

    const { year, kpiType, targetValue, description } = body;

    if (!year || !kpiType || targetValue === undefined) {
      return NextResponse.json(
        { success: false, error: '연도, KPI 타입, 목표값은 필수입니다.' },
        { status: 400 }
      );
    }

    const updatedKpiGoal = await prisma.projectKpiGoal.update({
      where: { id: goalId },
      data: {
        year: parseInt(year),
        kpiType,
        targetValue: parseInt(targetValue),
        description: description || ''
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedKpiGoal.id,
        project_id: updatedKpiGoal.projectId,
        year: updatedKpiGoal.year,
        kpi_type: updatedKpiGoal.kpiType,
        target_value: updatedKpiGoal.targetValue,
        description: updatedKpiGoal.description,
        member_name: updatedKpiGoal.memberName,
        created_at: updatedKpiGoal.createdAt,
        updated_at: updatedKpiGoal.updatedAt
      }
    });

  } catch (error) {
    console.error('KPI 목표 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 목표 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: KPI 목표 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const goalId = parseInt(resolvedParams.id);
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(goalId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 KPI 목표 ID입니다.' },
        { status: 400 }
      );
    }

    await prisma.projectKpiGoal.delete({
      where: { id: goalId }
    });

    return NextResponse.json({
      success: true,
      message: 'KPI 목표가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('KPI 목표 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 목표 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 