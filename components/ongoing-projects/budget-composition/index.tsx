"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DollarSign, PieChart } from "lucide-react"

interface BudgetCompositionProps {
  project: any
}

export function BudgetComposition({ project }: BudgetCompositionProps) {
  const budget = project?.budget || {}

  const formatCurrency = (amount: number) => {
    return (amount / 100000000).toFixed(1) + "억원"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">예산 구성</h2>
        <p className="text-sm text-muted-foreground">프로젝트 예산 구성 및 집행 현황입니다.</p>
      </div>

      {/* 총 예산 개요 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />총 예산 개요
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatCurrency(budget.total || 0)}</div>
              <div className="text-sm text-muted-foreground">총 예산</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(budget.government || 0)}</div>
              <div className="text-sm text-muted-foreground">정부지원금</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(budget.privateCash || 0)}</div>
              <div className="text-sm text-muted-foreground">민간현금</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(budget.privateInKind || 0)}</div>
              <div className="text-sm text-muted-foreground">민간현물</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 예산 항목별 상세 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            예산 항목별 구성
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budget.items?.map((item: any) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    {(item.total / 10000).toLocaleString()}만원 ({item.ratio}%)
                  </div>
                </div>

                <Progress value={item.ratio} className="h-2 mb-2" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">직접비:</span>
                    <span className="ml-2 font-medium">{(item.direct / 10000).toLocaleString()}만원</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">간접비:</span>
                    <span className="ml-2 font-medium">{(item.indirect / 10000).toLocaleString()}만원</span>
                  </div>
                </div>

                {item.note && <div className="text-xs text-muted-foreground mt-2">비고: {item.note}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
