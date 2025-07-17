import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyIdxFromSession, getUserIdFromSession } from '@/lib/server_func';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectIdx = searchParams.get('projectIdx');
    const budgetYear = searchParams.get('budgetYear');

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

    if (!projectIdx) {
      return NextResponse.json(
        { error: 'projectIdx is required' },
        { status: 400 }
      );
    }

    const where: any = {
      projectIdx: parseInt(projectIdx),
      companyIdx: companyIdx,
    };

    if (budgetYear) {
      where.budgetYear = parseInt(budgetYear);
    }

    const budgets = await prisma.projectBudget.findMany({
      where,
      orderBy: {
        budgetYear: 'asc',
      },
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching project budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectIdx,
      budgetYear,
      totalBudget,
      budgetNotes,
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

    if (!projectIdx || !budgetYear) {
      return NextResponse.json(
        { error: 'projectIdx and budgetYear are required' },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    const budget = await prisma.projectBudget.create({
      data: {
        projectIdx: parseInt(projectIdx),
        budgetYear: parseInt(budgetYear),
        totalBudget: parseFloat(totalBudget || '0'),
        usedBudget: 0,
        remainingBudget: parseFloat(totalBudget || '0'),
        budgetStatus: 'draft',
        budgetNotes,
        companyIdx: companyIdx,
        memberIdx: memberIdx,
        regDate: now,
        mdyDate: now,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating project budget:', error);
    return NextResponse.json(
      { error: 'Failed to create project budget' },
      { status: 500 }
    );
  }
} 