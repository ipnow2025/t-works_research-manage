import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// PUT: 작업 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id, taskId } = await params;
    const projectId = parseInt(id);
    const taskIdx = parseInt(taskId);
    
    if (isNaN(projectId) || isNaN(taskIdx)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 ID입니다.' },
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

    // 작업 존재 확인 및 권한 체크
    const existingTask = await prisma.projectTasks.findFirst({
      where: { 
        idx: taskIdx,
        projectPlanningId: projectId,
        companyIdx: memberInfo.companyIdx,
        isFlag: 1 
      }
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: '작업을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, start_date, due_date, status } = body;

    // title이 제공되지 않은 경우 기존 제목 사용
    const updatedTitle = title ? title.trim() : existingTask.title;
    
    if (!updatedTitle) {
      return NextResponse.json(
        { success: false, error: '작업 제목은 필수입니다.' },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    // 작업 수정
    const updatedTask = await prisma.projectTasks.update({
      where: { idx: taskIdx },
      data: {
        title: updatedTitle,
        description: description !== undefined ? description : existingTask.description,
        startDate: start_date ? Math.floor(new Date(start_date).getTime() / 1000) : existingTask.startDate,
        dueDate: due_date ? Math.floor(new Date(due_date).getTime() / 1000) : existingTask.dueDate,
        status: status || existingTask.status,
        mdyDate: currentTimestamp
      }
    });

    return NextResponse.json({
      success: true,
      message: '작업이 성공적으로 수정되었습니다.',
      data: {
        id: updatedTask.idx,
        title: updatedTask.title,
        description: updatedTask.description,
        start_date: updatedTask.startDate,
        due_date: updatedTask.dueDate,
        status: updatedTask.status
      }
    });

  } catch (error) {
    console.error('작업 수정 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '작업 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 작업 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id, taskId } = await params;
    const projectId = parseInt(id);
    const taskIdx = parseInt(taskId);
    
    if (isNaN(projectId) || isNaN(taskIdx)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 ID입니다.' },
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

    // 작업 존재 확인 및 권한 체크
    const existingTask = await prisma.projectTasks.findFirst({
      where: { 
        idx: taskIdx,
        projectPlanningId: projectId,
        companyIdx: memberInfo.companyIdx,
        isFlag: 1 
      }
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: '작업을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 작업 삭제 (soft delete)
    await prisma.projectTasks.update({
      where: { idx: taskIdx },
      data: { 
        isFlag: 0,
        mdyDate: Math.floor(Date.now() / 1000)
      }
    });

    return NextResponse.json({
      success: true,
      message: '작업이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('작업 삭제 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '작업 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 