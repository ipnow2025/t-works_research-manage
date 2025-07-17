import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: KPI 타입 목록 조회
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

    const kpiTypes = await prisma.projectKpiType.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const kpiTypesData = kpiTypes.map((type: any) => ({
      idx: type.idx,
      name: type.name,
      description: type.description,
      unit: type.unit,
      project_id: type.projectId,
      created_at: type.createdAt,
      updated_at: type.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: kpiTypesData
    });

  } catch (error) {
    console.error('KPI 타입 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 타입 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: KPI 타입 생성
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
    const { projectId, name, description, unit } = body;

    if (!projectId || !name) {
      return NextResponse.json(
        { success: false, error: '프로젝트 ID와 이름은 필수입니다.' },
        { status: 400 }
      );
    }

    const kpiType = await prisma.projectKpiType.create({
      data: {
        projectId: parseInt(projectId),
        name,
        description: description || '',
        unit: unit || '',
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        idx: kpiType.idx,
        name: kpiType.name,
        description: kpiType.description,
        unit: kpiType.unit,
        project_id: kpiType.projectId,
        created_at: kpiType.createdAt,
        updated_at: kpiType.updatedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('KPI 타입 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: 'KPI 타입 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 