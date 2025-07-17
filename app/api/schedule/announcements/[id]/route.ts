import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 특정 공지사항 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const announcementId = parseInt(resolvedParams.id);

    if (isNaN(announcementId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 공지사항 ID입니다.' },
        { status: 400 }
      );
    }

    const announcement = await prisma.projectScheduleAnnouncement.findUnique({
      where: { id: announcementId }
    });

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        important: announcement.important,
        member_name: announcement.memberName,
        last_editor: announcement.lastEditor,
        created_at: announcement.createdAt,
        updated_at: announcement.updatedAt
      }
    });

  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 공지사항 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const announcementId = parseInt(resolvedParams.id);
    const body = await request.json();
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(announcementId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 공지사항 ID입니다.' },
        { status: 400 }
      );
    }

    const { title, content, important } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const updatedAnnouncement = await prisma.projectScheduleAnnouncement.update({
      where: { id: announcementId },
      data: {
        title,
        content,
        important,
        lastEditor: memberInfo.memberName
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedAnnouncement.id,
        title: updatedAnnouncement.title,
        content: updatedAnnouncement.content,
        important: updatedAnnouncement.important,
        member_name: updatedAnnouncement.memberName,
        last_editor: updatedAnnouncement.lastEditor,
        created_at: updatedAnnouncement.createdAt,
        updated_at: updatedAnnouncement.updatedAt
      }
    });

  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 공지사항 삭제 (소프트 삭제)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const announcementId = parseInt(resolvedParams.id);
    const memberInfo = getMemberInfoFromRequest(request);

    if (!memberInfo?.memberIdx) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (isNaN(announcementId)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 공지사항 ID입니다.' },
        { status: 400 }
      );
    }

    await prisma.projectScheduleAnnouncement.update({
      where: { id: announcementId },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: '공지사항이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 