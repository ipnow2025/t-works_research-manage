"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { BudgetComposition } from "@/components/ongoing-projects/budget-composition/index"
import { samplePlanningProjects } from "@/lib/project-manager"

export default function OngoingBudgetPage() {
  const router = useRouter()
  const params = useParams()
  
  const projectId = params.id as string
  const project = samplePlanningProjects.find((p) => p.id === projectId)

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <button
              onClick={() => router.push(`/ongoing/${params.id}`)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ChevronLeft className="h-4 w-4" />
              사업개요로 돌아가기
            </button>
            <h1 className="text-2xl font-bold tracking-tight">예산구성</h1>
          </div>

          <BudgetComposition project={project} />
        </div>
      </main>
    </div>
  )
}
