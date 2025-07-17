import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 특정 프로젝트 기획 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const projectId = parseInt(resolvedParams.id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 프로젝트 ID입니다." },
        { status: 400 }
      );
    }

    const project = await prisma.projectPlanning.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Prisma의 camelCase를 snake_case로 변환
    const projectData = {
      id: project.id,
      project_name: project.projectName,
      project_manager: project.projectManager,
      start_date: project.startDate,
      end_date: project.endDate,
      department: project.department,
      institution: project.institution,
      total_cost: project.totalCost,
      project_purpose: project.projectPurpose,
      project_details: project.projectDetails,
      announcement_link: project.announcementLink,
      attachment_files: project.attachmentFiles,
      status: project.status,
      application_date: project.applicationDate,
      member_idx: project.memberIdx,
      member_name: project.memberName,
      company_idx: project.companyIdx,
      company_name: project.companyName,
      is_flag: project.isFlag,
      reg_date: project.regDate,
      mdy_date: project.mdyDate,
      // 상태정보 필드들 추가
      performance_summary: project.performanceSummary,
      follow_up_actions: project.followUpActions,
      reapplication_possibility: project.reapplicationPossibility,
      improvement_direction: project.improvementDirection,
      status_info_updated_at: project.statusInfoUpdatedAt,
      status_info_updated_by: project.statusInfoUpdatedBy
    };

    return NextResponse.json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    console.error("프로젝트 조회 오류:", error);
    return NextResponse.json(
      { success: false, message: "프로젝트 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH: 상태정보 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const projectId = parseInt(resolvedParams.id);
    const body = await request.json();

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 프로젝트 ID입니다." },
        { status: 400 }
      );
    }

    // 현재 시간을 Unix timestamp로 변환
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // 상태정보 업데이트 데이터
    const updateData = {
      performanceSummary: body.performance_summary,
      followUpActions: body.follow_up_actions,
      reapplicationPossibility: body.reapplication_possibility,
      improvementDirection: body.improvement_direction,
      statusInfoUpdatedAt: currentTimestamp,
      statusInfoUpdatedBy: body.status_info_updated_by || 'system'
    };

    const updatedProject = await prisma.projectPlanning.update({
      where: { id: projectId },
      data: updateData,
    });

    // 응답도 snake_case로 변환
    const projectData = {
      id: updatedProject.id,
      project_name: updatedProject.projectName,
      project_manager: updatedProject.projectManager,
      start_date: updatedProject.startDate,
      end_date: updatedProject.endDate,
      department: updatedProject.department,
      institution: updatedProject.institution,
      total_cost: updatedProject.totalCost,
      project_purpose: updatedProject.projectPurpose,
      project_details: updatedProject.projectDetails,
      announcement_link: updatedProject.announcementLink,
      attachment_files: updatedProject.attachmentFiles,
      status: updatedProject.status,
      application_date: updatedProject.applicationDate,
      member_idx: updatedProject.memberIdx,
      member_name: updatedProject.memberName,
      company_idx: updatedProject.companyIdx,
      company_name: updatedProject.companyName,
      is_flag: updatedProject.isFlag,
      reg_date: updatedProject.regDate,
      mdy_date: updatedProject.mdyDate,
      // 상태정보 필드들 추가
      performance_summary: updatedProject.performanceSummary,
      follow_up_actions: updatedProject.followUpActions,
      reapplication_possibility: updatedProject.reapplicationPossibility,
      improvement_direction: updatedProject.improvementDirection,
      status_info_updated_at: updatedProject.statusInfoUpdatedAt,
      status_info_updated_by: updatedProject.statusInfoUpdatedBy
    };

    return NextResponse.json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    console.error("상태정보 업데이트 오류:", error);
    return NextResponse.json(
      { success: false, message: "상태정보 업데이트 중 오류가 발생했습니다." },
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
    const projectId = parseInt(resolvedParams.id);
    const body = await request.json();

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 프로젝트 ID입니다." },
        { status: 400 }
      );
    }

    // snake_case를 camelCase로 변환
    const updateData = {
      projectName: body.project_name,
      projectManager: body.project_manager,
      startDate: body.start_date ? new Date(body.start_date) : undefined,
      endDate: body.end_date ? new Date(body.end_date) : undefined,
      department: body.department,
      institution: body.institution,
      totalCost: body.total_cost,
      projectPurpose: body.project_purpose,
      projectDetails: body.project_details,
      announcementLink: body.announcement_link,
      status: body.status,
      // 상태정보 필드들 추가
      performanceSummary: body.performance_summary,
      followUpActions: body.follow_up_actions,
      reapplicationPossibility: body.reapplication_possibility,
      improvementDirection: body.improvement_direction,
      statusInfoUpdatedAt: body.status_info_updated_at,
      statusInfoUpdatedBy: body.status_info_updated_by
    };

    const updatedProject = await prisma.projectPlanning.update({
      where: { id: projectId },
      data: updateData,
    });

    // 응답도 snake_case로 변환
    const projectData = {
      id: updatedProject.id,
      project_name: updatedProject.projectName,
      project_manager: updatedProject.projectManager,
      start_date: updatedProject.startDate,
      end_date: updatedProject.endDate,
      department: updatedProject.department,
      institution: updatedProject.institution,
      total_cost: updatedProject.totalCost,
      project_purpose: updatedProject.projectPurpose,
      project_details: updatedProject.projectDetails,
      announcement_link: updatedProject.announcementLink,
      attachment_files: updatedProject.attachmentFiles,
      status: updatedProject.status,
      application_date: updatedProject.applicationDate,
      member_idx: updatedProject.memberIdx,
      member_name: updatedProject.memberName,
      company_idx: updatedProject.companyIdx,
      company_name: updatedProject.companyName,
      is_flag: updatedProject.isFlag,
      reg_date: updatedProject.regDate,
      mdy_date: updatedProject.mdyDate,
      // 상태정보 필드들 추가
      performance_summary: updatedProject.performanceSummary,
      follow_up_actions: updatedProject.followUpActions,
      reapplication_possibility: updatedProject.reapplicationPossibility,
      improvement_direction: updatedProject.improvementDirection,
      status_info_updated_at: updatedProject.statusInfoUpdatedAt,
      status_info_updated_by: updatedProject.statusInfoUpdatedBy
    };

    return NextResponse.json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    console.error("프로젝트 수정 오류:", error);
    return NextResponse.json(
      { success: false, message: "프로젝트 수정 중 오류가 발생했습니다." },
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
    const projectId = parseInt(resolvedParams.id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 프로젝트 ID입니다." },
        { status: 400 }
      );
    }

    await prisma.projectPlanning.delete({
      where: { id: projectId },
    });

    return NextResponse.json({
      success: true,
      message: "프로젝트가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("프로젝트 삭제 오류:", error);
    return NextResponse.json(
      { success: false, message: "프로젝트 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 