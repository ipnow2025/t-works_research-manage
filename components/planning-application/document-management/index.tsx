"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import FileView from "@/components/FileView"

interface DocumentItem {
  id: string
  name: string
  type: string
  functionName: string
}

interface DocumentManagementProps {
  project: any
}

export function DocumentManagement({ project }: DocumentManagementProps) {
  const [selectedDocument, setSelectedDocument] = useState<string>("1")
  
  const documents: DocumentItem[] = [
    {
      id: "1",
      name: "사업계획서",
      type: "pdf",
      functionName: "project_business_plan"
    },
    {
      id: "2",
      name: "예산계획서",
      type: "pdf",
      functionName: "project_budget_plan"
    },
    {
      id: "3",
      name: "기관현황서",
      type: "pdf",
      functionName: "project_organization_status"
    },
    {
      id: "4",
      name: "연구개발비 사용계획서",
      type: "pdf",
      functionName: "project_rd_budget_plan"
    },
    {
      id: "5",
      name: "위탁연구개발계약서",
      type: "pdf",
      functionName: "project_contract"
    },
    {
      id: "6",
      name: "사업자등록증",
      type: "pdf",
      functionName: "project_business_registration"
    },
  ]

  const selectedDoc = documents.find((doc) => doc.id === selectedDocument)

  return (
    <div className="space-y-6">
      {/* 서류 목록 카드 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">제출서류 목록</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* 선택된 서류의 파일 관리 섹션 */}
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
    </div>
  )
}
