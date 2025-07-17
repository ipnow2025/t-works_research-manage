import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCompanyIdxFromSession, getUserIdFromSession } from '@/lib/server_func';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const budgetIdx = searchParams.get('budgetIdx');
    const categoryIdx = searchParams.get('categoryIdx');

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

    if (!budgetIdx) {
      return NextResponse.json(
        { error: 'budgetIdx is required' },
        { status: 400 }
      );
    }

    const where: any = {
      budgetIdx: parseInt(budgetIdx),
      companyIdx: companyIdx,
    };

    if (categoryIdx) {
      where.categoryIdx = parseInt(categoryIdx);
    }

    const items = await prisma.budgetItem.findMany({
      where,
      orderBy: {
        itemName: 'asc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching budget items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      budgetIdx,
      categoryIdx,
      itemName,
      itemDescription,
      plannedAmount,
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

    if (!budgetIdx || !categoryIdx || !itemName) {
      return NextResponse.json(
        { error: 'budgetIdx, categoryIdx, and itemName are required' },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    const item = await prisma.budgetItem.create({
      data: {
        budgetIdx: parseInt(budgetIdx),
        categoryIdx: parseInt(categoryIdx),
        itemName,
        itemDescription,
        plannedAmount: parseFloat(plannedAmount || '0'),
        actualAmount: 0,
        itemStatus: 'planned',
        companyIdx: companyIdx,
        memberIdx: memberIdx,
        regDate: now,
        mdyDate: now,
      },
    });

    // Update budget used amount
    await updateBudgetUsedAmount(parseInt(budgetIdx), companyIdx);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating budget item:', error);
    return NextResponse.json(
      { error: 'Failed to create budget item' },
      { status: 500 }
    );
  }
}

async function updateBudgetUsedAmount(budgetIdx: number, companyIdx: string) {
  try {
    const items = await prisma.budgetItem.findMany({
      where: { 
        budgetIdx,
        companyIdx,
      },
    });

    const totalUsed = items.reduce((sum: number, item: any) => sum + Number(item.actualAmount), 0);

    const budget = await prisma.projectBudget.findFirst({
      where: { 
        idx: budgetIdx,
        companyIdx,
      },
    });

    if (budget) {
      await prisma.projectBudget.update({
        where: { 
          idx: budgetIdx,
          companyIdx,
        },
        data: {
          usedBudget: totalUsed,
          remainingBudget: Number(budget.totalBudget) - totalUsed,
        },
      });
    }
  } catch (error) {
    console.error('Error updating budget used amount:', error);
  }
} 