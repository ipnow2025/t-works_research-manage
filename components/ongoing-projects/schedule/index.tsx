"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  Bell,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/func"
import { toast } from "sonner"
import { Announcements } from "./announcements"

interface ScheduleProps {
  project: any
}

interface ScheduleType {
  id: number
  category: string
  color: string
}

interface Schedule {
  id: number
  title: string
  description?: string
  startDate: string
  endDate?: string
  category?: string
  location?: string
  participants?: string
  isAllDay: boolean
  typeId: number
  projectId: number
}

export function Schedule({ project }: ScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [scheduleTypes, setScheduleTypes] = useState<ScheduleType[]>([])
  const [loading, setLoading] = useState(true)
  const [previousMonthCount, setPreviousMonthCount] = useState(0)
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    category: "",
    location: "",
    participants: "",
    typeId: "",
  })

  // 일정 데이터 가져오기
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true)
        const month = currentDate.getMonth()
        const year = currentDate.getFullYear()
        const response = await apiFetch(`/api/schedule/schedules?projectId=${project.id}&month=${month}&year=${year}`)
        const result = await response.json()
        
        if (response.ok && result.success) {
          setSchedules(result.data || [])
        }
      } catch (error) {
        console.error('일정 조회 오류:', error)
        toast.error('일정을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    const fetchPreviousMonthSchedules = async () => {
      try {
        const prevMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1
        const prevYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()
        const response = await apiFetch(`/api/schedule/schedules?projectId=${project.id}&month=${prevMonth}&year=${prevYear}`)
        const result = await response.json()
        
        if (response.ok && result.success) {
          setPreviousMonthCount(result.data?.length || 0)
        }
      } catch (error) {
        console.error('이전 월 일정 조회 오류:', error)
      }
    }

    const fetchScheduleTypes = async () => {
      try {
        const response = await apiFetch(`/api/schedule/types`)
        const result = await response.json()
        
        if (response.ok && result.success) {
          setScheduleTypes(result.data || [])
        }
      } catch (error) {
        console.error('일정 타입 조회 오류:', error)
      }
    }

    if (project?.id) {
      fetchSchedules()
      fetchPreviousMonthSchedules()
      // 타입은 한 번만 가져오면 되므로 currentDate 변경 시에는 가져오지 않음
      if (scheduleTypes.length === 0) {
        fetchScheduleTypes()
      }
    }
  }, [project?.id, currentDate.getMonth(), currentDate.getFullYear()])

  const handleAddSchedule = async () => {
    try {
      if (!newSchedule.title || !newSchedule.startDate) {
        toast.error('제목과 시작일을 입력해주세요.')
        return
      }

      const response = await apiFetch('/api/schedule/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSchedule,
          projectId: project.id,
          typeId: newSchedule.typeId || '1',
        }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        toast.success('일정이 추가되었습니다.')
        setIsAddModalOpen(false)
        setNewSchedule({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          category: "",
          location: "",
          participants: "",
          typeId: "",
        })
        // 일정 목록 새로고침
        const month = currentDate.getMonth()
        const year = currentDate.getFullYear()
        const refreshResponse = await apiFetch(`/api/schedule/schedules?projectId=${project.id}&month=${month}&year=${year}`)
        const refreshResult = await refreshResponse.json()
        if (refreshResponse.ok && refreshResult.success) {
          setSchedules(refreshResult.data || [])
        }
      } else {
        toast.error(result.message || '일정 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('일정 추가 오류:', error)
      toast.error('일정 추가 중 오류가 발생했습니다.')
    }
  }

  const handleEditSchedule = async () => {
    try {
      if (!editingSchedule || !editingSchedule.title || !editingSchedule.startDate) {
        toast.error('제목과 시작일을 입력해주세요.')
        return
      }

      const response = await apiFetch(`/api/schedule/schedules/${editingSchedule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingSchedule,
          typeId: editingSchedule.typeId || 1,
        }),
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        toast.success('일정이 수정되었습니다.')
        setIsEditModalOpen(false)
        setEditingSchedule(null)
        // 일정 목록 새로고침
        const month = currentDate.getMonth()
        const year = currentDate.getFullYear()
        const refreshResponse = await apiFetch(`/api/schedule/schedules?projectId=${project.id}&month=${month}&year=${year}`)
        const refreshResult = await refreshResponse.json()
        if (refreshResponse.ok && refreshResult.success) {
          setSchedules(refreshResult.data || [])
        }
      } else {
        toast.error(result.message || '일정 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('일정 수정 오류:', error)
      toast.error('일정 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/schedule/schedules/${scheduleId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        toast.success('일정이 삭제되었습니다.')
        // 일정 목록 새로고침
        const month = currentDate.getMonth()
        const year = currentDate.getFullYear()
        const refreshResponse = await apiFetch(`/api/schedule/schedules?projectId=${project.id}&month=${month}&year=${year}`)
        const refreshResult = await refreshResponse.json()
        if (refreshResponse.ok && refreshResult.success) {
          setSchedules(refreshResult.data || [])
        }
      } else {
        toast.error(result.message || '일정 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('일정 삭제 오류:', error)
      toast.error('일정 삭제 중 오류가 발생했습니다.')
    }
  }

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule({
      ...schedule,
      startDate: schedule.startDate.slice(0, 16), // datetime-local 형식에 맞게 변환
      endDate: schedule.endDate ? schedule.endDate.slice(0, 16) : "",
    })
    setIsEditModalOpen(true)
  }

  // 타입 ID로 타입 정보 가져오기
  const getTypeById = (typeId: number) => {
    return scheduleTypes.find(type => type.id === typeId) || { category: '기타', color: '#6B7280' }
  }

  // 통계 계산 (현재 월 기준)
  const calculateStats = () => {
    const totalSchedules = schedules.length
    const today = new Date()
    
    // 현재 표시된 월의 일정 수
    const currentMonthSchedules = schedules.length

    // 현재 표시된 월에서 진행중인 일정 (오늘 이후)
    const upcomingSchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startDate)
      return scheduleDate >= today
    }).length

    // 현재 표시된 월에서 완료된 일정 (오늘 이전)
    const completedSchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startDate)
      return scheduleDate < today
    }).length

    return {
      total: totalSchedules,
      currentMonth: currentMonthSchedules,
      upcoming: upcomingSchedules,
      completed: completedSchedules
    }
  }

  const stats = calculateStats()

  // 다가오는 일정 계산 (오늘부터 2주)
  const getUpcomingSchedules = () => {
    const today = new Date()
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) // 14일 후
    
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startDate)
      return scheduleDate >= today && scheduleDate <= twoWeeksLater
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }

  const upcomingSchedules = getUpcomingSchedules()

  // Add safety checks
  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">프로젝트 데이터를 불러올 수 없습니다.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">일정을 불러오는 중...</p>
      </div>
    )
  }

  // 일정이 없어도 캘린더 뷰는 계속 표시
  // if (schedules.length === 0) {
  //   return (
  //     <div className="text-center py-8">
  //       <p className="text-muted-foreground">등록된 일정이 없습니다.</p>
  //       <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
  //         <DialogTrigger asChild>
  //           <Button size="sm" className="gap-2 mt-4">
  //             <Plus className="h-4 w-4" />첫 번째 일정 추가
  //           </Button>
  //         </DialogTrigger>
  //         <DialogContent className="sm:max-w-[425px]">
  //           <DialogHeader>
  //             <DialogTitle>새 일정 추가</DialogTitle>
  //             <DialogDescription>
  //               프로젝트에 새로운 일정을 추가합니다.
  //             </DialogDescription>
  //           </DialogHeader>
  //           <div className="grid gap-4 py-4">
  //             <div className="grid grid-cols-4 items-center gap-4">
  //               <Label htmlFor="title" className="text-right">
  //                 제목
  //               </Label>
  //               <Input
  //                 id="title"
  //                 value={newSchedule.title}
  //                 onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
  //                 className="col-span-3"
  //                 placeholder="일정 제목을 입력하세요"
  //               />
  //             </div>
  //             <div className="grid grid-cols-4 items-center gap-4">
  //               <Label htmlFor="description" className="text-right">
  //                 설명
  //               </Label>
  //               <Textarea
  //                 id="description"
  //                 value={newSchedule.description}
  //                 onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
  //                 className="col-span-3"
  //                 placeholder="일정에 대한 설명을 입력하세요"
  //               />
  //             </div>
  //             <div className="grid grid-cols-4 items-center gap-4">
  //               <Label htmlFor="startDate" className="text-right">
  //                 시작일
  //               </Label>
  //               <Input
  //                 id="startDate"
  //                 type="datetime-local"
  //                 value={newSchedule.startDate}
  //                 onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
  //                 className="col-span-3"
  //               />
  //             </div>
  //             <div className="grid grid-cols-4 items-center gap-4">
  //               <Label htmlFor="endDate" className="text-right">
  //                 종료일
  //               </Label>
  //               <Input
  //                 id="endDate"
  //                 type="datetime-local"
  //                 value={newSchedule.endDate}
  //                 onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
  //                 className="col-span-3"
  //               />
  //             </div>
  //             <div className="grid grid-cols-4 items-center gap-4">
  //               <Label htmlFor="typeId" className="text-right">
  //                 카테고리
  //               </Label>
  //               <Select value={newSchedule.typeId} onValueChange={(value) => setNewSchedule({ ...newSchedule, typeId: value })}>
  //                 <SelectTrigger className="col-span-3">
  //                   <SelectValue placeholder="카테고리를 선택하세요" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {scheduleTypes.map((type) => (
  //                     <SelectItem key={type.id} value={type.id.toString()}>
  //                       {type.category}
  //                   </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //             <div className="grid grid-cols-4 items-center gap-4">
  //               <Label htmlFor="location" className="text-right">
  //                 장소
  //               </Label>
  //               <Input
  //                 id="location"
  //                 value={newSchedule.location}
  //                 onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
  //                 className="col-span-3"
  //                 placeholder="장소를 입력하세요"
  //               />
  //             </div>
  //             <div className="grid grid-cols-4 items-center gap-4">
  //               <Label htmlFor="participants" className="text-right">
  //                 참석자
  //               </Label>
  //               <Input
  //                 id="participants"
  //                 value={newSchedule.participants}
  //                 onChange={(e) => setNewSchedule({ ...newSchedule, participants: e.target.value })}
  //                 className="col-span-3"
  //                 placeholder="참석자를 입력하세요"
  //               />
  //             </div>
  //           </div>
  //           <DialogFooter>
  //             <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
  //               취소
  //             </Button>
  //             <Button onClick={handleAddSchedule}>추가</Button>
  //           </DialogFooter>
  //         </DialogContent>
  //       </Dialog>
  //     </div>
  //   )
  // }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "완료":
        return "bg-green-100 text-green-800 border-green-200"
      case "진행중":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "계획":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case "완료":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "진행중":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "계획":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventsForDate = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    const currentDateObj = new Date(dateStr)
    
    return schedules.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate
      
      // 시작일과 종료일 사이에 해당 날짜가 포함되는지 확인
      return currentDateObj >= eventStartDate && currentDateObj <= eventEndDate
    })
  }

  // 일정의 표시 스타일 결정
  const getEventStyle = (event: Schedule, day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const currentDateObj = new Date(year, month, day)
    const eventStartDate = new Date(event.startDate)
    const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate
    
    const isStartDay = currentDateObj.getTime() === eventStartDate.getTime()
    const isEndDay = currentDateObj.getTime() === eventEndDate.getTime()
    const isMultiDay = eventStartDate.getTime() !== eventEndDate.getTime()
    
    let className = "text-xs p-1 text-white cursor-pointer hover:opacity-80 transition-opacity"
    
    if (isMultiDay) {
      if (isStartDay) {
        className += " rounded-l-md rounded-r-none"
      } else if (isEndDay) {
        className += " rounded-r-md rounded-l-none"
      } else {
        className += " rounded-none"
      }
    } else {
      className += " rounded-md"
    }
    
    return className
  }

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, "0")}월`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const resetToToday = () => {
    const today = new Date()
    setCurrentDate(today)
  }

  const renderCalendarView = () => {
    const days = getDaysInMonth(currentDate)
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

    return (
      <div className="bg-white rounded-lg border">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">캘린더</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">일정 목록</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <span className="text-sm">주간</span>
            <span className="text-sm">월간</span> */}
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[100px] text-center">{formatMonth(currentDate)}</span>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={resetToToday}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Week headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`text-center text-sm font-medium p-2 ${
                  index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-700"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 일정이 없을 때 메시지 */}
          {schedules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>이번 달 등록된 일정이 없습니다.</p>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 mt-4">
                    <Plus className="h-4 w-4" />첫 번째 일정 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>새 일정 추가</DialogTitle>
                    <DialogDescription>
                      프로젝트에 새로운 일정을 추가합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        제목
                      </Label>
                      <Input
                        id="title"
                        value={newSchedule.title}
                        onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                        className="col-span-3"
                        placeholder="일정 제목을 입력하세요"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        설명
                      </Label>
                      <Textarea
                        id="description"
                        value={newSchedule.description}
                        onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                        className="col-span-3"
                        placeholder="일정에 대한 설명을 입력하세요"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="startDate" className="text-right">
                        시작일
                      </Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={newSchedule.startDate}
                        onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="endDate" className="text-right">
                        종료일
                      </Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={newSchedule.endDate}
                        onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="typeId" className="text-right">
                        카테고리
                      </Label>
                      <Select value={newSchedule.typeId} onValueChange={(value) => setNewSchedule({ ...newSchedule, typeId: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {scheduleTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        장소
                      </Label>
                      <Input
                        id="location"
                        value={newSchedule.location}
                        onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                        className="col-span-3"
                        placeholder="장소를 입력하세요"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="participants" className="text-right">
                        참석자
                      </Label>
                      <Input
                        id="participants"
                        value={newSchedule.participants}
                        onChange={(e) => setNewSchedule({ ...newSchedule, participants: e.target.value })}
                        className="col-span-3"
                        placeholder="참석자를 입력하세요"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddSchedule}>추가</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0" style={{ marginLeft: '-1px', marginRight: '-1px' }}>
            {days.map((day, index) => {
              const events = day ? getEventsForDate(day) : []
              const today = new Date()
              const isToday = day && 
                today.getDate() === day && 
                today.getMonth() === currentDate.getMonth() && 
                today.getFullYear() === currentDate.getFullYear()

              return (
                <div
                  key={index}
                  className={`min-h-[100px] border border-gray-200 ${
                    day ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                  }`}
                  style={{ marginLeft: '-1px' }}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-medium mb-1 p-1 ${isToday ? "text-blue-600 font-bold" : "text-gray-900"}`}
                      >
                        {day}
                      </div>
                      <div className="space-y-1">
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className={`group relative ${getEventStyle(event, day)}`}
                            style={{ backgroundColor: getTypeById(event.typeId)?.color || '#6B7280' }}
                            onClick={() => openEditModal(event)}
                            title={`${event.title} - 클릭하여 수정`}
                          >
                            <span className="text-xs text-white cursor-pointer hover:opacity-80 transition-opacity">
                              {event.title}
                            </span>
                            <button
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteSchedule(event.id)
                              }}
                              title="삭제"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderTimelineView = () => {
    return (
      <div className="bg-white rounded-lg border">
        {/* Timeline Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">캘린더</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">일정 목록</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <span className="text-sm">주간</span>
            <span className="text-sm">월간</span> */}
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[100px] text-center">{formatMonth(currentDate)}</span>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={resetToToday}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="text-center text-sm text-muted-foreground mb-4">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 - 총 {schedules.length}건의 일정
          </div>

          <div className="space-y-4">
            {schedules.map((event, index) => (
              <div key={event.id} className="flex items-start gap-4 group">
                <div 
                  className="w-1 h-16 rounded"
                  style={{ backgroundColor: getTypeById(event.typeId)?.color || '#6B7280' }}
                ></div>
                <div className="flex-1 cursor-pointer" onClick={() => openEditModal(event)}>
                  <div className="text-sm text-muted-foreground mb-1">
                    {event.startDate.slice(0, 10)} ({["일", "월", "화", "수", "목", "금", "토"][new Date(event.startDate).getDay()]}){" "}
                    {event.startDate.slice(11, 16)} - {event.endDate ? event.endDate.slice(11, 16) : ''}
                  </div>
                  <div className="font-medium mb-2">{event.title}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>{getTypeById(event.typeId)?.category}</span>
                    <span>👥 {event.participants || '0'}</span>
                    <span>📎 0</span>
                    <span>💬 0</span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSchedule(event.id)
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Search Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="일정 제목을 입력해주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div> */}
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />일정 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>새 일정 추가</DialogTitle>
                <DialogDescription>
                  프로젝트에 새로운 일정을 추가합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    제목
                  </Label>
                  <Input
                    id="title"
                    value={newSchedule.title}
                    onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                    className="col-span-3"
                    placeholder="일정 제목을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    설명
                  </Label>
                  <Textarea
                    id="description"
                    value={newSchedule.description}
                    onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                    className="col-span-3"
                    placeholder="일정에 대한 설명을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    시작일
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={newSchedule.startDate}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    종료일
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={newSchedule.endDate}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="typeId" className="text-right">
                    카테고리
                  </Label>
                  <Select value={newSchedule.typeId} onValueChange={(value) => setNewSchedule({ ...newSchedule, typeId: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {scheduleTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    장소
                  </Label>
                  <Input
                    id="location"
                    value={newSchedule.location}
                    onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                    className="col-span-3"
                    placeholder="장소를 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="participants" className="text-right">
                    참석자
                  </Label>
                  <Input
                    id="participants"
                    value={newSchedule.participants}
                    onChange={(e) => setNewSchedule({ ...newSchedule, participants: e.target.value })}
                    className="col-span-3"
                    placeholder="참석자를 입력하세요"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleAddSchedule}>추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Schedule Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>일정 수정</DialogTitle>
            <DialogDescription>
              일정 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          {editingSchedule && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  제목
                </Label>
                <Input
                  id="edit-title"
                  value={editingSchedule.title}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, title: e.target.value })}
                  className="col-span-3"
                  placeholder="일정 제목을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  설명
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingSchedule.description || ""}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, description: e.target.value })}
                  className="col-span-3"
                  placeholder="일정에 대한 설명을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-startDate" className="text-right">
                  시작일
                </Label>
                <Input
                  id="edit-startDate"
                  type="datetime-local"
                  value={editingSchedule.startDate}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, startDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-endDate" className="text-right">
                  종료일
                </Label>
                <Input
                  id="edit-endDate"
                  type="datetime-local"
                  value={editingSchedule.endDate || ""}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, endDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-typeId" className="text-right">
                  카테고리
                </Label>
                <Select 
                  value={editingSchedule.typeId?.toString() || ""} 
                  onValueChange={(value) => setEditingSchedule({ ...editingSchedule, typeId: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {scheduleTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  장소
                </Label>
                <Input
                  id="edit-location"
                  value={editingSchedule.location || ""}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, location: e.target.value })}
                  className="col-span-3"
                  placeholder="장소를 입력하세요"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-participants" className="text-right">
                  참석자
                </Label>
                <Input
                  id="edit-participants"
                  value={editingSchedule.participants || ""}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, participants: e.target.value })}
                  className="col-span-3"
                  placeholder="참석자를 입력하세요"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditSchedule}>수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar/Timeline Area */}
        <div className="lg:col-span-3">
          <div className="flex gap-2 mb-4">
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              캘린더
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              일정 목록
            </Button>
          </div>

          {viewMode === "calendar" ? renderCalendarView() : renderTimelineView()}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">다가오는 일정</CardTitle>
              {upcomingSchedules.length === 0 ? (
                <p className="text-sm text-muted-foreground">다가오는 일정이 없습니다.</p>
              ) : (
                <p className="text-sm text-muted-foreground">오늘부터 2주간</p>
              )}
            </CardHeader>
            {upcomingSchedules.length > 0 && (
              <CardContent className="space-y-3">
                {upcomingSchedules.slice(0, 5).map((schedule) => {
                  const scheduleDate = new Date(schedule.startDate)
                  const today = new Date()
                  const diffTime = scheduleDate.getTime() - today.getTime()
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                  
                  return (
                    <div key={schedule.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getTypeById(schedule.typeId)?.color || '#6B7280' }}
                          ></div>
                          <span className="text-sm font-medium truncate">{schedule.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {diffDays === 0 ? '오늘' : diffDays === 1 ? '내일' : `${diffDays}일 후`}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-4">
                        {scheduleDate.toLocaleDateString('ko-KR', { 
                          month: 'short', 
                          day: 'numeric',
                          weekday: 'short'
                        })} {scheduleDate.toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {schedule.location && (
                        <div className="text-xs text-muted-foreground ml-4">
                          📍 {schedule.location}
                        </div>
                      )}
                    </div>
                  )
                })}
                {upcomingSchedules.length > 5 && (
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                    +{upcomingSchedules.length - 5}건 더
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Work Statistics */}
          {/* <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">이번 달 업무 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">진행일정</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{stats.upcoming}건</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.total > 0 ? Math.round((stats.upcoming / stats.total) * 100) : 0}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">완료일정</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{stats.completed}건</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-sm">전체</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{stats.total}건</div>
                  <div className="text-xs text-muted-foreground">100%</div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Total Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">이번 달 총 일정</CardTitle>
                <span className="text-blue-600 text-sm font-medium">{stats.currentMonth}건</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {currentDate.getMonth() === 0 ? '1월' : `${currentDate.getMonth()}월`} 일정: {stats.currentMonth}건
                </p>
                {previousMonthCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {currentDate.getMonth() === 0 ? '12월' : `${currentDate.getMonth() - 1}월`} 일정: {previousMonthCount}건
                  </p>
                )}
                {stats.currentMonth > previousMonthCount ? (
                  <p className="text-sm text-green-600">
                    전월 대비 {stats.currentMonth - previousMonthCount}건 증가
                  </p>
                ) : stats.currentMonth < previousMonthCount ? (
                  <p className="text-sm text-red-600">
                    전월 대비 {previousMonthCount - stats.currentMonth}건 감소
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    전월 대비 변화 없음
                  </p>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Announcements */}
          <Announcements projectId={project?.id} />
        </div>
      </div>
    </div>
  )
}
