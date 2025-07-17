import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyIdxFromSession, getUserIdFromSession } from '@/lib/server_func';

export async function GET(
  request: NextRequest,
  { params }: { params: { idx: string } }
) {
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

    const idx = parseInt(params.idx);

    if (isNaN(idx)) {
      return NextResponse.json(
        { error: 'Invalid budget index' },
        { status: 400 }
      );
    }

    const budget = await prisma.projectBudget.findFirst({
      where: { 
        idx,
        companyIdx: companyIdx,
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: 'Project budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error fetching project budget:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project budget' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { idx: string } }
) {
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

    const idx = parseInt(params.idx);
    const body = await request.json();
    const {
      totalBudget,
      budgetStatus,
      budgetNotes,
    } = body;

    if (isNaN(idx)) {
      return NextResponse.json(
        { error: 'Invalid budget index' },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    // Calculate remaining budget
    const currentBudget = await prisma.projectBudget.findFirst({
      where: { 
        idx,
        companyIdx: companyIdx,
      },
    });

    if (!currentBudget) {
      return NextResponse.json(
        { error: 'Project budget not found' },
        { status: 404 }
      );
    }

    const newTotalBudget = parseFloat(totalBudget || '0');
    const remainingBudget = newTotalBudget - currentBudget.usedBudget;

    const budget = await prisma.projectBudget.update({
      where: { 
        idx,
        companyIdx: companyIdx,
      },
      data: {
        totalBudget: newTotalBudget,
        remainingBudget,
        budgetStatus,
        budgetNotes,
        mdyDate: now,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating project budget:', error);
    return NextResponse.json(
      { error: 'Failed to update project budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { idx: string } }
) {
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

    const idx = parseInt(params.idx);

    if (isNaN(idx)) {
      return NextResponse.json(
        { error: 'Invalid budget index' },
        { status: 400 }
      );
    }

    await prisma.projectBudget.delete({
      where: { 
        idx,
        companyIdx: companyIdx,
      },
    });

    return NextResponse.json({ message: 'Project budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting project budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete project budget' },
      { status: 500 }
    );
  }
} 