import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 특정 KPI 실적 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const resultId = parseInt(resolvedParams.id);

    if (isNaN(resultId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 KPI 실적 ID입니다.' },
        { status: 400 }
      );
    }

    const kpiResult = await prisma.projectKpiResult.findUnique({
      where: { id: resultId }
    });

    if (!kpiResult) {
      return NextResponse.json(
        { success: false, error: 'KPI 실적을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: kpiResult.id,
        project_id: kpiResult.projectId,
        year: kpiResult.year,
        kpi_type: kpiResult.kpiType,
        actual_value: kpiResult.actualValue,
        achievement_date: kpiResult.achievementDate,
        description: kpiResult.description,
        attachment_files: kpiResult.attachmentFiles,
        member_name: kpiResult.memberName,
        created_at: kpiResult.createdAt,
        updated_at: kpiResult.updatedAt
      }
    });

  } catch (error) {
    console.error('KPI 실적 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 실적 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: KPI 실적 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const resultId = parseInt(resolvedParams.id);
    const body = await request.json();
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(resultId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 KPI 실적 ID입니다.' },
        { status: 400 }
      );
    }

    const { year, kpiType, actualValue, achievementDate, description, attachmentFiles } = body;

    if (!year || !kpiType || actualValue === undefined) {
      return NextResponse.json(
        { success: false, error: '연도, KPI 타입, 실적값은 필수입니다.' },
        { status: 400 }
      );
    }

    const updatedKpiResult = await prisma.projectKpiResult.update({
      where: { id: resultId },
      data: {
        year: parseInt(year),
        kpiType,
        actualValue: parseInt(actualValue),
        achievementDate: achievementDate ? new Date(achievementDate) : null,
        description: description || '',
        attachmentFiles: attachmentFiles || null
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedKpiResult.id,
        project_id: updatedKpiResult.projectId,
        year: updatedKpiResult.year,
        kpi_type: updatedKpiResult.kpiType,
        actual_value: updatedKpiResult.actualValue,
        achievement_date: updatedKpiResult.achievementDate,
        description: updatedKpiResult.description,
        attachment_files: updatedKpiResult.attachmentFiles,
        member_name: updatedKpiResult.memberName,
        created_at: updatedKpiResult.createdAt,
        updated_at: updatedKpiResult.updatedAt
      }
    });

  } catch (error) {
    console.error('KPI 실적 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 실적 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: KPI 실적 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const resultId = parseInt(resolvedParams.id);
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(resultId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 KPI 실적 ID입니다.' },
        { status: 400 }
      );
    }

    await prisma.projectKpiResult.delete({
      where: { id: resultId }
    });

    return NextResponse.json({
      success: true,
      message: 'KPI 실적이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('KPI 실적 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 실적 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 