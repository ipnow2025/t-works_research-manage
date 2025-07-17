import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 프로젝트 작업 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 프로젝트 ID입니다.' },
        { status: 400 }
      );
    }

    // 프로젝트 존재 확인 및 권한 체크
    const project = await prisma.projectPlanning.findFirst({
      where: { 
        id: projectId,
        companyIdx: memberInfo.companyIdx, 
        isFlag: 1 
      }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 작업 목록 조회
    const tasks = await prisma.projectTasks.findMany({
      where: { 
        projectPlanningId: projectId,
        companyIdx: memberInfo.companyIdx,
        isFlag: 1 
      },
      orderBy: { regDate: 'desc' }
    });

    // 응답 데이터 변환
    const tasksData = tasks.map((task: any) => ({
      id: task.idx,
      title: task.title,
      description: task.description,
      start_date: task.startDate,
      due_date: task.dueDate,
      status: task.status,
      member_idx: task.memberIdx,
      member_name: task.memberName,
      company_idx: task.companyIdx,
      company_name: task.companyName,
      reg_date: task.regDate,
      mdy_date: task.mdyDate
    }));

    return NextResponse.json({
      success: true,
      data: tasksData
    });
    
  } catch (error) {
    console.error('작업 목록 조회 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '작업 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 작업 등록
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 프로젝트 ID입니다.' },
        { status: 400 }
      );
    }

    // 프로젝트 존재 확인 및 권한 체크
    const project = await prisma.projectPlanning.findFirst({
      where: { 
        id: projectId,
        companyIdx: memberInfo.companyIdx, 
        isFlag: 1 
      }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, start_date, due_date, status } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: '작업 제목은 필수입니다.' },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    // 작업 등록
    const task = await prisma.projectTasks.create({
      data: {
        projectPlanningId: projectId,
        title: title.trim(),
        description: description || null,
        startDate: start_date ? Math.floor(new Date(start_date).getTime() / 1000) : null,
        dueDate: due_date ? Math.floor(new Date(due_date).getTime() / 1000) : null,
        status: status || 'planned',
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName,
        regDate: currentTimestamp,
        mdyDate: currentTimestamp,
        isFlag: 1
      }
    });

    return NextResponse.json({
      success: true,
      message: '작업이 성공적으로 등록되었습니다.',
      data: {
        id: task.idx,
        title: task.title,
        description: task.description,
        start_date: task.startDate,
        due_date: task.dueDate,
        status: task.status
      }
    });

  } catch (error) {
    console.error('작업 등록 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '작업 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 