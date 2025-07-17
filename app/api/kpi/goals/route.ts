import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: KPI 목표 목록 조회
export async function GET(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const year = searchParams.get('year');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: '프로젝트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const where: any = {
      companyIdx: memberInfo.companyIdx,
      projectId: parseInt(projectId)
    };

    if (year) {
      where.year = parseInt(year);
    }

    const kpiGoals = await prisma.projectKpiGoal.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const kpiGoalsData = kpiGoals.map((goal: any) => ({
      id: goal.id,
      project_id: goal.projectId,
      year: goal.year,
      kpi_type: goal.kpiType,
      target_value: goal.targetValue,
      description: goal.description,
      member_name: goal.memberName,
      created_at: goal.createdAt,
      updated_at: goal.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: kpiGoalsData
    });

  } catch (error) {
    console.error('KPI 목표 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 목표 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: KPI 목표 생성
export async function POST(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId, year, kpiType, targetValue, description } = body;

    if (!projectId || !year || !kpiType || targetValue === undefined) {
      return NextResponse.json(
        { success: false, error: '프로젝트 ID, 연도, KPI 타입, 목표값은 필수입니다.' },
        { status: 400 }
      );
    }

    const kpiGoal = await prisma.projectKpiGoal.create({
      data: {
        projectId: parseInt(projectId),
        year: parseInt(year),
        kpiType,
        targetValue: parseInt(targetValue),
        description: description || '',
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName
      }
    });

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
    }, { status: 201 });

  } catch (error) {
    console.error('KPI 목표 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 목표 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 