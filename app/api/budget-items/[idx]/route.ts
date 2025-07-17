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
        { error: 'Invalid item index' },
        { status: 400 }
      );
    }

    const item = await prisma.budgetItem.findFirst({
      where: { 
        idx,
        companyIdx: companyIdx,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Budget item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching budget item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget item' },
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
      categoryIdx,
      itemName,
      itemDescription,
      plannedAmount,
      actualAmount,
      itemStatus,
    } = body;

    if (isNaN(idx)) {
      return NextResponse.json(
        { error: 'Invalid item index' },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    const item = await prisma.budgetItem.update({
      where: { 
        idx,
        companyIdx: companyIdx,
      },
      data: {
        categoryIdx: categoryIdx ? parseInt(categoryIdx) : undefined,
        itemName,
        itemDescription,
        plannedAmount: plannedAmount ? parseFloat(plannedAmount) : undefined,
        actualAmount: actualAmount ? parseFloat(actualAmount) : undefined,
        itemStatus,
        mdyDate: now,
      },
    });

    // Update budget used amount
    await updateBudgetUsedAmount(item.budgetIdx, companyIdx);

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating budget item:', error);
    return NextResponse.json(
      { error: 'Failed to update budget item' },
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
        { error: 'Invalid item index' },
        { status: 400 }
      );
    }

    const item = await prisma.budgetItem.findFirst({
      where: { 
        idx,
        companyIdx: companyIdx,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Budget item not found' },
        { status: 404 }
      );
    }

    await prisma.budgetItem.delete({
      where: { 
        idx,
        companyIdx: companyIdx,
      },
    });

    // Update budget used amount
    await updateBudgetUsedAmount(item.budgetIdx, companyIdx);

    return NextResponse.json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget item:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget item' },
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