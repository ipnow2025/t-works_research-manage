import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyIdxFromSession, getUserIdFromSession } from '@/lib/server_func';

export async function GET(request: NextRequest) {
  try {
    const companyIdx = getCompanyIdxFromSession(request);
    const memberIdx = getUserIdFromSession(request);

    if (!companyIdx) {
      return NextResponse.json(
        { error: 'Company index not found' },
        { status: 401 }
      );
    }

    if (!memberIdx) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const categories = await prisma.budgetCategory.findMany({
      where: {
        companyIdx: companyIdx,
      },
      orderBy: {
        categoryName: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching budget categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categoryName,
      categoryDescription,
    } = body;

    const companyIdx = getCompanyIdxFromSession(request);
    const memberIdx = getUserIdFromSession(request);

    if (!companyIdx) {
      return NextResponse.json(
        { error: 'Company index not found' },
        { status: 401 }
      );
    }

    if (!memberIdx) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    if (!categoryName) {
      return NextResponse.json(
        { error: 'categoryName is required' },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    const category = await prisma.budgetCategory.create({
      data: {
        categoryName,
        categoryDescription,
        companyIdx: companyIdx,
        memberIdx: memberIdx,
        regDate: now,
        mdyDate: now,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating budget category:', error);
    return NextResponse.json(
      { error: 'Failed to create budget category' },
      { status: 500 }
    );
  }
} 