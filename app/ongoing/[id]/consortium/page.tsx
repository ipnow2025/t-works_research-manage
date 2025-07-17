"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Consortium } from "@/components/ongoing-projects/consortium/index"
import { samplePlanningProjects } from "@/lib/project-manager"

export default function OngoingConsortiumPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">인력구성</h1>
          </div>

          <Consortium project={project} />
        </div>
      </main>
    </div>
  )
}
