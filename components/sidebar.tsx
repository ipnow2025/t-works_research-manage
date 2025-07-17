"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Download,
  Users,
  FlaskRoundIcon as Flask,
  DollarSign,
  Settings,
  CheckCircle,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      name: "대시보드",
      path: "/",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "인력관리",
      path: "/people",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "시약/장비관리",
      path: "/equipment",
      icon: <Flask className="w-4 h-4" />,
    },
    {
      name: "연구과제/성과관리",
      path: "/projects",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      name: "완료/미선정 과제",
      path: "/completed",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      name: "예산관리",
      path: "/budget",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      name: "일정관리",
      path: "/schedule",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      name: "보고서 출력",
      path: "/reports",
      icon: <Download className="w-4 h-4" />,
    },
    {
      name: "시스템관리",
      path: "/admin",
      icon: <Settings className="w-4 h-4" />,
    },
  ]

  return (
    <div className="w-[220px] bg-white border-r border-gray-200 fixed h-screen">
      <div className="p-5 text-xl font-bold text-blue-800 border-b border-gray-200 mb-5">연구실 대시보드</div>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link href={item.path}>
              <div
                className={`flex items-center gap-2.5 py-3 px-5 cursor-pointer ${
                  pathname === item.path ? "bg-blue-50 text-blue-800 border-l-3 border-blue-800" : "hover:bg-blue-50/50"
                }`}
              >
                {item.icon}
                {item.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
