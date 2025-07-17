import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyIdxFromSession, getUserIdFromSession } from '@/lib/server_func';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const companyIdx = getCompanyIdxFromSession(request);
    const memberIdx = getUserIdFromSession(request);
    const { idx } = await params;

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

    const categoryIdx = parseInt(idx);

    if (isNaN(categoryIdx)) {
      return NextResponse.json(
        { error: 'Invalid category index' },
        { status: 400 }
      );
    }

    const category = await prisma.budgetCategory.findFirst({
      where: { 
        idx: categoryIdx,
        companyIdx: companyIdx,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Budget category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching budget category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const companyIdx = getCompanyIdxFromSession(request);
    const memberIdx = getUserIdFromSession(request);
    const { idx } = await params;

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

    const categoryIdx = parseInt(idx);
    const body = await request.json();
    const { categoryName, categoryDescription } = body;

    if (isNaN(categoryIdx)) {
      return NextResponse.json(
        { error: 'Invalid category index' },
        { status: 400 }
      );
    }

    if (!categoryName) {
      return NextResponse.json(
        { error: 'categoryName is required' },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    const category = await prisma.budgetCategory.update({
      where: { 
        idx: categoryIdx,
        companyIdx: companyIdx,
      },
      data: {
        categoryName,
        categoryDescription,
        mdyDate: now,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating budget category:', error);
    return NextResponse.json(
      { error: 'Failed to update budget category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const companyIdx = getCompanyIdxFromSession(request);
    const memberIdx = getUserIdFromSession(request);
    const { idx } = await params;

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

    const categoryIdx = parseInt(idx);

    if (isNaN(categoryIdx)) {
      return NextResponse.json(
        { error: 'Invalid category index' },
        { status: 400 }
      );
    }

    await prisma.budgetCategory.delete({
      where: { 
        idx: categoryIdx,
        companyIdx: companyIdx,
      },
    });

    return NextResponse.json({ message: 'Budget category deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget category:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget category' },
      { status: 500 }
    );
  }
} 