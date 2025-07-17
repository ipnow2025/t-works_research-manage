"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Download } from "lucide-react"
import FileView from "@/components/FileView"

interface DocumentItem {
  id: string
  name: string
  type: string
  functionName: string
}

interface DocumentOverviewProps {
  project: any
}

export function DocumentOverview({ project }: DocumentOverviewProps) {
  const [selectedDocument, setSelectedDocument] = useState<string>("business-announcement")
  
  const documents: DocumentItem[] = [
    {
      id: "business-announcement",
      name: "사업공고문",
      type: "pdf",
      functionName: "project_announcement"
    },
    {
      id: "rfp",
      name: "RFP",
      type: "pdf", 
      functionName: "project_rfp"
    },
    {
      id: "business-plan-form",
      name: "사업계획서 양식",
      type: "pdf",
      functionName: "project_template"
    },
  ]

  const selectedDoc = documents.find((doc) => doc.id === selectedDocument)

  return (
    <div className="space-y-6">
      {/* 문서 목록 카드 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">문서 목록</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDocument === doc.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => setSelectedDocument(doc.id)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-gray-500">{doc.type.toUpperCase()} 파일</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 선택된 문서의 파일 관리 섹션 */}
      {selectedDoc && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">{selectedDoc.name} 파일 관리</h3>
            <FileView 
              functionName={selectedDoc.functionName} 
              refIdx={project.id} 
              onFileUpload={() => console.log(`${selectedDoc.name} 파일 업로드됨`)} 
            />
          </CardContent>
        </Card>
      )}

      {/* 모든 문서 파일 통합 관리 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">전체 프로젝트 파일 관리</h3>
          <FileView 
            functionName="project_files" 
            refIdx={project.id} 
            onFileUpload={() => console.log('프로젝트 파일 업로드됨')} 
          />
        </CardContent>
      </Card>
    </div>
  )
}
