import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 포맷팅 유틸리티 함수들
export function formatDateString(dateString: string) {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return dateString
    }
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateString
  }
}

export function formatTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('ko-KR')
}
