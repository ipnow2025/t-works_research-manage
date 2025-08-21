"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit } from "lucide-react"
import FileView from "@/components/FileView"

interface DocumentItem {
  id: string
  name: string
  type: string
  functionName: string
}

interface DocumentChecklistItem {
  id: string
  name: string
  isCompleted: boolean
}

interface DocumentManagementProps {
  project: any
}

export function DocumentManagement({ project }: DocumentManagementProps) {
  const [selectedDocument] = useState<string>("1")
  const [checklistItems, setChecklistItems] = useState<DocumentChecklistItem[]>([
    { id: "1", name: "사업계획서", isCompleted: false },
    { id: "2", name: "예산계획서", isCompleted: false },
    { id: "3", name: "기관현황서", isCompleted: false },
    { id: "4", name: "연구개발비 사용계획서", isCompleted: false },
    { id: "5", name: "위탁연구개발계약서", isCompleted: false },
    { id: "6", name: "사업자등록증", isCompleted: false },
  ])
  const [newItemName, setNewItemName] = useState("")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  
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

  const addChecklistItem = () => {
    if (newItemName.trim()) {
      const newItem: DocumentChecklistItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        isCompleted: false
      }
      setChecklistItems([...checklistItems, newItem])
      setNewItemName("")
    }
  }

  const deleteChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id))
  }

  const toggleCompleted = (id: string) => {
    setChecklistItems(checklistItems.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ))
  }

  const startEditing = (item: DocumentChecklistItem) => {
    setEditingItem(item.id)
    setEditingName(item.name)
  }

  const saveEdit = (id: string) => {
    if (editingName.trim()) {
      setChecklistItems(checklistItems.map(item =>
        item.id === id ? { ...item, name: editingName.trim() } : item
      ))
    }
    setEditingItem(null)
    setEditingName("")
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditingName("")
  }

  const completedCount = checklistItems.filter(item => item.isCompleted).length
  const totalCount = checklistItems.length

  return (
    <div className="space-y-6">
             {/* 제출서류철 체크리스트 섹션 */}
      <Card>
                 <CardHeader>
           <CardTitle className="flex items-center justify-between text-lg">
             <span>제출서류철 체크리스트</span>
             <div className="text-sm text-muted-foreground">
               완료: {completedCount}/{totalCount}
             </div>
           </CardTitle>
         </CardHeader>
        <CardContent className="p-6">
          {/* 새 항목 추가 */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="새로운 서류명을 입력하세요"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
              className="flex-1"
            />
            <Button onClick={addChecklistItem} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              추가
            </Button>
          </div>

          {/* 체크리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox
                  checked={item.isCompleted}
                  onCheckedChange={() => toggleCompleted(item.id)}
                />
                <div className="flex-1">
                  {editingItem === item.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(item.id)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => saveEdit(item.id)}>저장</Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>취소</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(item)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteChecklistItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
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
            <h3 className="font-semibold text-lg mb-4">제출서류 파일 관리</h3>
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
