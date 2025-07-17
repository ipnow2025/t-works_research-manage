"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

type DocumentType = "announcement" | "rfp" | "template"

interface ProjectOverviewProps {
  project: any
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const [activeDocTab, setActiveDocTab] = useState<DocumentType>("announcement")

  const handleFileUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf"

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        alert(`${file.name} 파일이 업로드되었습니다.`)
      }
    }

    input.click()
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* 왼쪽: 문서 목록 */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <Card className="h-full">
          <CardHeader className="font-medium text-lg">문서 목록</CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              <div
                className={cn(
                  "flex items-center p-3 cursor-pointer",
                  activeDocTab === "announcement" ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-muted",
                )}
                onClick={() => setActiveDocTab("announcement")}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>사업공고문</span>
              </div>

              <div
                className={cn(
                  "flex items-center p-3 cursor-pointer",
                  activeDocTab === "rfp" ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-muted",
                )}
                onClick={() => setActiveDocTab("rfp")}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>RFP</span>
              </div>

              <div
                className={cn(
                  "flex items-center p-3 cursor-pointer",
                  activeDocTab === "template" ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-muted",
                )}
                onClick={() => setActiveDocTab("template")}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>사업계획서 양식</span>
              </div>
            </div>

            <div className="p-4 mt-6">
              <h3 className="text-sm text-muted-foreground mb-2">공고문 업로드</h3>
              <div className="border border-dashed rounded-md p-4">
                <Button variant="outline" className="w-full" onClick={handleFileUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  파일 선택
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 오른쪽: 문서 미리보기 */}
      <div className="w-full md:w-2/3 lg:w-3/4">
        <Card className="h-full">
          <CardHeader className="font-medium text-lg">
            {activeDocTab === "announcement" && "사업공고문"}
            {activeDocTab === "rfp" && "RFP"}
            {activeDocTab === "template" && "사업계획서 양식"}
          </CardHeader>
          <CardContent>
            <div className="border border-dashed rounded-lg flex flex-col items-center justify-center p-12">
              <div className="text-gray-400 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 2V5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2V5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 9H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.5 14.5L16.5 17.5L14.5 15.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 3.5H5C3.895 3.5 3 4.395 3 5.5V19.5C3 20.605 3.895 21.5 5 21.5H19C20.105 21.5 21 20.605 21 19.5V5.5C21 4.395 20.105 3.5 19 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-center text-gray-500">
                {activeDocTab === "announcement" && "사업공고문이 업로드되지 않았습니다"}
                {activeDocTab === "rfp" && "RFP가 업로드되지 않았습니다"}
                {activeDocTab === "template" && "사업계획서 양식이 업로드되지 않았습니다"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
