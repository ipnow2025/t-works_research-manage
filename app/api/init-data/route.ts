import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // 기존 데이터 확인
    const existingOrgs = await prisma.manageOrganization.count({ where: { isFlag: 1 } })
    const existingResearchers = await prisma.managePi.count({ where: { isFlag: 1 } })
    const existingProjects = await prisma.manageProject.count({ where: { isFlag: 1 } })

    // 수행기관 초기 데이터
    if (existingOrgs === 0) {
      const organizations = [
        "과학기술정보통신부",
        "산업통상자원부", 
        "환경부",
        "보건복지부"
      ]

      for (const org of organizations) {
        await prisma.manageOrganization.create({
          data: {
            name: org,
            regDate: Math.floor(Date.now() / 1000),
            mdyDate: Math.floor(Date.now() / 1000)
          }
        })
      }
    }

    // 연구책임자 초기 데이터
    if (existingResearchers === 0) {
      const researchers = [
        "김교수",
        "이교수",
        "박교수", 
        "최교수"
      ]

      for (const researcher of researchers) {
        await prisma.managePi.create({
          data: {
            name: researcher,
            regDate: Math.floor(Date.now() / 1000),
            mdyDate: Math.floor(Date.now() / 1000)
          }
        })
      }
    }

    // 프로젝트 초기 데이터
    if (existingProjects === 0) {
      const projects = [
        {
          name: "차세대 양자컴퓨팅 기술 개발",
          type: "planning",
          organization: "과학기술정보통신부",
          piName: "김교수",
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-06-30"),
          budget: 500000000,
          description: "차세대 양자컴퓨팅 기술 개발을 위한 연구",
          status: "기획중"
        },
        {
          name: "바이오 신약 개발 플랫폼 구축",
          type: "application",
          organization: "보건복지부",
          piName: "박교수",
          startDate: new Date("2025-02-01"),
          endDate: new Date("2025-05-15"),
          budget: 300000000,
          description: "바이오 신약 개발을 위한 플랫폼 구축",
          status: "신청완료"
        },
        {
          name: "인공지능 기반 자율주행 기술 개발",
          type: "ongoing",
          organization: "과학기술정보통신부",
          piName: "김교수",
          startDate: new Date("2023-04-01"),
          endDate: new Date("2026-03-31"),
          budget: 1000000000,
          description: "AI 기반 자율주행 시스템 개발",
          status: "진행중"
        },
        {
          name: "친환경 소재 개발 연구",
          type: "ongoing",
          organization: "환경부",
          piName: "이교수",
          startDate: new Date("2024-01-15"),
          endDate: new Date("2025-12-31"),
          budget: 400000000,
          description: "친환경 신소재 개발 및 상용화 연구",
          status: "진행중"
        }
      ]

      for (const project of projects) {
        await prisma.manageProject.create({
          data: {
            ...project,
            regDate: Math.floor(Date.now() / 1000),
            mdyDate: Math.floor(Date.now() / 1000)
          }
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Initialized ${existingOrgs === 0 ? 4 : 0} organizations, ${existingResearchers === 0 ? 4 : 0} researchers, and ${existingProjects === 0 ? 4 : 0} projects`
    })
  } catch (error) {
    console.error('Error initializing data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize data' },
      { status: 500 }
    )
  }
} 