import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 프로젝트 기획 리스트 조회
export async function GET(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);
    
    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 검색 파라미터 처리 (페이지네이션 제거)
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') || 'DRAFT'; // 기본값은 DRAFT

    // 상태 파라미터 처리 (쉼표로 구분된 여러 상태 지원)
    const statuses = statusParam.split(',').map(s => s.trim()).filter(s => s);

    // WHERE 조건 구성
    const where: any = { 
      companyIdx: memberInfo.companyIdx, 
      isFlag: 1
    };

    // 상태 필터링 (여러 상태 지원)
    if (statuses.length === 1) {
      where.status = statuses[0];
    } else if (statuses.length > 1) {
      where.status = { in: statuses };
    }

    // 전체 데이터 조회 (페이지네이션 없음)
    const projects = await prisma.projectPlanning.findMany({
      where,
      include: {
        consortiumOrgs: {
          where: { 
            organizationType: '주관기관',
            isFlag: 1 
          }
        }
      },
      orderBy: { regDate: 'desc' }
    });
    
    // 주관기관 정보를 lead_organization로 변환하고 필드명을 snake_case로 변환
    const projectsWithLeadOrg = projects.map((project: any) => ({
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
      lead_organization: project.consortiumOrgs[0]?.organizationName || null
    }));
    
    return NextResponse.json({
      success: true,
      data: projectsWithLeadOrg,
      total_count: projectsWithLeadOrg.length
    });
    
  } catch (error) {
    console.error('프로젝트 조회 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '프로젝트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 프로젝트 기획 등록
export async function POST(request: NextRequest) {
  try {
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const projectDataString = formData.get('projectData') as string;
    
    if (!projectDataString) {
      return NextResponse.json(
        { success: false, error: '프로젝트 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    const projectData = JSON.parse(projectDataString);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // 첨부파일 처리
    const attachmentFiles: Array<{
      originalName: string;
      fileName: string;
      filePath: string;
      fileSize: number;
    }> = [];
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('attachmentFile_') && value instanceof File) {
        const file = value as File;
        const fileName = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'projects', fileName);
        
        // 디렉토리 생성
        await mkdir(path.dirname(uploadPath), { recursive: true });
        await writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));
        
        attachmentFiles.push({
          originalName: file.name,
          fileName: fileName,
          filePath: `/uploads/projects/${fileName}`,
          fileSize: file.size
        });
      }
    }

    // Prisma 트랜잭션으로 모든 데이터 삽입
    const result = await prisma.$transaction(async (tx: any) => {
      // 프로젝트 메인 테이블 삽입
      const project = await tx.projectPlanning.create({
        data: {
          projectName: projectData.projectName,
          projectManager: projectData.projectManager,
          startDate: new Date(projectData.startDate),
          endDate: new Date(projectData.endDate),
          department: projectData.department,
          institution: projectData.institution,
          totalCost: parseInt(projectData.totalCost.replace(/,/g, '')) || 0,
          projectPurpose: projectData.projectPurpose,
          projectDetails: projectData.projectDetails,
          announcementLink: projectData.announcementLink,
          attachmentFiles: attachmentFiles.length > 0 ? attachmentFiles : null,
          status: 'DRAFT',
          applicationDate: projectData.applicationDate ? Math.floor(new Date(projectData.applicationDate).getTime() / 1000) : null,
          memberIdx: memberInfo.memberIdx,
          memberName: memberInfo.memberName,
          companyIdx: memberInfo.companyIdx,
          companyName: memberInfo.companyName,
          regDate: currentTimestamp,
          mdyDate: currentTimestamp,
          isFlag: 1
        }
      });

      // 정책목표 데이터 삽입
      if (projectData.policyGoals && projectData.policyGoals.length > 0) {
        await tx.projectPolicyGoal.createMany({
          data: projectData.policyGoals.map((goal: any) => ({
            projectPlanningId: project.id,
            policyName: goal.policyName,
            targetValue: goal.targetValue,
            achievementRate: goal.achievementRate,
            memberIdx: memberInfo.memberIdx,
            memberName: memberInfo.memberName,
            companyIdx: memberInfo.companyIdx,
            companyName: memberInfo.companyName,
            regDate: currentTimestamp,
            mdyDate: currentTimestamp,
            isFlag: 1
          }))
        });
      }

      // 컨소시엄 구성 데이터 삽입
      if (projectData.consortiumOrganizations && projectData.consortiumOrganizations.length > 0) {
        await tx.projectConsortiumOrganization.createMany({
          data: projectData.consortiumOrganizations.map((org: any) => ({
            projectPlanningId: project.id,
            organizationType: org.organizationType,
            organizationName: org.organizationName,
            roleDescription: org.roleDescription,
            memberIdx: memberInfo.memberIdx,
            memberName: memberInfo.memberName,
            companyIdx: memberInfo.companyIdx,
            companyName: memberInfo.companyName,
            regDate: currentTimestamp,
            mdyDate: currentTimestamp,
            isFlag: 1
          }))
        });
      }

      return project;
    });

    return NextResponse.json({ 
      success: true, 
      message: '프로젝트가 성공적으로 등록되었습니다.',
      projectId: result.id
    });

  } catch (error) {
    console.error('프로젝트 등록 중 오류:', error);
    return NextResponse.json(
      { success: false, error: '프로젝트 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 