"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import { AddTaskDialog } from "./add-task-dialog"
import { apiFetch } from "@/lib/func"
import { formatTimestamp } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description: string
  dueDate?: string
  startDate?: string
  status: "planned" | "in-progress" | "completed"
}

interface ProgressStatusProps {
  project?: any
}

export function ProgressStatus({ project }: ProgressStatusProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Task["status"]>("planned")
  const [loading, setLoading] = useState(true)

  // API에서 작업 목록 가져오기
  const fetchTasks = async () => {
    if (!project?.id) return
    
    try {
      setLoading(true)
      const response = await apiFetch(`/api/project-planning/${project.id}/tasks`)
      const result = await response.json()
      
      if (result.success) {
        // API 응답을 화면 형식으로 변환
        const apiTasks = result.data.map((task: any) => ({
          id: task.id.toString(),
          title: task.title,
          description: task.description || '',
          startDate: task.start_date ? new Date(task.start_date * 1000).toISOString().split('T')[0] : undefined,
          dueDate: task.due_date ? new Date(task.due_date * 1000).toISOString().split('T')[0] : undefined,
          status: task.status as Task["status"]
        }))
        setTasks(apiTasks)
      } else {
        console.error('작업 목록 조회 실패:', result.error)
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchTasks()
  }, [project?.id])

  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    if (!project?.id) return
    
    try {
      const response = await apiFetch(`/api/project-planning/${project.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          start_date: newTask.startDate,
          due_date: newTask.dueDate,
          status: newTask.status
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // 새 작업을 목록에 추가
        const task: Task = {
          ...newTask,
          id: result.data.id.toString(),
        }
        setTasks([...tasks, task])
        setIsAddDialogOpen(false)
      } else {
        console.error('작업 등록 실패:', result.error)
        alert('작업 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
      alert('작업 등록 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!project?.id) return
    
    try {
      const response = await apiFetch(`/api/project-planning/${project.id}/tasks/${taskId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setTasks(tasks.filter((task) => task.id !== taskId))
      } else {
        console.error('작업 삭제 실패:', result.error)
        alert('작업 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
      alert('작업 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleEditTask = async (taskId: string, updatedTask: Partial<Task>) => {
    if (!project?.id) return
    
    try {
      const response = await apiFetch(`/api/project-planning/${project.id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          start_date: updatedTask.startDate,
          due_date: updatedTask.dueDate,
          status: updatedTask.status
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
      } else {
        console.error('작업 수정 실패:', result.error)
        alert('작업 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
      alert('작업 수정 중 오류가 발생했습니다.')
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    await handleEditTask(taskId, { status: newStatus })
  }

  const openAddDialog = (status: Task["status"]) => {
    setSelectedStatus(status)
    setIsAddDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-8 bg-gray-50 min-h-screen p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">데이터를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      {/* 전체 진행률 */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">전체 진행률</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            완료: <span className="font-semibold text-gray-900">{completedTasks}개</span>
          </div>
          <div className="text-sm text-gray-600">
            전체: <span className="font-semibold text-gray-900">{totalTasks}개</span>
          </div>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gray-900 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600 mt-3 font-medium">
            {progressPercentage.toFixed(1)}% 완료
          </div>
        </div>
      </div>

      {/* 작업 관리 칸반 보드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 예정된 작업 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">예정된 작업</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openAddDialog("planned")}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          <div className="p-4 space-y-3">
            {getTasksByStatus("planned").map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>

        {/* 진행중인 작업 */}
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200">
          <div className="flex items-center justify-between p-4 border-b border-blue-200">
            <h3 className="font-semibold text-gray-900">진행중인 작업</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openAddDialog("in-progress")}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Plus className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
          <div className="p-4 space-y-3">
            {getTasksByStatus("in-progress").map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>

        {/* 완료된 작업 */}
        <div className="bg-green-50 rounded-lg shadow-sm border border-green-200">
          <div className="p-4 border-b border-green-200">
            <h3 className="font-semibold text-gray-900">완료된 작업</h3>
          </div>
          <div className="p-4 space-y-3">
            {getTasksByStatus("completed").map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 작업 추가 다이얼로그 */}
      <AddTaskDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddTask}
        defaultStatus={selectedStatus}
      />
    </div>
  )
}
