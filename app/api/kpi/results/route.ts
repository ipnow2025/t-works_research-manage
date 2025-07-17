import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: KPI 실적 목록 조회
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
    const kpiType = searchParams.get('kpiType');

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

    if (kpiType) {
      where.kpiType = kpiType;
    }

    const kpiResults = await prisma.projectKpiResult.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const kpiResultsData = kpiResults.map((result: any) => ({
      id: result.id,
      project_id: result.projectId,
      year: result.year,
      kpi_type: result.kpiType,
      actual_value: result.actualValue,
      achievement_date: result.achievementDate,
      description: result.description,
      attachment_files: result.attachmentFiles,
      member_name: result.memberName,
      created_at: result.createdAt,
      updated_at: result.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: kpiResultsData
    });

  } catch (error) {
    console.error('KPI 실적 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 실적 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: KPI 실적 생성
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
    const { projectId, year, kpiType, actualValue, achievementDate, description, attachmentFiles } = body;

    if (!projectId || !year || !kpiType || actualValue === undefined) {
      return NextResponse.json(
        { success: false, error: '프로젝트 ID, 연도, KPI 타입, 실적값은 필수입니다.' },
        { status: 400 }
      );
    }

    const kpiResult = await prisma.projectKpiResult.create({
      data: {
        projectId: parseInt(projectId),
        year: parseInt(year),
        kpiType,
        actualValue: parseInt(actualValue),
        achievementDate: achievementDate ? new Date(achievementDate) : null,
        description: description || '',
        attachmentFiles: attachmentFiles || null,
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName
      }
    });

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
    }, { status: 201 });

  } catch (error) {
    console.error('KPI 실적 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 실적 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 