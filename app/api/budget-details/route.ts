import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectIdx, budgetData, companyIdx, memberIdx } = body

    if (!projectIdx || !budgetData || !companyIdx || !memberIdx) {
      return NextResponse.json(
        { success: false, error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const currentTime = Math.floor(Date.now() / 1000)

    // 기존 예산 데이터 조회
    const existingBudgets = await prisma.projectBudget.findMany({
      where: {
        projectIdx: parseInt(projectIdx)
      },
      include: {
        budgetItems: true
      }
    })

    const savedBudgets = []

    for (const [year, yearData] of Object.entries(budgetData as Record<string, any>)) {
      const budgetYear = parseInt(year)
      
      // 연차별 총 예산 계산
      let totalBudget = 0
      let usedBudget = 0
      let remainingBudget = 0

      // 모든 기관의 해당 연차 예산 합계 계산
      for (const [orgId, orgData] of Object.entries(yearData as Record<string, any>)) {
        const cashTotal = Object.values(orgData.cash).reduce((sum: number, amount: any) => sum + (amount || 0), 0)
        const inkindTotal = Object.values(orgData.inkind).reduce((sum: number, amount: any) => sum + (amount || 0), 0)
        totalBudget += cashTotal + inkindTotal
      }

      // 해당 연차의 기존 예산 찾기
      let existingBudget = existingBudgets.find((budget: any) => budget.budgetYear === budgetYear)
      let projectBudget

      if (existingBudget) {
        // 기존 예산 업데이트
        projectBudget = await prisma.projectBudget.update({
          where: { idx: existingBudget.idx },
          data: {
            totalBudget,
            usedBudget,
            remainingBudget,
            mdyDate: currentTime
          }
        })

        // 기존 예산 항목들 삭제
        await prisma.budgetItem.deleteMany({
          where: {
            budgetIdx: existingBudget.idx
          }
        })
      } else {
        // 새로운 예산 생성
        projectBudget = await prisma.projectBudget.create({
          data: {
            projectIdx: parseInt(projectIdx),
            budgetYear,
            totalBudget,
            usedBudget,
            remainingBudget,
            budgetStatus: 'draft',
            companyIdx,
            memberIdx,
            regDate: currentTime,
            mdyDate: currentTime
          }
        })
      }

      savedBudgets.push(projectBudget)

      // 기관별 예산 항목 저장
      for (const [orgId, orgData] of Object.entries(yearData as Record<string, any>)) {
        const { cash, inkind } = orgData

        // 현금 예산 항목들 저장
        for (const [category, amount] of Object.entries(cash as Record<string, number>)) {
          if (amount > 0) {
            // 카테고리 ID 찾기 또는 생성
            let categoryRecord = await prisma.budgetCategory.findFirst({
              where: {
                categoryName: category,
                companyIdx
              }
            })

            if (!categoryRecord) {
              categoryRecord = await prisma.budgetCategory.create({
                data: {
                  categoryName: category,
                  categoryDescription: `${category} 예산 항목`,
                  companyIdx,
                  memberIdx,
                  regDate: currentTime,
                  mdyDate: currentTime
                }
              })
            }

            // 현금 예산 항목 저장
            await prisma.budgetItem.create({
              data: {
                budgetIdx: projectBudget.idx,
                categoryIdx: categoryRecord.idx,
                itemName: `${orgId}_${category} (현금)`,
                itemDescription: `${category} 현금 예산 - 기관: ${orgId}`,
                plannedAmount: amount,
                actualAmount: 0,
                itemStatus: 'planned',
                companyIdx,
                memberIdx,
                regDate: currentTime,
                mdyDate: currentTime
              }
            })
          }
        }

        // 현물 예산 항목들 저장
        for (const [category, amount] of Object.entries(inkind as Record<string, number>)) {
          if (amount > 0) {
            // 카테고리 ID 찾기 또는 생성
            let categoryRecord = await prisma.budgetCategory.findFirst({
              where: {
                categoryName: category,
                companyIdx
              }
            })

            if (!categoryRecord) {
              categoryRecord = await prisma.budgetCategory.create({
                data: {
                  categoryName: category,
                  categoryDescription: `${category} 예산 항목`,
                  companyIdx,
                  memberIdx,
                  regDate: currentTime,
                  mdyDate: currentTime
                }
              })
            }

            // 현물 예산 항목 저장
            await prisma.budgetItem.create({
              data: {
                budgetIdx: projectBudget.idx,
                categoryIdx: categoryRecord.idx,
                itemName: `${orgId}_${category} (현물)`,
                itemDescription: `${category} 현물 예산 - 기관: ${orgId}`,
                plannedAmount: amount,
                actualAmount: 0,
                itemStatus: 'planned',
                companyIdx,
                memberIdx,
                regDate: currentTime,
                mdyDate: currentTime
              }
            })
          }
        }
      }
    }

    // 더 이상 사용되지 않는 연차의 예산 삭제
    const savedYears = Object.keys(budgetData).map(Number)
    const budgetsToDelete = existingBudgets.filter((budget: any) => !savedYears.includes(budget.budgetYear))
    
    for (const budgetToDelete of budgetsToDelete) {
      await prisma.budgetItem.deleteMany({
        where: {
          budgetIdx: budgetToDelete.idx
        }
      })
      await prisma.projectBudget.delete({
        where: {
          idx: budgetToDelete.idx
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: existingBudgets.length > 0 ? '예산 상세내역이 성공적으로 업데이트되었습니다.' : '예산 상세내역이 성공적으로 저장되었습니다.',
      data: savedBudgets
    })

  } catch (error) {
    console.error('예산 상세내역 저장 오류:', error)
    return NextResponse.json(
      { success: false, error: '예산 상세내역 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectIdx = searchParams.get('projectIdx')

    if (!projectIdx) {
      return NextResponse.json(
        { success: false, error: '프로젝트 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 프로젝트의 모든 연차 예산 조회
    const budgets = await prisma.projectBudget.findMany({
      where: {
        projectIdx: parseInt(projectIdx)
      },
      include: {
        budgetItems: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        budgetYear: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: budgets
    })

  } catch (error) {
    console.error('예산 상세내역 조회 오류:', error)
    return NextResponse.json(
      { success: false, error: '예산 상세내역 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 