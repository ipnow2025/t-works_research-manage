import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMemberInfoFromRequest } from '@/lib/server_func'

// GET: 공지사항 목록 조회
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const important = searchParams.get('important');

    const where: any = {
      companyIdx: memberInfo.companyIdx,
      deletedAt: null
    };

    if (important === 'true') {
      where.important = true;
    }

    const skip = (page - 1) * limit;

    // 전체 개수 조회
    const totalCount = await prisma.projectScheduleAnnouncement.count({ where });

    // 공지사항 목록 조회
    const announcements = await prisma.projectScheduleAnnouncement.findMany({
      where,
      orderBy: [
        { important: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });

    // 응답 데이터 변환
    const announcementsData = announcements.map((announcement: any) => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      important: announcement.important,
      member_name: announcement.memberName,
      last_editor: announcement.lastEditor,
      created_at: announcement.createdAt,
      updated_at: announcement.updatedAt
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: announcementsData,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_count: totalCount,
        limit,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage
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

// POST: 공지사항 생성
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
    const { title, content, important = false } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const announcement = await prisma.projectScheduleAnnouncement.create({
      data: {
        title,
        content,
        important,
        memberIdx: memberInfo.memberIdx,
        memberName: memberInfo.memberName,
        companyIdx: memberInfo.companyIdx,
        companyName: memberInfo.companyName,
        lastEditor: memberInfo.memberName
      }
    });

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
    }, { status: 201 });

  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 