"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Download, Calendar, X, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function EquipmentPage() {
  const [showNewEquipmentForm, setShowNewEquipmentForm] = useState(false)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showInventoryForm, setShowInventoryForm] = useState(false)
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [newEquipment, setNewEquipment] = useState({
    type: "시약",
    name: "",
    manufacturer: "",
    model: "",
    quantity: "",
    unit: "ml",
    location: "",
    purchaseDate: "",
    expiryDate: "",
    manager: "",
    description: "",
  })
  const [reservation, setReservation] = useState({
    type: "장비",
    equipment: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  })
  const [inventoryEntry, setInventoryEntry] = useState({
    reagentId: "",
    type: "입고",
    quantity: "",
    unit: "ml",
    date: new Date().toISOString().split("T")[0],
    user: "",
    note: "",
  })

  const [maintenanceEntry, setMaintenanceEntry] = useState({
    equipmentId: "",
    type: "정기 점검",
    date: new Date().toISOString().split("T")[0],
    user: "",
    note: "",
  })

  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeDetailTab, setActiveDetailTab] = useState("info")

  // Sample user data from system management
  const systemUsers = [
    { id: "1", name: "김교수" },
    { id: "2", name: "이연구원" },
    { id: "3", name: "박연구원" },
    { id: "4", name: "최연구원" },
    { id: "5", name: "정연구원" },
  ]

  // 시약별 입출고 내역 데이터
  const reagentInventoryData = {
    "R-001": [
      { id: 1, date: "2025-05-15", type: "입고", quantity: "+500ml", user: "김교수", note: "신규 구매" },
      { id: 2, date: "2025-05-10", type: "출고", quantity: "-200ml", user: "박연구원", note: "실험 사용" },
      { id: 3, date: "2025-05-05", type: "출고", quantity: "-100ml", user: "이연구원", note: "실험 사용" },
      { id: 4, date: "2025-04-20", type: "입고", quantity: "+1000ml", user: "김교수", note: "신규 구매" },
      { id: 5, date: "2025-04-15", type: "출고", quantity: "-300ml", user: "최연구원", note: "실험 사용" },
    ],
    "R-002": [
      { id: 1, date: "2025-05-12", type: "입고", quantity: "+1000ml", user: "김교수", note: "신규 구매" },
      { id: 2, date: "2025-05-08", type: "출고", quantity: "-150ml", user: "이연구원", note: "실험 사용" },
      { id: 3, date: "2025-05-03", type: "출고", quantity: "-200ml", user: "박연구원", note: "실험 사용" },
    ],
    "R-003": [
      { id: 1, date: "2025-05-10", type: "입고", quantity: "+500g", user: "김교수", note: "신규 구매" },
      { id: 2, date: "2025-05-05", type: "출고", quantity: "-50g", user: "최연구원", note: "실험 사용" },
    ],
  }

  // 시약 현재 재고량 계산 함수
  const calculateCurrentStock = (reagentId) => {
    if (!reagentInventoryData[reagentId]) return "0ml"

    let total = 0
    let unit = "ml"

    reagentInventoryData[reagentId].forEach((entry) => {
      const quantity = entry.quantity
      const value = Number.parseInt(quantity.replace(/[^0-9-]/g, ""))
      if (quantity.includes("g")) {
        unit = "g"
      } else if (quantity.includes("kg")) {
        unit = "kg"
      } else if (quantity.includes("L")) {
        unit = "L"
      }
      total += value
    })

    return `${total}${unit}`
  }

  // 시약 데이터 확장
  const reagentItems = [
    {
      id: "R-001",
      name: "에탄올 (99.5%)",
      type: "시약",
      location: "시약보관실 A-3",
      initialQuantity: "1000ml",
      currentStock: calculateCurrentStock("R-001"),
      status: "사용가능",
      statusClass: "bg-green-50 text-green-600",
      manager: "이연구원",
      manufacturer: "Sigma-Aldrich",
      model: "E7023",
      purchaseDate: "2025-03-15",
      expiryDate: "2025-12-31",
      description:
        "분자식: C₂H₅OH, 분자량: 46.07 g/mol. 실험실 용도로 사용되는 고순도 에탄올입니다. 인화성이 높으니 취급에 주의하세요.",
      lastActivity: "2025-05-15 (입고: +500ml)",
    },
    {
      id: "R-002",
      name: "아세톤",
      type: "시약",
      location: "시약보관실 A-2",
      initialQuantity: "1000ml",
      currentStock: calculateCurrentStock("R-002"),
      status: "사용가능",
      statusClass: "bg-green-50 text-green-600",
      manager: "박연구원",
      manufacturer: "Merck",
      model: "A4206",
      purchaseDate: "2025-04-10",
      expiryDate: "2026-04-10",
      description:
        "분자식: C₃H₆O, 분자량: 58.08 g/mol. 유기 용매로 사용되는 아세톤입니다. 인화성이 높으니 취급에 주의하세요.",
      lastActivity: "2025-05-08 (출고: -150ml)",
    },
    {
      id: "R-003",
      name: "염화나트륨",
      type: "시약",
      location: "시약보관실 B-1",
      initialQuantity: "500g",
      currentStock: calculateCurrentStock("R-003"),
      status: "사용가능",
      statusClass: "bg-green-50 text-green-600",
      manager: "최연구원",
      manufacturer: "Sigma-Aldrich",
      model: "S7653",
      purchaseDate: "2025-05-01",
      expiryDate: "2027-05-01",
      description: "분자식: NaCl, 분자량: 58.44 g/mol. 실험실 용도로 사용되는 고순도 염화나트륨입니다.",
      lastActivity: "2025-05-05 (출고: -50g)",
    },
  ]

  // 장비 데이터
  const equipmentOnlyItems = [
    {
      id: "E-001",
      name: "전자현미경",
      type: "장비",
      location: "실험실 2",
      quantity: "1개",
      status: "유지보수 예정",
      statusClass: "bg-amber-50 text-amber-600",
      manager: "박연구원",
      manufacturer: "JEOL",
      model: "JEM-2100F",
      purchaseDate: "2023-05-10",
      expiryDate: "2025-05-21",
      description:
        "고해상도 투과전자현미경(TEM)으로, 나노 수준의 시료 관찰에 사용됩니다. 사용 전 교육이 필수적이며, 예약 후 사용 가능합니다.",
    },
    {
      id: "E-002",
      name: "질량분석기",
      type: "장비",
      location: "실험실 1",
      quantity: "1개",
      status: "사용가능",
      statusClass: "bg-green-50 text-green-600",
      manager: "김교수",
      manufacturer: "Thermo Fisher",
      model: "Q Exactive HF",
      purchaseDate: "2024-01-15",
      expiryDate: "2025-07-15",
      description: "고분해능 질량분석기로, 단백질 및 대사체 분석에 사용됩니다. 사용 전 관리자에게 문의하세요.",
    },
  ]

  // 모든 장비 항목 (시약 + 장비)
  const equipmentItems = [...reagentItems, ...equipmentOnlyItems]

  // Sample equipment reservation data
  const reservationData = [
    {
      id: 1,
      equipment: "전자현미경",
      user: "김교수",
      date: "2025-05-04",
      time: "09:00-12:00",
      status: "예약됨",
      color: "blue",
    },
    {
      id: 2,
      equipment: "질량분석기",
      user: "이연구원",
      date: "2025-05-05",
      time: "13:00-15:00",
      status: "예약됨",
      color: "blue",
    },
    {
      id: 3,
      equipment: "전자현미경",
      user: "박연구원",
      date: "2025-05-08",
      time: "10:00-11:30",
      status: "예약됨",
      color: "blue",
    },
    {
      id: 4,
      equipment: "질량분석기",
      user: "최연구원",
      date: "2025-05-15",
      time: "14:00-16:00",
      status: "예약됨",
      color: "blue",
    },
    {
      id: 5,
      equipment: "전자현미경",
      user: "정연구원",
      date: "2025-05-18",
      time: "09:00-17:00",
      status: "예약됨",
      color: "blue",
    },
    {
      id: 6,
      equipment: "전자현미경",
      user: "시스템",
      date: "2025-05-21",
      time: "전일",
      status: "유지보수",
      color: "red",
    },
    {
      id: 7,
      equipment: "질량분석기",
      user: "시스템",
      date: "2025-05-01",
      time: "전일",
      status: "유지보수",
      color: "red",
    },
  ]

  const handleNewEquipmentChange = (e) => {
    const { name, value } = e.target
    setNewEquipment((prev) => ({ ...prev, [name]: value }))
  }

  const handleReservationChange = (e) => {
    const { name, value } = e.target
    setReservation((prev) => ({ ...prev, [name]: value }))
  }

  const handleInventoryEntryChange = (e) => {
    const { name, value } = e.target
    setInventoryEntry((prev) => ({ ...prev, [name]: value }))
  }

  const handleMaintenanceEntryChange = (e) => {
    const { name, value } = e.target
    setMaintenanceEntry((prev) => ({ ...prev, [name]: value }))
  }

  const handleNewEquipmentSubmit = () => {
    // In a real application, this would save the equipment to a database
    alert("새 시약/장비가 등록되었습니다.")
    setShowNewEquipmentForm(false)
    setNewEquipment({
      type: "시약",
      name: "",
      manufacturer: "",
      model: "",
      quantity: "",
      unit: "ml",
      location: "",
      purchaseDate: "",
      expiryDate: "",
      manager: "",
      description: "",
    })
  }

  const handleReservationSubmit = () => {
    // In a real application, this would save the reservation to a database
    alert("장비 예약이 등록되었습니다.")
    setShowReservationForm(false)
    setReservation({
      type: "장비",
      equipment: "",
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
    })
  }

  const handleInventoryEntrySubmit = () => {
    // In a real application, this would save the inventory entry to a database
    alert(`시약 ${inventoryEntry.type}이(가) 등록되었습니다.`)
    setShowInventoryForm(false)
    setInventoryEntry({
      reagentId: "",
      type: "입고",
      quantity: "",
      unit: "ml",
      date: new Date().toISOString().split("T")[0],
      user: "",
      note: "",
    })
  }

  const handleMaintenanceEntrySubmit = () => {
    // In a real application, this would save the maintenance entry to a database
    alert("유지보수 일정이 등록되었습니다.")
    setShowMaintenanceForm(false)
    setMaintenanceEntry({
      equipmentId: "",
      type: "정기 점검",
      date: new Date().toISOString().split("T")[0],
      user: "",
      note: "",
    })
  }

  const handleShowDetail = (item) => {
    setSelectedItem(item)
    setShowDetailModal(true)
    setActiveDetailTab("info")
  }

  const handleReserveEquipment = (item) => {
    setSelectedItem(item)
    setShowReservationForm(true)
  }

  const handleAddInventory = (item) => {
    setSelectedItem(item)
    setInventoryEntry({
      ...inventoryEntry,
      reagentId: item.id,
    })
    setShowInventoryForm(true)
  }

  const handleAddMaintenance = (item) => {
    setSelectedItem(item)
    setMaintenanceEntry({
      ...maintenanceEntry,
      equipmentId: item.id,
    })
    setShowMaintenanceForm(true)
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-5">시약/장비관리</h1>
      </div>

      <Tabs defaultValue="list" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="list">시약/장비 리스트</TabsTrigger>
          <TabsTrigger value="request">사용 신청</TabsTrigger>
          <TabsTrigger value="inventory">재고 및 유지보수 내역</TabsTrigger>
          <TabsTrigger value="reservation">장비 예약 캘린더</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">시약/장비 리스트</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    엑셀 다운로드
                  </Button>
                  <Button className="flex items-center gap-1.5" onClick={() => setShowNewEquipmentForm(true)}>
                    <Plus className="w-4 h-4" />
                    신규 등록
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center mb-5">
                <div className="flex-1 min-w-[250px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input type="text" placeholder="시약/장비명 검색..." className="pl-9 w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500 font-medium">상태</label>
                  <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="all">
                    <option value="all">전체</option>
                    <option value="available">사용가능</option>
                    <option value="low">재고부족</option>
                    <option value="maintenance">유지보수중</option>
                  </select>
                </div>
              </div>

              {/* 시약 리스트 섹션 */}
              <div className="mb-8">
                <h3 className="text-md font-semibold mb-3 pb-2 border-b border-gray-200">시약 리스트</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-xs font-medium text-gray-500">ID</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">명칭</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">위치</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">현재 재고량</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">최근 활동</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">관리자</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reagentItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="p-3">{item.id}</td>
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.location}</td>
                          <td className="p-3 font-medium">{item.currentStock}</td>
                          <td className="p-3 text-sm text-gray-600">{item.lastActivity}</td>
                          <td className="p-3">{item.manager}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleShowDetail(item)}>
                                상세
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleAddInventory(item)}>
                                입출고
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 장비 리스트 섹션 */}
              <div>
                <h3 className="text-md font-semibold mb-3 pb-2 border-b border-gray-200">장비 리스트</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-xs font-medium text-gray-500">ID</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">명칭</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">위치</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">수량</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">관리자</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentOnlyItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="p-3">{item.id}</td>
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.location}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${item.statusClass}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3">{item.manager}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleShowDetail(item)}>
                                상세
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleReserveEquipment(item)}>
                                예약
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request">
          <Card>
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold mb-5">사용 신청</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">유형 선택</label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="request-reagent" name="request-type" defaultChecked />
                      <label htmlFor="request-reagent">시약 수량 신청</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="request-equipment" name="request-type" />
                      <label htmlFor="request-equipment">장비 예약</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">시약/장비 선택 *</label>
                  <select className="p-2 border border-gray-200 rounded-md">
                    <option value="">시약/장비 선택</option>
                    <option value="R-001">에탄올 (99.5%)</option>
                    <option value="R-002">아세톤</option>
                    <option value="R-003">염화나트륨</option>
                    <option value="E-001">전자현미경</option>
                    <option value="E-002">질량분석기</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">신청자 *</label>
                  <Input type="text" value="이연구원" disabled />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">신청 일자 *</label>
                  <Input type="date" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">신청 수량 *</label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="수량" className="flex-1" />
                    <select className="p-2 border border-gray-200 rounded-md text-sm w-24">
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ea">개</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">예약 시간 (장비의 경우)</label>
                  <div className="flex gap-2">
                    <Input type="time" className="flex-1" />
                    <span className="flex items-center">~</span>
                    <Input type="time" className="flex-1" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <label className="text-sm font-medium">사용 목적</label>
                <textarea
                  className="w-full p-2 border border-gray-200 rounded-md min-h-[100px]"
                  placeholder="시약/장비 사용 목적을 입력하세요."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">취소</Button>
                <Button>신청하기</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">재고 및 유지보수 내역</h2>
                <Button variant="outline" className="flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  엑셀 다운로드
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 items-center mb-5">
                <div className="flex-1 min-w-[250px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input type="text" placeholder="시약/장비명 검색..." className="pl-9 w-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500 font-medium">유형</label>
                  <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="all">
                    <option value="all">전체</option>
                    <option value="reagent">시약</option>
                    <option value="equipment">장비</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500 font-medium">기간</label>
                  <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[150px]" defaultValue="month">
                    <option value="month">최근 1개월</option>
                    <option value="quarter">최근 3개월</option>
                    <option value="half">최근 6개월</option>
                    <option value="year">최근 1년</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-500">날짜</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">ID</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">명칭</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">유형</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">작업 내용</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">변동량</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500">담당자</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-15</td>
                      <td className="p-3">R-001</td>
                      <td className="p-3">에탄올 (99.5%)</td>
                      <td className="p-3">시약</td>
                      <td className="p-3">입고</td>
                      <td className="p-3 text-green-600 font-medium">+500ml</td>
                      <td className="p-3">김교수</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-10</td>
                      <td className="p-3">R-001</td>
                      <td className="p-3">에탄올 (99.5%)</td>
                      <td className="p-3">시약</td>
                      <td className="p-3">출고</td>
                      <td className="p-3 text-blue-600 font-medium">-200ml</td>
                      <td className="p-3">박연구원</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-10</td>
                      <td className="p-3">E-001</td>
                      <td className="p-3">전자현미경</td>
                      <td className="p-3">장비</td>
                      <td className="p-3">유지보수 일정 등록</td>
                      <td className="p-3">-</td>
                      <td className="p-3">이연구원</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-08</td>
                      <td className="p-3">R-002</td>
                      <td className="p-3">아세톤</td>
                      <td className="p-3">시약</td>
                      <td className="p-3">출고</td>
                      <td className="p-3 text-blue-600 font-medium">-150ml</td>
                      <td className="p-3">이연구원</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-05</td>
                      <td className="p-3">R-001</td>
                      <td className="p-3">에탄올 (99.5%)</td>
                      <td className="p-3">시약</td>
                      <td className="p-3">출고</td>
                      <td className="p-3 text-blue-600 font-medium">-100ml</td>
                      <td className="p-3">이연구원</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">2025-05-05</td>
                      <td className="p-3">R-003</td>
                      <td className="p-3">염화나트륨</td>
                      <td className="p-3">시약</td>
                      <td className="p-3">출고</td>
                      <td className="p-3 text-blue-600 font-medium">-50g</td>
                      <td className="p-3">최연구원</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservation">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">장비 예약 캘린더</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    주간 보기
                  </Button>
                  <Button className="flex items-center gap-1.5" onClick={() => setShowReservationForm(true)}>
                    <Plus className="w-4 h-4" />
                    예약 등록
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500 font-medium">장비 선택</label>
                  <select className="p-2 border border-gray-200 rounded-md text-sm min-w-[200px]" defaultValue="all">
                    <option value="all">전체 장비</option>
                    <option value="E-001">전자현미경</option>
                    <option value="E-002">질량분석기</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
                  <span className="text-sm">예약됨</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded-full"></div>
                  <span className="text-sm">유지보수</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded-full"></div>
                  <span className="text-sm">사용 가능</span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Image
                  src="/images/calendar.png"
                  alt="장비 예약 캘린더"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>

              <div className="mt-5">
                <h3 className="text-md font-semibold mb-3">예약 현황</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-xs font-medium text-gray-500">장비명</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">예약자</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">날짜</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">시간</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservationData.map((reservation) => (
                        <tr key={reservation.id} className="border-b border-gray-100">
                          <td className="p-3">{reservation.equipment}</td>
                          <td className="p-3">{reservation.user}</td>
                          <td className="p-3">{reservation.date}</td>
                          <td className="p-3">{reservation.time}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                reservation.status === "예약됨" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                              }`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                상세
                              </Button>
                              {reservation.status === "예약됨" && (
                                <Button variant="outline" size="sm">
                                  취소
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Equipment Registration Popup */}
      {showNewEquipmentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">신규 등록</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowNewEquipmentForm(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">유형 선택</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="type-reagent"
                        name="type"
                        checked={newEquipment.type === "시약"}
                        onChange={() => setNewEquipment((prev) => ({ ...prev, type: "시약" }))}
                      />
                      <label htmlFor="type-reagent">시약</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="type-equipment"
                        name="type"
                        checked={newEquipment.type === "장비"}
                        onChange={() => setNewEquipment((prev) => ({ ...prev, type: "장비" }))}
                      />
                      <label htmlFor="type-equipment">장비</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" placeholder="자동생성" disabled />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">명칭 *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newEquipment.name}
                    onChange={handleNewEquipmentChange}
                    placeholder="시약/장비 명칭 입력"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="manufacturer">제조사/브랜드 *</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={newEquipment.manufacturer}
                    onChange={handleNewEquipmentChange}
                    placeholder="제조사 또는 브랜드명 입력"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="model">모델/규격 *</Label>
                  <Input
                    id="model"
                    name="model"
                    value={newEquipment.model}
                    onChange={handleNewEquipmentChange}
                    placeholder="모델명 또는 규격 입력"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="quantity">초기 수량/단위 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={newEquipment.quantity}
                      onChange={handleNewEquipmentChange}
                      placeholder="수량"
                      className="flex-1"
                    />
                    <select
                      className="p-2 border border-gray-200 rounded-md text-sm w-24"
                      name="unit"
                      value={newEquipment.unit}
                      onChange={handleNewEquipmentChange}
                    >
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ea">개</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">보관 위치 *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEquipment.location}
                    onChange={handleNewEquipmentChange}
                    placeholder="보관 위치 입력"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="purchaseDate">구매일자</Label>
                  <Input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={newEquipment.purchaseDate}
                    onChange={handleNewEquipmentChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="expiryDate">유효기간/점검주기</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={newEquipment.expiryDate}
                    onChange={handleNewEquipmentChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="manager">관리자 *</Label>
                  <select
                    id="manager"
                    name="manager"
                    value={newEquipment.manager}
                    onChange={handleNewEquipmentChange}
                    className="p-2 border border-gray-200 rounded-md"
                  >
                    <option value="">관리자 선택</option>
                    {systemUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <Label htmlFor="description">상세 설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newEquipment.description}
                  onChange={handleNewEquipmentChange}
                  placeholder="시약/장비에 대한 상세 설명, 주의사항 등을 입력하세요."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewEquipmentForm(false)}>
                  취소
                </Button>
                <Button onClick={handleNewEquipmentSubmit}>등록하기</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Reservation Popup */}
      {showReservationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">장비 예약 등록</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowReservationForm(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="equipment">장비 선택 *</Label>
                  <select
                    id="equipment"
                    name="equipment"
                    value={reservation.equipment}
                    onChange={handleReservationChange}
                    className="p-2 border border-gray-200 rounded-md"
                  >
                    <option value="">장비 선택</option>
                    <option value="E-001">전자현미경</option>
                    <option value="E-002">질량분석기</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="user">신청자 *</Label>
                  <Input type="text" value="이연구원" disabled />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="date">예약 일자 *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={reservation.date}
                    onChange={handleReservationChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="time">예약 시간 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={reservation.startTime}
                      onChange={handleReservationChange}
                      className="flex-1"
                    />
                    <span className="flex items-center">~</span>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={reservation.endTime}
                      onChange={handleReservationChange}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <Label htmlFor="purpose">사용 목적 *</Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={reservation.purpose}
                  onChange={handleReservationChange}
                  placeholder="장비 사용 목적을 입력하세요."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReservationForm(false)}>
                  취소
                </Button>
                <Button onClick={handleReservationSubmit}>예약하기</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Entry Popup */}
      {showInventoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">시약 입출고 등록</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowInventoryForm(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reagentName">시약명</Label>
                  <Input type="text" value={selectedItem ? selectedItem.name : ""} disabled />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">유형 선택 *</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="type-in"
                        name="type"
                        checked={inventoryEntry.type === "입고"}
                        onChange={() => setInventoryEntry((prev) => ({ ...prev, type: "입고" }))}
                      />
                      <label htmlFor="type-in" className="flex items-center gap-1">
                        <ArrowUp className="w-4 h-4 text-green-600" />
                        입고
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="type-out"
                        name="type"
                        checked={inventoryEntry.type === "출고"}
                        onChange={() => setInventoryEntry((prev) => ({ ...prev, type: "출고" }))}
                      />
                      <label htmlFor="type-out" className="flex items-center gap-1">
                        <ArrowDown className="w-4 h-4 text-blue-600" />
                        출고
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="date">날짜 *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={inventoryEntry.date}
                    onChange={handleInventoryEntryChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="quantity">수량 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={inventoryEntry.quantity}
                      onChange={handleInventoryEntryChange}
                      placeholder="수량"
                      className="flex-1"
                    />
                    <select
                      className="p-2 border border-gray-200 rounded-md text-sm w-24"
                      name="unit"
                      value={inventoryEntry.unit}
                      onChange={handleInventoryEntryChange}
                    >
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ea">개</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="user">담당자 *</Label>
                  <select
                    id="user"
                    name="user"
                    value={inventoryEntry.user}
                    onChange={handleInventoryEntryChange}
                    className="p-2 border border-gray-200 rounded-md"
                  >
                    <option value="">담당자 선택</option>
                    {systemUsers.map((user) => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <Label htmlFor="note">비고</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={inventoryEntry.note}
                  onChange={handleInventoryEntryChange}
                  placeholder="입출고 관련 추가 정보를 입력하세요."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowInventoryForm(false)}>
                  취소
                </Button>
                <Button onClick={handleInventoryEntrySubmit}>등록하기</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedItem.name} 상세정보</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowDetailModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-5">
                <div className="flex space-x-2 border-b">
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeDetailTab === "info" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                    }`}
                    onClick={() => setActiveDetailTab("info")}
                  >
                    기본 정보
                  </button>
                  {selectedItem.type === "시약" && (
                    <button
                      className={`px-4 py-2 font-medium ${
                        activeDetailTab === "history" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                      }`}
                      onClick={() => setActiveDetailTab("history")}
                    >
                      입출고 내역
                    </button>
                  )}
                  {selectedItem.type === "장비" && (
                    <button
                      className={`px-4 py-2 font-medium ${
                        activeDetailTab === "reservations"
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveDetailTab("reservations")}
                    >
                      예약 현황
                    </button>
                  )}
                  {selectedItem.type === "장비" && (
                    <button
                      className={`px-4 py-2 font-medium ${
                        activeDetailTab === "maintenance" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                      }`}
                      onClick={() => setActiveDetailTab("maintenance")}
                    >
                      유지보수 관리
                    </button>
                  )}
                </div>
              </div>
              {activeDetailTab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="flex flex-col gap-2">
                    <Label>ID</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.id}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>유형</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.type}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>명칭</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.name}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>제조사/브랜드</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.manufacturer}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>모델/규격</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.model}</div>
                  </div>
                  {selectedItem.type === "시약" ? (
                    <div className="flex flex-col gap-2">
                      <Label>현재 재고량</Label>
                      <div className="p-2 bg-gray-50 rounded font-medium">{selectedItem.currentStock}</div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Label>수량</Label>
                      <div className="p-2 bg-gray-50 rounded">{selectedItem.quantity}</div>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Label>보관 위치</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.location}</div>
                  </div>
                  {selectedItem.type === "장비" && (
                    <div className="flex flex-col gap-2">
                      <Label>상태</Label>
                      <div className="p-2 bg-gray-50 rounded">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${selectedItem.statusClass}`}>
                          {selectedItem.status}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Label>구매일자</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.purchaseDate}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>유효기간/점검주기</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.expiryDate}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>관리자</Label>
                    <div className="p-2 bg-gray-50 rounded">{selectedItem.manager}</div>
                  </div>
                </div>
              )}
              {activeDetailTab === "info" && (
                <div className="flex flex-col gap-2 mb-5">
                  <Label>상세 설명</Label>
                  <div className="p-3 bg-gray-50 rounded min-h-[100px]">{selectedItem.description}</div>
                </div>
              )}
              {activeDetailTab === "history" && selectedItem.type === "시약" && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">입출고 내역</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                        <Download className="w-4 h-4" />
                        엑셀 다운로드
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1.5"
                        onClick={() => handleAddInventory(selectedItem)}
                      >
                        <Plus className="w-4 h-4" />
                        입출고 등록
                      </Button>
                    </div>
                  </div>

                  {/* 현재 재고량 요약 정보 */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">현재 재고량</h5>
                        <p className="text-2xl font-bold mt-1">{selectedItem.currentStock}</p>
                      </div>
                      <div className="text-right">
                        <h5 className="text-sm font-medium text-gray-700">최근 활동</h5>
                        <p className="text-sm mt-1">{selectedItem.lastActivity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-3 text-left text-xs font-medium text-gray-500">날짜</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">유형</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">수량</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">담당자</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reagentInventoryData[selectedItem.id] ? (
                          reagentInventoryData[selectedItem.id].map((history) => (
                            <tr key={history.id} className="border-b border-gray-100">
                              <td className="p-3">{history.date}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${
                                    history.type === "입고" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                                  }`}
                                >
                                  {history.type}
                                </span>
                              </td>
                              <td className="p-3">
                                <span
                                  className={
                                    history.quantity.startsWith("+")
                                      ? "text-green-600 font-medium"
                                      : "text-blue-600 font-medium"
                                  }
                                >
                                  {history.quantity}
                                </span>
                              </td>
                              <td className="p-3">{history.user}</td>
                              <td className="p-3">{history.note}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-3 text-center text-gray-500">
                              입출고 내역이 없습니다.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeDetailTab === "reservations" && selectedItem.type === "장비" && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">예약 현황</h4>
                    <Button
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={() => handleReserveEquipment(selectedItem)}
                    >
                      <Plus className="w-4 h-4" />
                      예약 등록
                    </Button>
                  </div>

                  {/* 장비 상태 요약 정보 */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">장비 상태</h5>
                        <p className="mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${selectedItem.statusClass}`}>
                            {selectedItem.status}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <h5 className="text-sm font-medium text-gray-700">다음 유지보수</h5>
                        <p className="text-sm mt-1">{selectedItem.expiryDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-3 text-left text-xs font-medium text-gray-500">날짜</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">시간</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">예약자</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservationData
                          .filter((res) => res.equipment === selectedItem.name)
                          .map((reservation) => (
                            <tr key={reservation.id} className="border-b border-gray-100">
                              <td className="p-3">{reservation.date}</td>
                              <td className="p-3">{reservation.time}</td>
                              <td className="p-3">{reservation.user}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${
                                    reservation.status === "예약됨"
                                      ? "bg-blue-50 text-blue-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {reservation.status}
                                </span>
                              </td>
                              <td className="p-3">
                                {reservation.status === "예약됨" && (
                                  <Button variant="outline" size="sm">
                                    취소
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        {reservationData.filter((res) => res.equipment === selectedItem.name).length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-3 text-center text-gray-500">
                              예약 내역이 없습니다.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeDetailTab === "maintenance" && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">유지보수 관리</h4>
                    <Button
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={() => handleAddMaintenance(selectedItem)}
                    >
                      <Plus className="w-4 h-4" />
                      유지보수 일정 등록
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-3 text-left text-xs font-medium text-gray-500">날짜</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">유형</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">담당자</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">상태</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-500">비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-3">2025-05-21</td>
                          <td className="p-3">정기 점검</td>
                          <td className="p-3">시스템</td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-xs font-medium bg-amber-50 text-amber-600 rounded">
                              예정됨
                            </span>
                          </td>
                          <td className="p-3">분기별 정기 점검</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3">2025-02-15</td>
                          <td className="p-3">정기 점검</td>
                          <td className="p-3">박연구원</td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded">
                              완료
                            </span>
                          </td>
                          <td className="p-3">분기별 정기 점검</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-3">2024-11-10</td>
                          <td className="p-3">수리</td>
                          <td className="p-3">외부업체</td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded">
                              완료
                            </span>
                          </td>
                          <td className="p-3">렌즈 교체</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                {activeDetailTab === "info" && (
                  <>
                    {selectedItem.type === "시약" ? (
                      <Button onClick={() => handleAddInventory(selectedItem)}>입출고 등록</Button>
                    ) : (
                      <>
                        <Button onClick={() => handleReserveEquipment(selectedItem)}>예약 등록</Button>
                        <Button onClick={() => handleAddMaintenance(selectedItem)}>유지보수 등록</Button>
                      </>
                    )}
                    <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                      닫기
                    </Button>
                  </>
                )}
                {(activeDetailTab === "history" ||
                  activeDetailTab === "reservations" ||
                  activeDetailTab === "maintenance") && (
                  <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                    닫기
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Entry Popup */}
      {showMaintenanceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">유지보수 일정 등록</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowMaintenanceForm(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="equipmentName">장비명</Label>
                  <Input type="text" value={selectedItem ? selectedItem.name : ""} disabled />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">유형 선택 *</Label>
                  <select
                    id="type"
                    name="type"
                    value={maintenanceEntry.type}
                    onChange={handleMaintenanceEntryChange}
                    className="p-2 border border-gray-200 rounded-md"
                  >
                    <option value="정기 점검">정기 점검</option>
                    <option value="수리">수리</option>
                    <option value="교체">부품 교체</option>
                    <option value="청소">청소</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="date">예정 일자 *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={maintenanceEntry.date}
                    onChange={handleMaintenanceEntryChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="user">담당자 *</Label>
                  <select
                    id="user"
                    name="user"
                    value={maintenanceEntry.user}
                    onChange={handleMaintenanceEntryChange}
                    className="p-2 border border-gray-200 rounded-md"
                  >
                    <option value="">담당자 선택</option>
                    {systemUsers.map((user) => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                    <option value="외부업체">외부업체</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                <Label htmlFor="note">세부 내용</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={maintenanceEntry.note}
                  onChange={handleMaintenanceEntryChange}
                  placeholder="유지보수 관련 세부 내용을 입력하세요."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMaintenanceForm(false)}>
                  취소
                </Button>
                <Button onClick={handleMaintenanceEntrySubmit}>등록하기</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
