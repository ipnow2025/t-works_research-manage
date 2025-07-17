import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 특정 진행중 프로젝트 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const projectId = parseInt(resolvedParams.id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 프로젝트 ID입니다.' },
        { status: 400 }
      );
    }

    const project = await prisma.manageProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // snake_case로 변환하여 반환
    const projectData = {
      id: project.id,
      project_name: project.name,
      type: project.type,
      organization: project.organization,
      pi_name: project.piName,
      start_date: project.startDate,
      end_date: project.endDate,
      budget: project.budget,
      description: project.description,
      status: project.status,
      member_idx: project.memberIdx,
      member_name: project.memberName,
      company_idx: project.companyIdx,
      company_name: project.companyName,
      reg_date: project.regDate,
      mdy_date: project.mdyDate
    };

    return NextResponse.json({
      success: true,
      data: projectData
    });

  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '프로젝트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 